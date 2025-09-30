// src/api/santri/content-types/santri/lifecycles.ts
export default {
  beforeUpdate(event) {
    // Sementara dinonaktifkan agar kelasAktif bisa diupdate
    // Nanti bisa diaktifkan lagi jika diperlukan dengan logika yang lebih spesifik
    
    // const { data } = event.params as any;
    // delete data?.kelasAktif;
    // delete data?.tahunAjaranAktif;
    // delete data?.tahunMasuk;
    // delete data?.tahunLulus;
    // delete data?.isAlumni;
  },
};
