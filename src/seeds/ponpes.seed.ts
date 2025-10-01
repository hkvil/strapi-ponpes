// src/seeds/ponpes.seed.ts
import type { Core } from '@strapi/strapi';

/**
 * Seeder untuk data ponpes (santri, staff, kelas, tahun ajaran, dll)
 * Lembaga sudah di-seed terpisah via lembaga.seed.ts
 */

// Helper untuk random selection
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

// Data master
const namaDepanPutra = ['Muhammad', 'Ahmad', 'Abdullah', 'Umar', 'Ali', 'Hasan', 'Husain', 'Yusuf', 'Ibrahim', 'Ismail', 'Zaid', 'Amir', 'Hamza', 'Bilal', 'Khalid'];
const namaDepanPutri = ['Fatimah', 'Aisyah', 'Khadijah', 'Zahra', 'Maryam', 'Siti', 'Aminah', 'Zainab', 'Hafshah', 'Ruqayyah', 'Ummu', 'Asma', 'Safiyyah', 'Hajar', 'Rahma'];
const namaBelakang = ['Al-Azizi', 'Al-Hakim', 'Al-Firdaus', 'Ash-Shiddiq', 'Al-Amin', 'Rahman', 'Ridwan', 'Syahid', 'Mubarak', 'Hadi', 'Nasir', 'Basir', 'Latif', 'Karim', 'Hakim'];
const namaAyah = ['Abdullah', 'Muhammad', 'Ahmad', 'Umar', 'Ali', 'Hasan', 'Ibrahim', 'Yusuf', 'Ismail', 'Hamza'];
const namaIbu = ['Fatimah', 'Aisyah', 'Khadijah', 'Maryam', 'Siti', 'Aminah', 'Zainab', 'Hafsah'];

const kotaAsal = ['Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Pasuruan', 'Mojokerto', 'Jombang', 'Kediri', 'Blitar', 'Madiun', 'Probolinggo', 'Banyuwangi', 'Lumajang', 'Bojonegoro', 'Lamongan'];
const kecamatan = ['Sukun', 'Lowokwaru', 'Klojen', 'Blimbing', 'Kedungkandang', 'Dau', 'Wagir', 'Singosari', 'Lawang', 'Pakis'];
const kelurahan = ['Tanjungrejo', 'Mulyorejo', 'Gadang', 'Dinoyo', 'Arjosari', 'Tlogomas', 'Tunggulwulung', 'Karangbesuki', 'Mojolangu', 'Sumbersari'];

const bidangPrestasi = ['Tahfidz', 'Matematika', 'Fisika', 'Bahasa Arab', 'Bahasa Inggris', 'Olahraga', 'Seni', 'Karya Ilmiah', 'Debat', 'Tartil'];
const tingkatPrestasi = ['Sekolah', 'Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'];
const peringkatPrestasi = ['Juara 1', 'Juara 2', 'Juara 3', 'Harapan 1', 'Harapan 2', 'Harapan 3'];

const jenisPelanggaran = ['Terlambat', 'Tidak mengerjakan tugas', 'Ribut di kelas', 'Tidak hadir tanpa izin', 'Keluar tanpa izin', 'Tidak memakai seragam', 'Tidak ikut sholat berjamaah', 'Membawa HP'];
const poinPelanggaran = { 'Terlambat': 5, 'Tidak mengerjakan tugas': 10, 'Ribut di kelas': 15, 'Tidak hadir tanpa izin': 20, 'Keluar tanpa izin': 25, 'Tidak memakai seragam': 10, 'Tidak ikut sholat berjamaah': 30, 'Membawa HP': 50 };

const jenisKehadiran = ['HADIR', 'SAKIT', 'IZIN', 'ALPHA'];
const bobotKehadiran = { 'HADIR': 0.85, 'SAKIT': 0.08, 'IZIN': 0.05, 'ALPHA': 0.02 }; // Probabilitas

/**
 * Seed Tahun Ajaran
 */
