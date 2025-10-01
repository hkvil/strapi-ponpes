// src/api/riwayat-kelas/content-types/riwayat-kelas/lifecycles.ts
type IdLike = string | number;

function tahunAwal(tahunAjaran: string): string | undefined {
  const m = /^(\d{4})\/(\d{4})$/.exec(tahunAjaran);
  return m?.[1];
}
function tahunAkhir(tahunAjaran: string): string | undefined {
  const m = /^(\d{4})\/(\d{4})$/.exec(tahunAjaran);
  return m?.[2];
}

// Ambil 1 ID dari berbagai bentuk payload relasi Admin v5
function extractRelId(input: any): IdLike | undefined {
  if (input == null) return undefined;
  if (typeof input === 'number' || typeof input === 'string') return input;
  if (Array.isArray(input)) return input[0]?.id ?? input[0];
  if (typeof input === 'object') {
    if ('id' in input) return (input as any).id;
    if ('connect' in input && Array.isArray((input as any).connect)) {
      const first = (input as any).connect[0];
      return first?.id ?? first;
    }
    if ('set' in input && Array.isArray((input as any).set)) {
      const first = (input as any).set[0];
      return first?.id ?? first;
    }
  }
  return undefined;
}

export default {
  async beforeCreate(event) {
    const { data } = event.params as any;

    // 1. Validasi input - Pastikan field relasi santri dan tahunAjaran wajib ada
    const santriId = extractRelId(data?.santri);
    const taId = extractRelId(data?.tahunAjaran);
    if (!santriId || !taId) {
      throw new Error('Field santri dan tahunAjaran wajib diisi.');
    }

    // 2. Cegah duplikat - Tidak boleh ada lebih dari 1 riwayat untuk kombinasi (santri, tahunAjaran) yang sama
    const existingRiwayat = await strapi.entityService.findMany('api::riwayat-kelas.riwayat-kelas', {
      filters: { 
        santri: { id: santriId }, 
        tahunAjaran: { id: taId } 
      },
      fields: ['id'],
      limit: 1,
    });
    if (existingRiwayat.length > 0) {
      throw new Error('Riwayat santri untuk tahun ajaran ini sudah ada.');
    }

    // 3. Auto isi tanggal mulai - Kalau tanggalMulai kosong → otomatis set ke tanggal hari ini (YYYY-MM-DD)
    if (!data.tanggalMulai) {
      data.tanggalMulai = new Date().toISOString().slice(0, 10);
    }
  },

  async afterCreate(event) {
    const { result, params } = event as any;

    console.log('🚀 afterCreate triggered');

    // Ambil ID langsung dari params.data, bukan dari result
    const santriId: IdLike | undefined = extractRelId(params?.data?.santri);
    const taId: IdLike | undefined = extractRelId(params?.data?.tahunAjaran);
    const kelasId: IdLike | undefined = extractRelId(params?.data?.kelas);
    
    console.log('🔍 Extracted - santriId:', santriId, 'taId:', taId, 'kelasId:', kelasId);
    
    if (!santriId || !taId) {
      console.log('❌ Skip afterCreate: santriId atau taId tidak ditemukan');
      return;
    }

    try {
      // 1. Menutup riwayat lama - Kalau ada riwayat santri lain yang masih "open" (tanggalSelesai = null), otomatis ditutup dengan tanggal hari ini
      const openRiwayatLama = await strapi.entityService.findMany('api::riwayat-kelas.riwayat-kelas', {
        filters: {
          santri: { id: santriId },
          id: { $ne: result.id },
          tanggalSelesai: { $null: true },
        },
        fields: ['id'],
      });
      
      const today = new Date().toISOString().slice(0, 10);
      for (const riwayat of openRiwayatLama) {
        await strapi.entityService.update('api::riwayat-kelas.riwayat-kelas', riwayat.id, {
          data: { tanggalSelesai: today },
        });
        console.log('✅ Closed old riwayat:', riwayat.id);
      }

      // 2. Ambil data kelas dan tahunAjaran untuk mendapatkan nama/string
      console.log('🔍 Fetching kelas and tahunAjaran data');
      
      let kelasNama = null;
      let tahunAjaranStr = null;
      
      if (kelasId) {
        const kelasData = await strapi.entityService.findOne('api::kelas.kelas', kelasId as any, {
          fields: ['kelas'],
        });
        kelasNama = kelasData?.kelas;
        console.log('🔍 kelasNama:', kelasNama);
      }
      
      if (taId) {
        const tahunAjaranData = await strapi.entityService.findOne('api::tahun-ajaran.tahun-ajaran', taId as any, {
          fields: ['tahunAjaran'],
        });
        tahunAjaranStr = tahunAjaranData?.tahunAjaran;
        console.log('🔍 tahunAjaranStr:', tahunAjaranStr);
      }

      // 3. Sinkronisasi shortcut di santri
      const santriUpdateData: any = {};
      
      // kelasAktif = nama kelas (string)
      if (kelasNama) {
        santriUpdateData.kelasAktif = kelasNama;
        console.log('✅ Will set kelasAktif to:', kelasNama);
      } else {
        console.log('❌ No kelasNama found!');
      }
      
      // tahunAjaranAktif = string tahunAjaran (misal "2024/2025")
      if (tahunAjaranStr) {
        santriUpdateData.tahunAjaranAktif = tahunAjaranStr;
        console.log('✅ Will set tahunAjaranAktif to:', tahunAjaranStr);
      }

      // tahunMasuk = kalau kosong, isi dari tahun awal tahunAjaran
      const santriCurrent = await strapi.entityService.findOne('api::santri.santri', santriId as any, {
        fields: ['tahunMasuk'],
      });
      
      console.log('🔍 Current santri tahunMasuk:', santriCurrent?.tahunMasuk);
      
      if (!santriCurrent?.tahunMasuk && tahunAjaranStr) {
        santriUpdateData.tahunMasuk = tahunAwal(tahunAjaranStr);
        console.log('✅ Will set tahunMasuk to:', santriUpdateData.tahunMasuk);
      }

      console.log('🔍 Final santriUpdateData:', JSON.stringify(santriUpdateData, null, 2));

      // Update santri jika ada data yang perlu diupdate
      if (Object.keys(santriUpdateData).length > 0) {
        console.log('🔄 Updating santri with ID:', santriId);
        const updatedSantri = await strapi.entityService.update('api::santri.santri', santriId as any, {
          data: santriUpdateData,
        });
        console.log('✅ Santri updated successfully!');
        console.log('🔍 Updated santri result:', JSON.stringify(updatedSantri, null, 2));
      } else {
        console.log('⚠️ No data to update');
      }
    } catch (error) {
      console.error('Error in afterCreate lifecycle:', error);
    }
  },

  async afterUpdate(event) {
    const updatedId: IdLike | undefined =
      (event as any).result?.id ?? (event as any).params?.where?.id ?? undefined;
    if (!updatedId) return;

    try {
      const updatedRiwayat = await strapi.entityService.findOne('api::riwayat-kelas.riwayat-kelas', updatedId as any, {
        populate: { tahunAjaran: true, santri: true },
      });
      
      // 3. Tangani status lulus - Kalau statusSantri berubah jadi LULUS
      if (!updatedRiwayat || updatedRiwayat.statusSantri !== 'LULUS') return;

      const santriId: IdLike | undefined = (updatedRiwayat as any).santri?.id ?? (updatedRiwayat as any).santri;
      const tahunAjaranStr: string | undefined = (updatedRiwayat as any).tahunAjaran?.tahunAjaran;
      if (!santriId) return;

      const santriUpdateData: any = {};
      
      // Isi tahunLulus dengan tahun akhir dari tahunAjaran
      if (tahunAjaranStr) {
        santriUpdateData.tahunLulus = tahunAkhir(tahunAjaranStr);
      }
      
      // Set isAlumni = true
      santriUpdateData.isAlumni = true;
      
      // Kosongkan kelasAktif & tahunAjaranAktif (karena sudah bukan siswa aktif)
      santriUpdateData.kelasAktif = null;
      santriUpdateData.tahunAjaranAktif = null;

      await strapi.entityService.update('api::santri.santri', santriId as any, {
        data: santriUpdateData,
      });
    } catch (error) {
      console.error('Error in afterUpdate lifecycle:', error);
    }
  },
};
