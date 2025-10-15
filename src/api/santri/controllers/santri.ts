import { factories } from '@strapi/strapi';
import fs from 'node:fs/promises';

type CsvRecord = Record<string, string>;

type ImportError = {
  row: number;
  message: string;
};

type ImportSummary = {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: ImportError[];
};

const isEmptyValue = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  return false;
};

const splitCsvLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (inQuotes) {
      if (char === '"') {
        if (line[index + 1] === '"') {
          current += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
};

const parseCsvContent = (content: string): CsvRecord[] => {
  const rows = content
    .split(/\r?\n/u)
    .filter((row) => row.trim().length > 0);

  if (rows.length === 0) {
    return [];
  }

  const headers = splitCsvLine(rows[0]).map((header) => header.trim());
  const records: CsvRecord[] = [];

  for (let index = 1; index < rows.length; index += 1) {
    const values = splitCsvLine(rows[index]);

    if (values.every((value) => value.trim().length === 0)) {
      continue;
    }

    const record: CsvRecord = {};

    headers.forEach((header, headerIndex) => {
      const value = values[headerIndex];
      record[header] = value !== undefined ? value.trim() : '';
    });

    records.push(record);
  }

  return records;
};

const parseBoolean = (value: string): boolean => {
  const normalized = value.trim().toLowerCase();

  if (['1', 'true', 'yes', 'y', 'ya'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'n', 'tidak', 't'].includes(normalized)) {
    return false;
  }

  throw new Error(`Nilai boolean tidak dikenali: "${value}"`);
};

const normalizeDate = (value: string, fieldName: string): string => {
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/u.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Format tanggal tidak valid untuk kolom ${fieldName}: "${value}"`);
  }

  return parsed.toISOString().slice(0, 10);
};

export default factories.createCoreController('api::santri.santri', ({ strapi }) => ({
  async importCsv(ctx) {
    const requestFiles = (ctx.request as { files?: Record<string, unknown> }).files;

    if (!requestFiles || !(requestFiles as Record<string, unknown>).file) {
      ctx.throw(400, 'File CSV tidak ditemukan. Unggah file dengan field "file".');
    }

    const uploadedFile = (requestFiles as Record<string, unknown>).file as
      | Record<string, unknown>
      | Array<Record<string, unknown>>;

    const uploaded = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

    if (!uploaded) {
      ctx.throw(400, 'File CSV tidak ditemukan.');
    }

    const uploadedRecord = uploaded as Record<string, unknown>;

    const filePath =
      (uploadedRecord.filepath as string | undefined) ?? (uploadedRecord.path as string | undefined);

    if (!filePath) {
      ctx.throw(400, 'Gagal membaca file yang diunggah.');
    }

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const records = parseCsvContent(fileContent);

    const summary: ImportSummary = {
      total: records.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    if (records.length === 0) {
      ctx.body = summary;
      return;
    }

    const resolveLembagaId = async (lembagaValue: string): Promise<number | null> => {
      const trimmed = lembagaValue.trim();

      if (trimmed.length === 0 || trimmed.toLowerCase() === 'null') {
        return null;
      }

      const filters: Array<Record<string, unknown>> = [
        { slug: trimmed },
        { nama: trimmed },
      ];

      const numericId = Number(trimmed);

      if (!Number.isNaN(numericId)) {
        filters.push({ id: numericId });
      }

      const result = await strapi.entityService.findMany('api::lembaga.lembaga', {
        filters: { $or: filters },
        limit: 1,
      });

      if (result.length === 0) {
        throw new Error(`Lembaga dengan referensi "${lembagaValue}" tidak ditemukan`);
      }

      return result[0].id as number;
    };

    const stringFields: Array<keyof CsvRecord> = [
      'nama',
      'tempatLahir',
      'namaAyah',
      'namaIbu',
      'kelurahan',
      'kecamatan',
      'kota',
      'nomorIjazah',
      'kelasAktif',
      'tahunAjaranAktif',
      'tahunIjazah',
      'tahunMasuk',
      'tahunLulus',
    ];

    for (let index = 0; index < records.length; index += 1) {
      const rowNumber = index + 2;
      const record = records[index];

      try {
        const payload: Record<string, unknown> = {};

        stringFields.forEach((field) => {
          const value = record[field];

          if (!isEmptyValue(value)) {
            payload[field] = value;
          }
        });

        if (!isEmptyValue(record.gender)) {
          const genderValue = record.gender.trim().toUpperCase();

          if (!['L', 'P'].includes(genderValue)) {
            throw new Error(`Nilai gender tidak valid: "${record.gender}"`);
          }

          payload.gender = genderValue;
        }

        if (!isEmptyValue(record.tanggalLahir)) {
          payload.tanggalLahir = normalizeDate(record.tanggalLahir, 'tanggalLahir');
        }

        if (!isEmptyValue(record.isAlumni)) {
          payload.isAlumni = parseBoolean(record.isAlumni);
        }

        if (!isEmptyValue(record.lembaga)) {
          payload.lembaga = await resolveLembagaId(record.lembaga);
        }

        const nisnValue = record.nisn?.trim();

        if (!isEmptyValue(nisnValue)) {
          const existing = await strapi.entityService.findMany('api::santri.santri', {
            filters: { nisn: nisnValue },
            limit: 1,
          });

          if (existing.length > 0) {
            await strapi.entityService.update('api::santri.santri', existing[0].id as number, {
              data: payload,
            });
            summary.updated += 1;
            continue;
          }

          payload.nisn = nisnValue;
        }

        await strapi.entityService.create('api::santri.santri', {
          data: payload,
        });

        summary.created += 1;
      } catch (error) {
        summary.skipped += 1;
        summary.errors.push({
          row: rowNumber,
          message: error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui',
        });
      }
    }

    ctx.body = summary;
  },
}));