async function seedTahunAjaran(strapi: Core.Strapi) {
  const uid = 'api::tahun-ajaran.tahun-ajaran';
  
  const tahunAjaranData = [
    { tahunAjaran: '2020/2021', semester: 'GANJIL' as const, aktif: false },
    { tahunAjaran: '2020/2021', semester: 'GENAP' as const, aktif: false },
    { tahunAjaran: '2021/2022', semester: 'GANJIL' as const, aktif: false },
    { tahunAjaran: '2021/2022', semester: 'GENAP' as const, aktif: false },
    { tahunAjaran: '2022/2023', semester: 'GANJIL' as const, aktif: false },
    { tahunAjaran: '2022/2023', semester: 'GENAP' as const, aktif: false },
    { tahunAjaran: '2023/2024', semester: 'GANJIL' as const, aktif: false },
    { tahunAjaran: '2023/2024', semester: 'GENAP' as const, aktif: false },
    { tahunAjaran: '2024/2025', semester: 'GANJIL' as const, aktif: true },
  ];

  const createdTA = [];
  for (const ta of tahunAjaranData) {
    const existing = await strapi.db.query(uid).findOne({
      where: { tahunAjaran: ta.tahunAjaran, semester: ta.semester },
    });

    if (!existing) {
      const created = await strapi.entityService.create(uid, { data: ta });
      createdTA.push(created);
      strapi.log.info(`✅ Created TahunAjaran: ${ta.tahunAjaran} ${ta.semester}`);
    } else {
      createdTA.push(existing);
      strapi.log.info(`♻️  TahunAjaran exists: ${ta.tahunAjaran} ${ta.semester}`);
    }
  }

  return createdTA;
}

/**
 * Seed Kelas per Lembaga
 */
async function seedKelas(strapi: Core.Strapi, lembagas: any[]) {
  const uid = 'api::kelas.kelas';
  
  // Mapping lembaga ke kelas-kelasnya
  const kelasMapping = {
    'madrasah-ibtidaiyah': ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
    'madrasah-tsanawiyah-putra': ['Kelas 7', 'Kelas 8', 'Kelas 9'],
    'madrasah-tsanawiyah-putri': ['Kelas 7', 'Kelas 8', 'Kelas 9'],
    'madrasah-aliyah-putra': ['Kelas 10 IPA', 'Kelas 10 IPS', 'Kelas 11 IPA', 'Kelas 11 IPS', 'Kelas 12 IPA', 'Kelas 12 IPS'],
    'madrasah-aliyah-putri': ['Kelas 10 IPA', 'Kelas 10 IPS', 'Kelas 11 IPA', 'Kelas 11 IPS', 'Kelas 12 IPA', 'Kelas 12 IPS'],
  };

  const createdKelas = [];
  for (const lembaga of lembagas) {
    const kelasNames = kelasMapping[lembaga.slug] || [];
    
    for (const kelasName of kelasNames) {
      const existing = await strapi.db.query(uid).findOne({
        where: { kelas: kelasName, lembaga: lembaga.id },
      });

      if (!existing) {
        const created = await strapi.entityService.create(uid, {
          data: {
            kelas: kelasName,
            lembaga: lembaga.id,
          },
        });
        createdKelas.push({ ...created, lembagaSlug: lembaga.slug });
        strapi.log.info(`✅ Created Kelas: ${kelasName} at ${lembaga.nama}`);
      } else {
        createdKelas.push({ ...existing, lembagaSlug: lembaga.slug });
      }
    }
  }

  return createdKelas;
}

/**
 * Seed Staff/Guru
 */
async function seedStaff(strapi: Core.Strapi, lembagas: any[], count = 50) {
  const uid = 'api::staff.staff';
  
  const createdStaff = [];
  const targetLembagas = lembagas.filter(l => 
    ['madrasah-ibtidaiyah', 'madrasah-tsanawiyah-putra', 'madrasah-tsanawiyah-putri', 'madrasah-aliyah-putra', 'madrasah-aliyah-putri'].includes(l.slug)
  );

  for (let i = 0; i < count; i++) {
    const gender = Math.random() > 0.5 ? 'L' : 'P';
    const namaDepan = gender === 'L' ? randomItem(namaDepanPutra) : randomItem(namaDepanPutri);
    const nama = `${namaDepan} ${randomItem(namaBelakang)}`;
    const nik = `33${Date.now()}${i}`.slice(0, 16); // NIK 16 digit
    const nip = `${Date.now()}${i}`.slice(0, 18); // NIP 18 digit
    const lembaga = randomItem(targetLembagas);

    const staff = await strapi.entityService.create(uid, {
      data: {
        nama,
        NIK: nik,
        nip,
        gender,
        lembaga: lembaga.id,
        tempatLahir: randomItem(kotaAsal),
        tanggalLahir: randomDate(new Date(1970, 0, 1), new Date(1995, 11, 31)),
        agama: 'ISLAM' as const,
        kategoriPersonil: randomItem(['GURU', 'PENGURUS', 'STAFF'] as const),
        aktif: Math.random() > 0.1, // 90% aktif
        keteranganTugas: `Guru ${randomItem(bidangPrestasi)}`,
      } as any, // Type assertion while TS server refreshes
    });

    createdStaff.push({ ...staff, lembagaSlug: lembaga.slug });
    strapi.log.info(`✅ Created Staff: ${nama}`);
  }

  return createdStaff;
}

