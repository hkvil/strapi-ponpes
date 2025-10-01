/**
 * Seeder untuk Data Pesantren
 * 
 * Usage:
 * 1. Set environment variable: RUN_SEED=ponpes
 * 2. Run: npm run develop
 * 
 * Or manually:
 * node scripts/seed-ponpes.js
 */

'use strict';

async function seedPonpesData() {
  console.log('🌱 Starting Ponpes Data Seeding...\n');

  try {
    // Check if data already exists
    const existingLembaga = await strapi.entityService.findMany('api::lembaga.lembaga', {
      limit: 1
    });

    if (existingLembaga && existingLembaga.length > 0) {
      console.log('⚠️  Data already exists. Skipping seed...');
      console.log('💡 To reseed, delete all data first from admin panel.\n');
      return;
    }

    console.log('📚 Creating Lembaga (Institutions)...');
    const lembagas = await createLembagas();
    console.log(`✅ Created ${lembagas.length} lembaga\n`);

    console.log('📅 Creating Tahun Ajaran (Academic Years)...');
    const tahunAjarans = await createTahunAjarans();
    console.log(`✅ Created ${tahunAjarans.length} tahun ajaran\n`);

    console.log('🎓 Creating Kelas (Classes)...');
    const kelasData = await createKelas(lembagas);
    console.log(`✅ Created ${kelasData.totalKelas} kelas\n`);

    console.log('👨‍🏫 Creating Staff/Guru...');
    const staffData = await createStaff(lembagas);
    console.log(`✅ Created ${staffData.length} staff\n`);

    console.log('👨‍🎓 Creating Santri (Students)...');
    const santriData = await createSantri(lembagas);
    console.log(`✅ Created ${santriData.length} santri\n`);

    console.log('📝 Creating Riwayat Kelas (Enrollment History)...');
    const riwayatKelasData = await createRiwayatKelas(santriData, kelasData, tahunAjarans);
    console.log(`✅ Created ${riwayatKelasData.length} riwayat kelas\n`);

    console.log('🏆 Creating Prestasi (Achievements)...');
    const prestasiData = await createPrestasi(santriData);
    console.log(`✅ Created ${prestasiData.length} prestasi\n`);

    console.log('⚠️  Creating Pelanggaran (Violations)...');
    const pelanggaranData = await createPelanggaran(santriData);
    console.log(`✅ Created ${pelanggaranData.length} pelanggaran\n`);

    console.log('📊 Creating Kehadiran Guru (Teacher Attendance)...');
    const kehadiranGuruData = await createKehadiranGuru(staffData, kelasData, tahunAjarans);
    console.log(`✅ Created ${kehadiranGuruData.length} kehadiran guru\n`);

    console.log('📊 Creating Kehadiran Santri (Student Attendance)...');
    const kehadiranSantriData = await createKehadiranSantri(santriData, riwayatKelasData);
    console.log(`✅ Created ${kehadiranSantriData.length} kehadiran santri\n`);

    console.log('🎉 Ponpes Data Seeding Complete!\n');
    console.log('📈 Summary:');
    console.log(`   • ${lembagas.length} Lembaga`);
    console.log(`   • ${tahunAjarans.length} Tahun Ajaran`);
    console.log(`   • ${kelasData.totalKelas} Kelas`);
    console.log(`   • ${staffData.length} Staff/Guru`);
    console.log(`   • ${santriData.length} Santri`);
    console.log(`   • ${riwayatKelasData.length} Riwayat Kelas`);
    console.log(`   • ${prestasiData.length} Prestasi`);
    console.log(`   • ${pelanggaranData.length} Pelanggaran`);
    console.log(`   • ${kehadiranGuruData.length} Kehadiran Guru`);
    console.log(`   • ${kehadiranSantriData.length} Kehadiran Santri`);
    console.log('\n✨ You can now access the admin panel and see the data!\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

// ========================================
// DATA CREATION FUNCTIONS
// ========================================

async function createLembagas() {
  const lembagas = [
    {
      nama: 'MI Al-Hikmah',
      slug: 'mi-al-hikmah',
      profilMd: '## Profil MI Al-Hikmah\n\nMadrasah Ibtidaiyah Al-Hikmah adalah lembaga pendidikan tingkat dasar yang berfokus pada pendidikan agama dan umum.',
      programKerjaMd: '### Program Kerja\n- Tahfidz Al-Quran\n- Pembelajaran Berbasis IT\n- Ekstrakurikuler Olahraga'
    },
    {
      nama: 'MTs Al-Hikmah',
      slug: 'mts-al-hikmah',
      profilMd: '## Profil MTs Al-Hikmah\n\nMadrasah Tsanawiyah Al-Hikmah melanjutkan pendidikan dari MI dengan pendalaman materi agama dan sains.',
      programKerjaMd: '### Program Kerja\n- Tahfidz Lanjutan\n- Olimpiade Sains\n- Pengembangan Bahasa Arab dan Inggris'
    },
    {
      nama: 'MA Al-Hikmah',
      slug: 'ma-al-hikmah',
      profilMd: '## Profil MA Al-Hikmah\n\nMadrasah Aliyah Al-Hikmah mempersiapkan santri untuk melanjutkan ke perguruan tinggi dengan bekal ilmu agama dan umum.',
      programKerjaMd: '### Program Kerja\n- Persiapan SBMPTN\n- Tahfidz 30 Juz\n- Riset dan Karya Ilmiah'
    }
  ];

  const created = [];
  for (const data of lembagas) {
    const lembaga = await strapi.entityService.create('api::lembaga.lembaga', {
      data
    });
    created.push(lembaga);
  }

  return created;
}

async function createTahunAjarans() {
  const tahunAjarans = [
    { tahunAjaran: '2022/2023', semester: 'Genap', aktif: false },
    { tahunAjaran: '2023/2024', semester: 'Ganjil', aktif: false },
    { tahunAjaran: '2023/2024', semester: 'Genap', aktif: false },
    { tahunAjaran: '2024/2025', semester: 'Ganjil', aktif: true }
  ];

  const created = [];
  for (const data of tahunAjarans) {
    const ta = await strapi.entityService.create('api::tahun-ajaran.tahun-ajaran', {
      data
    });
    created.push(ta);
  }

  return created;
}

async function createKelas(lembagas) {
  const kelasPerLembaga = {
    'MI Al-Hikmah': ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
    'MTs Al-Hikmah': ['Kelas 7', 'Kelas 8', 'Kelas 9'],
    'MA Al-Hikmah': ['Kelas 10 IPA', 'Kelas 10 IPS', 'Kelas 11 IPA', 'Kelas 11 IPS', 'Kelas 12 IPA', 'Kelas 12 IPS']
  };

  const allKelas = {};
  let totalKelas = 0;

  for (const lembaga of lembagas) {
    const kelasNames = kelasPerLembaga[lembaga.nama];
    allKelas[lembaga.id] = [];

    for (const kelasName of kelasNames) {
      const kelas = await strapi.entityService.create('api::kelas.kelas', {
        data: {
          kelas: kelasName,
          lembaga: lembaga.id
        }
      });
      allKelas[lembaga.id].push(kelas);
      totalKelas++;
    }
  }

  return { allKelas, totalKelas };
}

async function createStaff(lembagas) {
  const staffData = [
    // MI Staff
    { nama: 'Ustadz Ahmad Fauzi', nip: '198501012010011001', gender: 'L', kategoriPersonil: 'GURU', lembaga: 'MI Al-Hikmah', tempatLahir: 'Jakarta', tanggalLahir: '1985-01-01', agama: 'ISLAM', keteranganTugas: 'Guru Bahasa Arab dan Tahfidz', aktif: true },
    { nama: 'Ustadzah Siti Nurhasanah', nip: '198703152010012001', gender: 'P', kategoriPersonil: 'GURU', lembaga: 'MI Al-Hikmah', tempatLahir: 'Bandung', tanggalLahir: '1987-03-15', agama: 'ISLAM', keteranganTugas: 'Guru Matematika dan IPA', aktif: true },
    { nama: 'Ustadz Muhammad Ridwan', nip: '199002202015011001', gender: 'L', kategoriPersonil: 'GURU', lembaga: 'MI Al-Hikmah', tempatLahir: 'Surabaya', tanggalLahir: '1990-02-20', agama: 'ISLAM', keteranganTugas: 'Guru Bahasa Indonesia', aktif: true },
    
    // MTs Staff
    { nama: 'Ustadz Yusuf Habibi', nip: '198408102009011002', gender: 'L', kategoriPersonil: 'GURU', lembaga: 'MTs Al-Hikmah', tempatLahir: 'Yogyakarta', tanggalLahir: '1984-08-10', agama: 'ISLAM', keteranganTugas: 'Guru Fiqih dan Ushul Fiqih', aktif: true },
    { nama: 'Ustadzah Fatimah Azzahra', nip: '198905252011012002', gender: 'P', kategoriPersonil: 'GURU', lembaga: 'MTs Al-Hikmah', tempatLahir: 'Medan', tanggalLahir: '1989-05-25', agama: 'ISLAM', keteranganTugas: 'Guru Bahasa Inggris', aktif: true },
    
    // MA Staff
    { nama: 'Ustadz Abdullah Mahmud', nip: '198212122008011003', gender: 'L', kategoriPersonil: 'GURU', lembaga: 'MA Al-Hikmah', tempatLahir: 'Makassar', tanggalLahir: '1982-12-12', agama: 'ISLAM', keteranganTugas: 'Guru Matematika dan Fisika', aktif: true },
    { nama: 'Ustadzah Khadijah Aminah', nip: '198606302010012003', gender: 'P', kategoriPersonil: 'GURU', lembaga: 'MA Al-Hikmah', tempatLahir: 'Semarang', tanggalLahir: '1986-06-30', agama: 'ISLAM', keteranganTugas: 'Guru Kimia dan Biologi', aktif: true },
    
    // Staff Administrasi
    { nama: 'Ahmad Zainuddin', nip: '199105152016011004', gender: 'L', kategoriPersonil: 'STAFF', lembaga: 'MI Al-Hikmah', tempatLahir: 'Malang', tanggalLahir: '1991-05-15', agama: 'ISLAM', keteranganTugas: 'Staff TU', aktif: true },
    { nama: 'Nurul Hidayah', nip: '199207202017012004', gender: 'P', kategoriPersonil: 'STAFF', lembaga: 'MTs Al-Hikmah', tempatLahir: 'Bogor', tanggalLahir: '1992-07-20', agama: 'ISLAM', keteranganTugas: 'Staff TU', aktif: true }
  ];

  const created = [];
  for (const data of staffData) {
    const lembaga = lembagas.find(l => l.nama === data.lembaga);
    const staff = await strapi.entityService.create('api::staff.staff', {
      data: {
        ...data,
        lembaga: lembaga.id
      }
    });
    created.push(staff);
  }

  return created;
}

async function createSantri(lembagas) {
  const namaSantriLaki = [
    'Ahmad Zaki', 'Muhammad Faris', 'Abdullah Rahman', 'Yusuf Ibrahim', 'Hasan Ali',
    'Rizki Ramadan', 'Fadhil Azhar', 'Ilyas Hakim', 'Khalid Umar', 'Amir Hamzah',
    'Zainal Abidin', 'Sufyan Tsauri', 'Malik Abdurrahman', 'Nasir Fadli', 'Taufik Hidayat'
  ];

  const namaSantriPerempuan = [
    'Aisyah Putri', 'Fatimah Zahra', 'Khadijah Salsabila', 'Maryam Azzahra', 'Zainab Nafisa',
    'Hafsah Nabila', 'Ruqayyah Amira', 'Ummu Kulsum', 'Safiyyah Nur', 'Asma Kamila',
    'Hafshah Zahra', 'Nusaybah Latifah', 'Sumayyah Salwa', 'Layla Khairunnisa', 'Juwairiyah Husna'
  ];

  const namaAyah = ['Ahmad', 'Muhammad', 'Abdullah', 'Ibrahim', 'Hasan', 'Yusuf', 'Ali', 'Umar', 'Khalid', 'Malik'];
  const namaIbu = ['Siti', 'Aminah', 'Khadijah', 'Fatimah', 'Aisyah', 'Maryam', 'Zainab', 'Hafsah'];
  const kota = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 'Malang', 'Solo', 'Bogor'];

  const santriData = [];
  let nisnCounter = 1000000000;

  // Generate santri untuk MI (60 santri, 10 per kelas)
  const miLembaga = lembagas.find(l => l.nama === 'MI Al-Hikmah');
  for (let i = 0; i < 30; i++) {
    const gender = i % 2 === 0 ? 'L' : 'P';
    const namaList = gender === 'L' ? namaSantriLaki : namaSantriPerempuan;
    santriData.push({
      nama: namaList[i % namaList.length] + ' MI' + i,
      nisn: (nisnCounter++).toString(),
      gender,
      lembaga: miLembaga.id,
      lembagaName: 'MI Al-Hikmah',
      tempatLahir: kota[i % kota.length],
      tanggalLahir: `201${2 + Math.floor(i / 10)}-0${(i % 9) + 1}-${10 + (i % 20)}`,
      namaAyah: namaAyah[i % namaAyah.length],
      namaIbu: namaIbu[i % namaIbu.length],
      kelurahan: 'Kelurahan ' + (i % 5 + 1),
      kecamatan: 'Kecamatan ' + (i % 3 + 1),
      kota: kota[i % kota.length],
      tahunMasuk: '2020'
    });
  }

  // Generate santri untuk MTs (30 santri, 10 per kelas)
  const mtsLembaga = lembagas.find(l => l.nama === 'MTs Al-Hikmah');
  for (let i = 0; i < 30; i++) {
    const gender = i % 2 === 0 ? 'L' : 'P';
    const namaList = gender === 'L' ? namaSantriLaki : namaSantriPerempuan;
    santriData.push({
      nama: namaList[i % namaList.length] + ' MTs' + i,
      nisn: (nisnCounter++).toString(),
      gender,
      lembaga: mtsLembaga.id,
      lembagaName: 'MTs Al-Hikmah',
      tempatLahir: kota[i % kota.length],
      tanggalLahir: `200${9 + Math.floor(i / 10)}-0${(i % 9) + 1}-${10 + (i % 20)}`,
      namaAyah: namaAyah[i % namaAyah.length],
      namaIbu: namaIbu[i % namaIbu.length],
      kelurahan: 'Kelurahan ' + (i % 5 + 1),
      kecamatan: 'Kecamatan ' + (i % 3 + 1),
      kota: kota[i % kota.length],
      tahunMasuk: '2021'
    });
  }

  // Generate santri untuk MA (30 santri, 5 per kelas)
  const maLembaga = lembagas.find(l => l.nama === 'MA Al-Hikmah');
  for (let i = 0; i < 30; i++) {
    const gender = i % 2 === 0 ? 'L' : 'P';
    const namaList = gender === 'L' ? namaSantriLaki : namaSantriPerempuan;
    santriData.push({
      nama: namaList[i % namaList.length] + ' MA' + i,
      nisn: (nisnCounter++).toString(),
      gender,
      lembaga: maLembaga.id,
      lembagaName: 'MA Al-Hikmah',
      tempatLahir: kota[i % kota.length],
      tanggalLahir: `200${6 + Math.floor(i / 10)}-0${(i % 9) + 1}-${10 + (i % 20)}`,
      namaAyah: namaAyah[i % namaAyah.length],
      namaIbu: namaIbu[i % namaIbu.length],
      kelurahan: 'Kelurahan ' + (i % 5 + 1),
      kecamatan: 'Kecamatan ' + (i % 3 + 1),
      kota: kota[i % kota.length],
      tahunMasuk: '2022'
    });
  }

  const created = [];
  for (const data of santriData) {
    const { lembagaName, ...santriCreateData } = data;
    const santri = await strapi.entityService.create('api::santri.santri', {
      data: santriCreateData
    });
    created.push({ ...santri, lembagaName });
  }

  return created;
}

async function createRiwayatKelas(santriData, kelasData, tahunAjarans) {
  const activeTA = tahunAjarans.find(ta => ta.aktif);
  const created = [];

  // MI Santri - distribute across 6 kelas
  const miSantri = santriData.filter(s => s.lembagaName === 'MI Al-Hikmah');
  const miLembaga = await strapi.entityService.findMany('api::lembaga.lembaga', {
    filters: { nama: 'MI Al-Hikmah' }
  });
  const miKelas = kelasData.allKelas[miLembaga[0].id];
  
  for (let i = 0; i < miSantri.length; i++) {
    const kelasIndex = Math.floor(i / 5); // 5 santri per kelas
    const rk = await strapi.entityService.create('api::riwayat-kelas.riwayat-kelas', {
      data: {
        santri: miSantri[i].id,
        kelas: miKelas[kelasIndex].id,
        tahunAjaran: activeTA.id,
        statusSantri: 'AKTIF',
        tanggalMulai: '2024-07-15',
        catatan: 'Santri aktif tahun ajaran 2024/2025'
      }
    });
    created.push(rk);
  }

  // MTs Santri - distribute across 3 kelas
  const mtsSantri = santriData.filter(s => s.lembagaName === 'MTs Al-Hikmah');
  const mtsLembaga = await strapi.entityService.findMany('api::lembaga.lembaga', {
    filters: { nama: 'MTs Al-Hikmah' }
  });
  const mtsKelas = kelasData.allKelas[mtsLembaga[0].id];
  
  for (let i = 0; i < mtsSantri.length; i++) {
    const kelasIndex = Math.floor(i / 10); // 10 santri per kelas
    const rk = await strapi.entityService.create('api::riwayat-kelas.riwayat-kelas', {
      data: {
        santri: mtsSantri[i].id,
        kelas: mtsKelas[kelasIndex].id,
        tahunAjaran: activeTA.id,
        statusSantri: 'AKTIF',
        tanggalMulai: '2024-07-15',
        catatan: 'Santri aktif tahun ajaran 2024/2025'
      }
    });
    created.push(rk);
  }

  // MA Santri - distribute across 6 kelas (IPA/IPS)
  const maSantri = santriData.filter(s => s.lembagaName === 'MA Al-Hikmah');
  const maLembaga = await strapi.entityService.findMany('api::lembaga.lembaga', {
    filters: { nama: 'MA Al-Hikmah' }
  });
  const maKelas = kelasData.allKelas[maLembaga[0].id];
  
  for (let i = 0; i < maSantri.length; i++) {
    const kelasIndex = Math.floor(i / 5); // 5 santri per kelas
    const statusOptions = ['AKTIF', 'AKTIF', 'AKTIF', 'AKTIF', 'LULUS']; // 80% aktif, 20% lulus
    const status = statusOptions[i % statusOptions.length];
    
    const rk = await strapi.entityService.create('api::riwayat-kelas.riwayat-kelas', {
      data: {
        santri: maSantri[i].id,
        kelas: maKelas[kelasIndex].id,
        tahunAjaran: activeTA.id,
        statusSantri: status,
        tanggalMulai: '2024-07-15',
        tanggalSelesai: status === 'LULUS' ? '2024-06-30' : null,
        catatan: status === 'LULUS' ? 'Santri lulus' : 'Santri aktif tahun ajaran 2024/2025'
      }
    });
    created.push(rk);
  }

  return created;
}

async function createPrestasi(santriData) {
  const prestasiTemplates = [
    { namaLomba: 'Olimpiade Matematika', bidang: 'Matematika', tingkat: 'Kabupaten/Kota', peringkat: 'Juara 1', penyelenggara: 'Dinas Pendidikan' },
    { namaLomba: 'Lomba Tahfidz Al-Quran', bidang: 'Agama', tingkat: 'Provinsi', peringkat: 'Juara 2', penyelenggara: 'Kemenag' },
    { namaLomba: 'Olimpiade IPA', bidang: 'IPA', tingkat: 'Kecamatan', peringkat: 'Juara 1', penyelenggara: 'PGRI' },
    { namaLomba: 'Lomba Pidato Bahasa Arab', bidang: 'Bahasa', tingkat: 'Kabupaten/Kota', peringkat: 'Juara 3', penyelenggara: 'Kemenag' },
    { namaLomba: 'MTQ Tingkat Pelajar', bidang: 'Agama', tingkat: 'Nasional', peringkat: 'Harapan 1', penyelenggara: 'Kemenag RI' },
    { namaLomba: 'Lomba Karya Ilmiah', bidang: 'Sains', tingkat: 'Provinsi', peringkat: 'Juara 2', penyelenggara: 'Dinas Pendidikan' }
  ];

  const created = [];
  // Create prestasi for 30% of santri (randomly selected)
  const prestasiCount = Math.floor(santriData.length * 0.3);
  
  for (let i = 0; i < prestasiCount; i++) {
    const santri = santriData[i * 3]; // Every 3rd santri gets prestasi
    const template = prestasiTemplates[i % prestasiTemplates.length];
    
    const prestasi = await strapi.entityService.create('api::prestasi.prestasi', {
      data: {
        santri: santri.id,
        ...template,
        tahun: '2024'
      }
    });
    created.push(prestasi);
  }

  return created;
}

async function createPelanggaran(santriData) {
  const pelanggaranTemplates = [
    { jenis: 'Terlambat', poin: 5, keterangan: 'Terlambat masuk kelas 15 menit' },
    { jenis: 'Tidak Mengerjakan Tugas', poin: 10, keterangan: 'Tidak mengumpulkan PR Matematika' },
    { jenis: 'Tidak Berseragam Lengkap', poin: 5, keterangan: 'Tidak memakai peci' },
    { jenis: 'Ribut di Kelas', poin: 15, keterangan: 'Membuat kegaduhan saat pelajaran' },
    { jenis: 'Keluar Tanpa Izin', poin: 20, keterangan: 'Keluar area sekolah tanpa izin' }
  ];

  const created = [];
  // Create pelanggaran for 20% of santri
  const pelanggaranCount = Math.floor(santriData.length * 0.2);
  
  for (let i = 0; i < pelanggaranCount; i++) {
    const santri = santriData[i * 5]; // Every 5th santri gets pelanggaran
    const template = pelanggaranTemplates[i % pelanggaranTemplates.length];
    
    // Random date in September 2024
    const day = (i % 28) + 1;
    const tanggal = `2024-09-${day.toString().padStart(2, '0')}`;
    
    const pelanggaran = await strapi.entityService.create('api::pelanggaran.pelanggaran', {
      data: {
        santri: santri.id,
        ...template,
        tanggal
      }
    });
    created.push(pelanggaran);
  }

  return created;
}

async function createKehadiranGuru(staffData, kelasData, tahunAjarans) {
  const activeTA = tahunAjarans.find(ta => ta.aktif);
  const guruList = staffData.filter(s => s.kategoriPersonil === 'GURU');
  const created = [];

  // Generate kehadiran for September 2024 (20 working days)
  const workingDays = 20;
  const jenisOptions = ['HADIR', 'HADIR', 'HADIR', 'HADIR', 'HADIR', 'SAKIT', 'IZIN']; // 70% hadir

  for (const guru of guruList) {
    // Get kelas untuk lembaga guru ini
    const lembaga = await strapi.entityService.findOne('api::lembaga.lembaga', guru.lembaga);
    const kelasList = kelasData.allKelas[lembaga.id];
    
    // Guru mengajar di 2-3 kelas
    const kelasCount = Math.min(2, kelasList.length);
    const guruKelas = kelasList.slice(0, kelasCount);

    for (const kelas of guruKelas) {
      for (let day = 1; day <= workingDays; day++) {
        const tanggal = `2024-09-${day.toString().padStart(2, '0')}`;
        const jenis = jenisOptions[day % jenisOptions.length];
        
        const kehadiran = await strapi.entityService.create('api::kehadiran-guru.kehadiran-guru', {
          data: {
            staff: guru.id,
            kelas: kelas.id,
            tahunAjaran: activeTA.id,
            tanggal,
            jenis,
            keterangan: jenis === 'HADIR' ? 'Mengajar sesuai jadwal' : `${jenis} dengan pemberitahuan`
          }
        });
        created.push(kehadiran);
      }
    }
  }

  return created;
}

async function createKehadiranSantri(santriData, riwayatKelasData) {
  const created = [];
  
  // Generate kehadiran for September 2024 (24 working days for students)
  const workingDays = 24;
  const jenisOptions = ['HADIR', 'HADIR', 'HADIR', 'HADIR', 'HADIR', 'HADIR', 'SAKIT', 'IZIN', 'ALPHA']; // 65% hadir

  // Only create for active santri (not LULUS)
  const activeRiwayat = riwayatKelasData.filter(rk => rk.statusSantri === 'AKTIF');

  for (const riwayat of activeRiwayat) {
    for (let day = 1; day <= workingDays; day++) {
      const tanggal = `2024-09-${day.toString().padStart(2, '0')}`;
      const jenis = jenisOptions[day % jenisOptions.length];
      
      const kehadiran = await strapi.entityService.create('api::kehadiran-santri.kehadiran-santri', {
        data: {
          santri: riwayat.santri,
          riwayatKelas: riwayat.id,
          tanggal,
          jenis,
          keterangan: jenis === 'HADIR' ? 'Hadir tepat waktu' : 
                     jenis === 'SAKIT' ? 'Sakit dengan surat dokter' :
                     jenis === 'IZIN' ? 'Izin keperluan keluarga' : 'Tidak hadir tanpa keterangan'
        }
      });
      created.push(kehadiran);
    }
  }

  return created;
}

// Export for use in bootstrap or manual run
module.exports = {
  seedPonpesData
};

// If run directly
if (require.main === module) {
  console.log('⚠️  This script should be run through Strapi bootstrap');
  console.log('💡 Set RUN_SEED=ponpes and run: npm run develop');
}
