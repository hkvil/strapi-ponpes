import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';

export default {
  async importSantri(ctx) {
    const { files } = ctx.request;
    if (!files || !files.file) {
      ctx.throw(400, 'No file uploaded');
    }
    const file = files.file;
    const content = await fs.readFile(file.path, 'utf-8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

  const strapi = ctx.strapi;
    let imported = 0;
    let failed = 0;
    const errors: any[] = [];

  for (const row of records as any[]) {
      try {
        // 1. Tahun Ajaran
        let tahunAjaran = await strapi.db.query('api::tahun-ajaran.tahun-ajaran').findOne({
          where: { tahunAjaran: row.tahunAjaran, semester: row.semester },
        });
        if (!tahunAjaran) {
          tahunAjaran = await strapi.entityService.create('api::tahun-ajaran.tahun-ajaran', {
            data: { tahunAjaran: row.tahunAjaran, semester: row.semester, aktif: false },
          });
        }

        // 2. Lembaga
        const lembaga = await strapi.db.query('api::lembaga.lembaga').findOne({
          where: { slug: row.lembaga },
        });
        if (!lembaga) throw new Error(`Lembaga not found: ${row.lembaga}`);

        // 3. Kelas
        let kelas = await strapi.db.query('api::kelas.kelas').findOne({
          where: { kelas: row.kelas, lembaga: lembaga.id },
        });
        if (!kelas) {
          kelas = await strapi.entityService.create('api::kelas.kelas', {
            data: { kelas: row.kelas, lembaga: lembaga.id },
          });
        }

        // 4. Santri
        let santri = await strapi.db.query('api::santri.santri').findOne({
          where: { nisn: row.nisn },
        });
        if (!santri) {
          santri = await strapi.entityService.create('api::santri.santri', {
            data: {
              nama: row.namaSantri,
              nisn: row.nisn,
              lembaga: lembaga.id,
              gender: row.gender,
              tempatLahir: row.tempatLahir,
              tanggalLahir: row.tanggalLahir,
              namaAyah: row.namaAyah,
              namaIbu: row.namaIbu,
              kelurahan: row.kelurahan,
              kecamatan: row.kecamatan,
              kota: row.kota,
              tahunMasuk: row.tahunMasuk,
              isAlumni: row.isAlumni === 'TRUE',
              tahunLulus: row.tahunLulus || null,
            },
          });
        }

        // 5. Riwayat Kelas
        const existingRiwayat = await strapi.db.query('api::riwayat-kelas.riwayat-kelas').findOne({
          where: {
            santri: santri.id,
            kelas: kelas.id,
            tahunAjaran: tahunAjaran.id,
          },
        });
        if (!existingRiwayat) {
          await strapi.entityService.create('api::riwayat-kelas.riwayat-kelas', {
            data: {
              santri: santri.id,
              kelas: kelas.id,
              tahunAjaran: tahunAjaran.id,
              statusSantri: row.isAlumni === 'TRUE' ? 'LULUS' : 'AKTIF',
              tanggalMulai: `${row.tahunAjaran.split('/')[0]}-07-15`,
              tanggalSelesai: row.isAlumni === 'TRUE' ? `${row.tahunAjaran.split('/')[1]}-06-30` : null,
              catatan: row.isAlumni === 'TRUE' ? 'Lulus dengan baik' : null,
            },
          });
        }
        imported++;
      } catch (err) {
        failed++;
        errors.push({ row, error: err.message });
      }
    }

    ctx.send({ imported, failed, errors });
  },
};