/**
 * Seed Santri
 */
async function seedSantri(strapi: Core.Strapi, lembagas: any[], count = 200) {
  const uid = 'api::santri.santri';
  
  const createdSantri = [];
  const targetLembagas = lembagas.filter(l => 
    ['madrasah-ibtidaiyah', 'madrasah-tsanawiyah-putra', 'madrasah-tsanawiyah-putri', 'madrasah-aliyah-putra', 'madrasah-aliyah-putri'].includes(l.slug)
  );

  for (let i = 0; i < count; i++) {
    // Tentukan gender berdasarkan lembaga
    const lembaga = randomItem(targetLembagas);
    const isPutra = lembaga.slug.includes('putra') || lembaga.slug === 'madrasah-ibtidaiyah';
    const isPutri = lembaga.slug.includes('putri');
    
    let gender: 'L' | 'P';
    if (isPutra && !isPutri) {
      gender = 'L';
    } else if (isPutri) {
      gender = 'P';
    } else {
      gender = Math.random() > 0.5 ? 'L' : 'P';
    }

    const namaDepan = gender === 'L' ? randomItem(namaDepanPutra) : randomItem(namaDepanPutri);
    const nama = `${namaDepan} ${randomItem(namaBelakang)}`;
    const nisn = `${Date.now()}${i}`.slice(0, 10);

    const existing = await strapi.db.query(uid).findOne({ where: { nisn } });
    if (existing) continue;

    const tahunMasuk = randomItem(['2020', '2021', '2022', '2023', '2024']);
    const isAlumni = Math.random() < 0.15; // 15% alumni

    const santri = await strapi.entityService.create(uid, {
      data: {
        nama,
        nisn,
        lembaga: lembaga.id,
        gender,
        tempatLahir: randomItem(kotaAsal),
        tanggalLahir: randomDate(new Date(2005, 0, 1), new Date(2015, 11, 31)),
        namaAyah: randomItem(namaAyah),
        namaIbu: randomItem(namaIbu),
        kelurahan: randomItem(kelurahan),
        kecamatan: randomItem(kecamatan),
        kota: randomItem(kotaAsal),
        tahunMasuk,
        isAlumni,
        ...(isAlumni ? { tahunLulus: String(Number(tahunMasuk) + 3) } : {}),
      },
    });

    createdSantri.push({ ...santri, lembagaSlug: lembaga.slug });
    strapi.log.info(`✅ Created Santri: ${nama}`);
  }

  return createdSantri;
}

/**
 * Seed Riwayat Kelas
 */
async function seedRiwayatKelas(strapi: Core.Strapi, santris: any[], kelass: any[], tahunAjarans: any[]) {
  const uid = 'api::riwayat-kelas.riwayat-kelas';
  
  const tahunAjaranAktif = tahunAjarans.find(ta => ta.aktif);
    for (const santri of santris) {
    // Cari kelas yang sesuai dengan lembaga santri
    const kelasOptions = kelass.filter(k => k.lembagaSlug === santri.lembagaSlug);
    if (kelasOptions.length === 0) continue;

    const kelas = randomItem(kelasOptions);
    const tahunAjaran = santri.isAlumni ? randomItem(tahunAjarans.filter(ta => !ta.aktif)) : tahunAjaranAktif;
    
    const existing = await strapi.db.query(uid).findOne({
      where: { santri: santri.id, kelas: kelas.id, tahunAjaran: tahunAjaran.id },
    });

    if (existing) continue;

    const statusSantri = santri.isAlumni 
      ? ('LULUS' as const) 
      : (randomItem(['AKTIF', 'AKTIF', 'AKTIF', 'AKTIF'] as const)); // 100% AKTIF untuk non-alumni

    await strapi.entityService.create(uid, {
      data: {
        santri: santri.id,
        kelas: kelas.id,
        tahunAjaran: tahunAjaran.id,
        statusSantri,
        tanggalMulai: `${tahunAjaran.tahunAjaran.split('/')[0]}-07-15`,
        tanggalSelesai: statusSantri !== 'AKTIF' ? `${tahunAjaran.tahunAjaran.split('/')[1]}-06-30` : null,
        catatan: statusSantri === 'LULUS' ? 'Lulus dengan baik' : null,
      },
    });

    strapi.log.info(`✅ Created RiwayatKelas: ${santri.nama} at ${kelas.kelas}`);
  }
}

/**
 * Seed Prestasi
 */
