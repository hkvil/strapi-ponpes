// src/api/tahun-ajaran/content-types/tahun-ajaran/lifecycles.ts

// Helper function untuk nonaktifkan tahun ajaran lain
async function nonaktifkanTahunAjaranLain(excludeId?: string | number) {
  try {
    const filters: any = { aktif: true };
    if (excludeId) {
      filters.id = { $ne: excludeId };
    }

    const tahunAjaranAktif = await strapi.entityService.findMany('api::tahun-ajaran.tahun-ajaran', {
      filters,
      fields: ['id', 'tahunAjaran'],
      limit: 100,
    });

    for (const ta of tahunAjaranAktif) {
      await strapi.entityService.update('api::tahun-ajaran.tahun-ajaran', ta.id, {
        data: { aktif: false },
      });
      strapi.log.info(`⚠️ Nonaktifkan tahun ajaran: ${ta.tahunAjaran}`);
    }
  } catch (error) {
    console.error('Error nonaktifkan tahun ajaran lain:', error);
  }
}

export default {
  async beforeCreate(event) {
    const { data } = event.params as any;

    // Auto-generate label
    if (data.tahunAjaran && data.semester) {
      data.label = `${data.tahunAjaran} - ${data.semester}`;
    }

    // Jika akan diset aktif, nonaktifkan yang lain terlebih dahulu
    if (data.aktif === true) {
      await nonaktifkanTahunAjaranLain();
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params as any;

    // Auto-generate label
    if (data.tahunAjaran && data.semester) {
      data.label = `${data.tahunAjaran} - ${data.semester}`;
    }

    // Jika akan diset aktif, nonaktifkan yang lain terlebih dahulu
    if (data.aktif === true) {
      await nonaktifkanTahunAjaranLain(where.id);
    }
  },

  async afterUpdate(event) {
    const { result, params } = event as any;
    
    // Jika tahun ajaran dinonaktifkan, bersihkan referensi di santri
    if (result?.aktif === false) {
      try {
        // Cari santri yang masih menggunakan tahun ajaran ini sebagai tahunAjaranAktif
        // Karena tahunAjaranAktif sekarang string, cari berdasarkan string tahunAjaran
        const santrisToUpdate = await strapi.entityService.findMany('api::santri.santri', {
          filters: { tahunAjaranAktif: result.tahunAjaran },
          fields: ['id', 'nama'],
          limit: 1000,
        });

        // Kosongkan tahunAjaranAktif untuk santri-santri tersebut
        for (const santri of santrisToUpdate) {
          await strapi.entityService.update('api::santri.santri', santri.id, {
            data: { tahunAjaranAktif: null },
          });
        }

        if (santrisToUpdate.length > 0) {
          strapi.log.info(`✅ Cleared tahunAjaranAktif for ${santrisToUpdate.length} santri`);
        }
      } catch (error) {
        console.error('Error clearing santri tahunAjaranAktif:', error);
      }
    }
  },

  async beforeDelete(event) {
    const { where } = event.params as any;
    
    try {
      // Ambil data tahun ajaran yang akan dihapus
      const tahunAjaranToDelete = await strapi.entityService.findOne('api::tahun-ajaran.tahun-ajaran', where.id, {
        fields: ['tahunAjaran'],
      });

      if (!tahunAjaranToDelete) return;

      // 1. Cek apakah ada riwayat kelas yang menggunakan tahun ajaran ini
      const riwayatKelas = await strapi.entityService.findMany('api::riwayat-kelas.riwayat-kelas', {
        filters: { tahunAjaran: { id: where.id } },
        fields: ['id'],
        limit: 1,
      });

      if (riwayatKelas.length > 0) {
        throw new Error('Tidak dapat menghapus tahun ajaran ini karena masih digunakan di riwayat kelas');
      }

      // 2. Cek apakah ada santri yang menggunakan sebagai tahunAjaranAktif
      // Karena tahunAjaranAktif sekarang string, cari berdasarkan string tahunAjaran
      const santriAktif = await strapi.entityService.findMany('api::santri.santri', {
        filters: { tahunAjaranAktif: tahunAjaranToDelete.tahunAjaran },
        fields: ['id'],
        limit: 1,
      });

      if (santriAktif.length > 0) {
        throw new Error('Tidak dapat menghapus tahun ajaran ini karena masih digunakan sebagai tahun ajaran aktif santri');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Gagal validasi sebelum menghapus tahun ajaran');
    }
  },
};
