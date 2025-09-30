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

    const santriId: IdLike | undefined =
      result?.santri?.id ?? result?.santri ?? extractRelId(params?.data?.santri);
    const taId: IdLike | undefined =
      result?.tahunAjaran?.id ?? result?.tahunAjaran ?? extractRelId(params?.data?.tahunAjaran);
    
    if (!santriId || !taId) {
      console.log('Skip afterCreate: santriId atau taId tidak ditemukan');
      return;
    }

    try {
      // 1. Menutup riwayat lama - Kalau ada riwayat santri lain yang masih "open" (tanggalSelesai = null), otomatis ditutup dengan tanggal hari ini
      const openRiwayatLama = await strapi.entityService.findMany('api::riwayat-kelas.riwayat-kelas', {
        filters: {
          santri: { id: santriId },
          ...(result?.id ? { id: { $ne: result.id } } : {}), // kecuali record baru ini
          tanggalSelesai: { $null: true }, // yang masih open
        },
        fields: ['id'],
        limit: 1000,
      });
      
      const today = new Date().toISOString().slice(0, 10);
      for (const riwayat of openRiwayatLama) {
        await strapi.entityService.update('api::riwayat-kelas.riwayat-kelas', riwayat.id, {
          data: { tanggalSelesai: today },
        });
      }

      // 2. Ambil riwayat kelas terbaru (yang baru saja dibuat) dengan relasi kelas
      const riwayatTerbaru = await strapi.entityService.findOne('api::riwayat-kelas.riwayat-kelas', result.id, {
        populate: { kelas: true, tahunAjaran: true },
        fields: ['id'],
      });

      // 3. Sinkronisasi shortcut di santri
      const santriUpdateData: any = {};
      
      // kelasAktif = kelas dari riwayat terbaru
      const kelasId = (riwayatTerbaru as any)?.kelas?.id;
      if (kelasId) {
        santriUpdateData.kelasAktif = { connect: [{ id: kelasId }] };
      }
      
      // tahunAjaranAktif = tahun ajaran dari riwayat terbaru
      if (taId) {
        santriUpdateData.tahunAjaranAktif = { connect: [{ id: taId }] };
      }

      // tahunMasuk = kalau kosong, isi dari tahun awal tahunAjaran
      const santriCurrent = await strapi.entityService.findOne('api::santri.santri', santriId as any, {
        fields: ['tahunMasuk'],
      });
      
      if (!santriCurrent?.tahunMasuk) {
        const tahunAjaranStr = (riwayatTerbaru as any)?.tahunAjaran?.tahunAjaran;
        if (tahunAjaranStr) {
          santriUpdateData.tahunMasuk = tahunAwal(tahunAjaranStr);
        }
      }

      // Update santri jika ada data yang perlu diupdate
      if (Object.keys(santriUpdateData).length > 0) {
        await strapi.entityService.update('api::santri.santri', santriId as any, {
          data: santriUpdateData,
        });
        console.log(`✅ Updated santri ${santriId} with kelasAktif: ${kelasId}, tahunAjaranAktif: ${taId}`);
      }
    } catch (error) {
      console.error('Error in afterCreate lifecycle:', error);
      // Don't throw error to prevent blocking the main operation
    }
  },

  async afterUpdate(event) {
    const updatedId: IdLike | undefined =
      (event as any).result?.id ?? (event as any).params?.where?.id ?? undefined;
    if (!updatedId) return;

    try {
      const updatedRiwayat = await strapi.entityService.findOne('api::riwayat-kelas.riwayat-kelas', updatedId as any, {
        populate: { tahunAjaran: true, santri: true },
        fields: ['statusSantri'],
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
      santriUpdateData.kelasAktif = { disconnect: [] };
      santriUpdateData.tahunAjaranAktif = { disconnect: [] };

      await strapi.entityService.update('api::santri.santri', santriId as any, {
        data: santriUpdateData,
      });
    } catch (error) {
      console.error('Error in afterUpdate lifecycle:', error);
      // Don't throw error to prevent blocking the main operation
    }
  },
};