async function seedPrestasi(strapi: Core.Strapi, santris: any[], count = 100) {
  const uid = 'api::prestasi.prestasi';
  
  for (let i = 0; i < count; i++) {
    const santri = randomItem(santris);
    const bidang = randomItem(bidangPrestasi);
    const tingkat = randomItem(tingkatPrestasi);
    const peringkat = randomItem(peringkatPrestasi);
    const tahun = randomItem(['2020', '2021', '2022', '2023', '2024']);

    await strapi.entityService.create(uid, {
      data: {
        santri: santri.id,
        namaLomba: `Lomba ${bidang}`,
        penyelenggara: tingkat === 'Internasional' ? 'UNESCO' : tingkat === 'Nasional' ? 'Kemenag RI' : 'Diknas Kab/Kota',
        tingkat: tingkat as 'Sekolah' | 'Kecamatan' | 'Kabupaten/Kota' | 'Provinsi' | 'Nasional' | 'Internasional',
        peringkat: peringkat as 'Juara 1' | 'Juara 2' | 'Juara 3' | 'Harapan 1' | 'Harapan 2' | 'Harapan 3',
        bidang,
        tahun,
      },
    });

    strapi.log.info(`✅ Created Prestasi: ${santri.nama} - ${bidang}`);
  }
}

/**
 * Seed Pelanggaran
 */
async function seedPelanggaran(strapi: Core.Strapi, santris: any[], count = 80) {
  const uid = 'api::pelanggaran.pelanggaran';
  
  for (let i = 0; i < count; i++) {
    const santri = randomItem(santris);
    const jenis = randomItem(jenisPelanggaran);
    const poin = poinPelanggaran[jenis];
    const tanggal = randomDate(new Date(2024, 0, 1), new Date(2024, 9, 1));

    await strapi.entityService.create(uid, {
      data: {
        santri: santri.id,
        jenis,
        poin,
        tanggal,
        keterangan: `Pelanggaran ${jenis.toLowerCase()}`,
      },
    });

    strapi.log.info(`✅ Created Pelanggaran: ${santri.nama} - ${jenis}`);
  }
}

/**
 * Seed Kehadiran Guru
 */
async function seedKehadiranGuru(strapi: Core.Strapi, staffs: any[], kelass: any[], tahunAjarans: any[], days = 30) {
  const uid = 'api::kehadiran-guru.kehadiran-guru';
  
  const tahunAjaranAktif = tahunAjarans.find(ta => ta.aktif);
  if (!tahunAjaranAktif) return;

  const startDate = new Date(2024, 8, 1); // Sept 1, 2024
  
  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);
    const tanggal = currentDate.toISOString().split('T')[0];

    for (const staff of staffs.slice(0, 20)) { // 20 guru
      const kelasOptions = kelass.filter(k => k.lembagaSlug === staff.lembagaSlug);
      if (kelasOptions.length === 0) continue;

      const kelas = randomItem(kelasOptions);
      
      // Weighted random untuk jenis kehadiran
      const rand = Math.random();
      let jenis: 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPHA';
      if (rand < bobotKehadiran.HADIR) jenis = 'HADIR';
      else if (rand < bobotKehadiran.HADIR + bobotKehadiran.SAKIT) jenis = 'SAKIT';
      else if (rand < bobotKehadiran.HADIR + bobotKehadiran.SAKIT + bobotKehadiran.IZIN) jenis = 'IZIN';
      else jenis = 'ALPHA';

      const existing = await strapi.db.query(uid).findOne({
        where: { staff: staff.id, kelas: kelas.id, tahunAjaran: tahunAjaranAktif.id, tanggal },
      });

      if (existing) continue;

      await strapi.entityService.create(uid, {
        data: {
          staff: staff.id,
          kelas: kelas.id,
          tahunAjaran: tahunAjaranAktif.id,
          tanggal,
          jenis: jenis as 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPHA' | 'TERLAMBAT',
          keterangan: jenis === 'HADIR' ? 'Mengajar' : jenis,
        },
      });
    }
  }

  strapi.log.info(`✅ Created KehadiranGuru for ${days} days`);
}

/**
 * Seed Kehadiran Santri
 */
