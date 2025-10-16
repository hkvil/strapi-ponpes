import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';

export default {
  async importSantri(ctx) {
    const strapi = global.strapi || (ctx && ctx.strapi) || undefined;
    // Ambil fileUrl/filePath dari query atau body
    const fileUrl = ctx.query.fileUrl || ctx.request.body.fileUrl || ctx.query.filePath || ctx.request.body.filePath;
    if (!fileUrl) {
      ctx.throw(400, 'Parameter fileUrl atau filePath harus diisi (hasil upload dari /api/upload).');
    }
    // Pastikan path relatif ke public/uploads
    let filePath = fileUrl;
    if (filePath.startsWith('/uploads/')) {
      filePath = filePath.replace(/^\//, ''); // hapus leading slash
    } else if (filePath.startsWith('uploads/')) {
      // sudah relatif
    } else {
      ctx.throw(400, 'fileUrl/filePath harus berupa path hasil upload, contoh: /uploads/namafile.csv');
    }
    const absPath = require('path').join(strapi.dirs.static.public, filePath.replace(/^uploads\//, 'uploads/'));
    let content;
    try {
      content = await fs.readFile(absPath, 'utf-8');
    } catch (err) {
      strapi.log.error('Gagal membaca file:', err);
      ctx.throw(400, 'Gagal membaca file dari path: ' + absPath);
    }
    strapi.log.info('DEBUG content sample:', content.slice(0, 100));
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let imported = 0;
    let skipped = 0;
    let failed = 0;
    const errors: any[] = [];

    for (const row of records as any[]) {
      try {
        strapi.log.info(`[IMPORT] Proses: ${row.namaSantri} (${row.nisn})`);
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
          imported++;
          strapi.log.info(`[IMPORT] Sukses: ${row.namaSantri} (${row.nisn})`);
        } else {
          skipped++;
          strapi.log.info(`[IMPORT] SKIP: ${row.namaSantri} (${row.nisn}) sudah ada`);
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
      } catch (err) {
        failed++;
        strapi.log.error(`[IMPORT] ERROR pada ${row.namaSantri} (${row.nisn}):`, err);
        errors.push({ row, error: err.message });
      }
    }

    ctx.send({ imported, skipped, failed, errors });
  },
};
