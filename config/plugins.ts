export default () => ({
  'populate-all': {
    enabled: true,
    config: {
      // ONLY populate specific safe collections (exclude circular ones)
      // This prevents circular loops from santri -> lembaga -> santri -> ...
      relations: [
        'api::lembaga.lembaga',
        // 'api::santri.santri',     // ❌ EXCLUDED (causes circular loop)
        // 'api::staff.staff',       // ❌ EXCLUDED (causes circular loop)
        //'api::kelas.kelas',       // ❌ EXCLUDED (causes circular loop)
        // 'api::riwayat-kelas.riwayat-kelas',  // ❌ EXCLUDED (causes circular loop)
        'api::tahun-ajaran.tahun-ajaran',
        'api::prestasi.prestasi',
        'api::pelanggaran.pelanggaran',
        'api::kehadiran-santri.kehadiran-santri',
        'api::kehadiran-guru.kehadiran-guru',
      ],
    },
  },
});