async function seedKehadiranSantri(strapi: Core.Strapi, santris: any[], days = 30) {
  const uid = 'api::kehadiran-santri.kehadiran-santri';
  const riwayatKelasUid = 'api::riwayat-kelas.riwayat-kelas';
  
  const startDate = new Date(2024, 8, 1); // Sept 1, 2024
  
  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);
    const tanggal = currentDate.toISOString().split('T')[0];

    for (const santri of santris.slice(0, 50)) { // 50 santri
      if (santri.isAlumni) continue;

      // Get riwayat kelas santri yang AKTIF
      const riwayatKelas = await strapi.db.query(riwayatKelasUid).findOne({
        where: { santri: santri.id, statusSantri: 'AKTIF' },
      });

      if (!riwayatKelas) continue;

      // Weighted random untuk jenis kehadiran
      const rand = Math.random();
      let jenis: 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPHA';
      if (rand < bobotKehadiran.HADIR) jenis = 'HADIR';
      else if (rand < bobotKehadiran.HADIR + bobotKehadiran.SAKIT) jenis = 'SAKIT';
      else if (rand < bobotKehadiran.HADIR + bobotKehadiran.SAKIT + bobotKehadiran.IZIN) jenis = 'IZIN';
      else jenis = 'ALPHA';

      const existing = await strapi.db.query(uid).findOne({
        where: { santri: santri.id, riwayatKelas: riwayatKelas.id, tanggal },
      });

      if (existing) continue;

      await strapi.entityService.create(uid, {
        data: {
          santri: santri.id,
          riwayatKelas: riwayatKelas.id,
          tanggal,
          jenis: jenis as 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPHA' | 'TERLAMBAT',
          keterangan: jenis === 'HADIR' ? 'Hadir tepat waktu' : jenis,
        },
      });
    }
  }

  strapi.log.info(`✅ Created KehadiranSantri for ${days} days`);
}

/**
 * Main Seeder Function
 */
export async function seedPonpesData(strapi: Core.Strapi, options: {
  skipTahunAjaran?: boolean;
  skipKelas?: boolean;
  skipStaff?: boolean;
  skipSantri?: boolean;
  skipRiwayatKelas?: boolean;
  skipPrestasi?: boolean;
  skipPelanggaran?: boolean;
  skipKehadiranGuru?: boolean;
  skipKehadiranSantri?: boolean;
  santriCount?: number;
  staffCount?: number;
  prestasiCount?: number;
  pelanggaranCount?: number;
  kehadiranDays?: number;
} = {}) {
  strapi.log.info('🌱 Starting Ponpes Data Seeding...');

  // Get lembagas (already seeded)
  const lembagas = await strapi.entityService.findMany('api::lembaga.lembaga', {
    filters: {},
    fields: ['id', 'nama', 'slug'],
    limit: 100,
  });

  if (!lembagas || lembagas.length === 0) {
    strapi.log.error('❌ No lembagas found! Please seed lembaga first.');
    return;
  }

  strapi.log.info(`📚 Found ${lembagas.length} lembagas`);

  // Seed in order
  let tahunAjarans = [];
  if (!options.skipTahunAjaran) {
    tahunAjarans = await seedTahunAjaran(strapi);
  } else {
    tahunAjarans = await strapi.entityService.findMany('api::tahun-ajaran.tahun-ajaran', { limit: 100 });
  }

  let kelass = [];
  if (!options.skipKelas) {
    kelass = await seedKelas(strapi, lembagas);
  } else {
    kelass = await strapi.entityService.findMany('api::kelas.kelas', { 
      populate: ['lembaga'],
      limit: 200 
    });
  }

  let staffs = [];
  if (!options.skipStaff) {
    staffs = await seedStaff(strapi, lembagas, options.staffCount || 50);
  } else {
    staffs = await strapi.entityService.findMany('api::staff.staff', { 
      populate: ['lembaga'],
      limit: 200 
    });
  }

  let santris = [];
  if (!options.skipSantri) {
    santris = await seedSantri(strapi, lembagas, options.santriCount || 200);
  } else {
    santris = await strapi.entityService.findMany('api::santri.santri', { 
      populate: ['lembaga'],
      limit: 500 
    });
  }

  if (!options.skipRiwayatKelas) {
    await seedRiwayatKelas(strapi, santris, kelass, tahunAjarans);
  }

  if (!options.skipPrestasi) {
    await seedPrestasi(strapi, santris, options.prestasiCount || 100);
  }

  if (!options.skipPelanggaran) {
    await seedPelanggaran(strapi, santris, options.pelanggaranCount || 80);
  }

  if (!options.skipKehadiranGuru) {
    await seedKehadiranGuru(strapi, staffs, kelass, tahunAjarans, options.kehadiranDays || 30);
  }

  if (!options.skipKehadiranSantri) {
    await seedKehadiranSantri(strapi, santris, options.kehadiranDays || 30);
  }

  strapi.log.info('🎉 Ponpes Data Seeding Complete!');
}

