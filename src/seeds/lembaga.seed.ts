// src/seeds/lembaga.seed.ts
import type { Core } from '@strapi/strapi';

type SeedItem = { nama: string; slug: string };

const seeds: SeedItem[] = [
  // ORGAN STRUKTURAL
  { nama: 'Pusat Kepegawaian dan Pengawasan', slug: 'pusat-kepegawaian-dan-pengawasan' },
  { nama: 'Pusat Pengawasan dan Pembinaan SDM Putri', slug: 'pusat-pengawasan-dan-pembinaan-sdm-putri' },
  { nama: 'Pusat Penjaminan Mutu Pendidikan dan Pengajaran', slug: 'pusat-penjaminan-mutu-pendidikan-dan-pengajaran' },

  // ORGAN PENYELENGGARA PENDIDIKAN FORMAL
  { nama: 'Taman Kanak-Kanak', slug: 'taman-kanak-kanak' },
  { nama: 'Taman Pendidikan Al-Qur’an', slug: 'taman-pendidikan-al-quran' },
  { nama: 'Madrasah Diniyah', slug: 'madrasah-diniyah' },
  { nama: 'Madrasah Ibtidaiyah', slug: 'madrasah-ibtidaiyah' },
  { nama: 'Madrasah Tsanawiyah Putra', slug: 'madrasah-tsanawiyah-putra' },
  { nama: 'Madrasah Tsanawiyah Putri', slug: 'madrasah-tsanawiyah-putri' },
  { nama: 'Madrasah Aliyah Putra', slug: 'madrasah-aliyah-putra' },
  { nama: 'Madrasah Aliyah Putri', slug: 'madrasah-aliyah-putri' },
  { nama: 'Madrasah Tahfizh Lil Athfal', slug: 'madrasah-tahfizh-lil-athfal' },
  { nama: 'Institut Mujahadah dan Pembibitan', slug: 'institut-mujahadah-dan-pembibitan' },
  { nama: 'Haromain', slug: 'haromain' }, // kalau seharusnya "Haramain", ganti ke 'haramain'
  { nama: 'Al Ittifaqiah Language Center', slug: 'al-ittifaqiah-language-center' },

  // ORGAN PENYELENGGARA PENDIDIKAN INFORMAL
  { nama: 'LEMTATIQHI PA', slug: 'lemtatiqhi-pa' },
  { nama: 'LEMTATIQHI PI', slug: 'lemtatiqhi-pi' },
  { nama: 'LEBAH Putra', slug: 'lebah-putra' },
  { nama: 'LEBAH Putri', slug: 'lebah-putri' },
  { nama: 'LESGATRAM Putra', slug: 'lesgatram-putra' },
  { nama: 'LESGATRAM Putri', slug: 'lesgatram-putri' },
  { nama: 'Lembaga Muhadhoroh Putra', slug: 'muhadhoroh-putra' },
  { nama: 'Lembaga Muhadhoroh Putri', slug: 'muhadhoroh-putri' },
  { nama: 'LEMKAKIKU', slug: 'lemkakiku' },
  { nama: 'LEMKAPPI', slug: 'lemkappi' },
  { nama: 'LERASI_LOGINTARU', slug: 'lerasi-logintaru' },
  { nama: 'LK2PPI', slug: 'lk2ppi' },

  // ORGAN PENGASUHAN DAN PENGKADERAN
  { nama: 'DATSUHBINOSPI Putra', slug: 'datsuhbinospi-putra' },
  { nama: 'DATSUHBINOSPI Putri', slug: 'datsuhbinospi-putri' },
  { nama: 'Biro Pengkaderan, Beasiswa dan Kerjasama', slug: 'biro-pengkaderan-beasiswa-dan-kerjasama' },

  // ORGAN UMUM
  { nama: 'ADKEU', slug: 'adkeu' },
  { nama: 'BIDDAPPMASSUL', slug: 'biddappmassul' },
  { nama: 'Bidang Kebersihan, Perairan, Pertamanan dan Lingkungan Hidup', slug: 'bidang-kebersihan-perairan-pertamanan-dan-lingkungan-hidup' },
  { nama: 'Bidang Sarana Prasarana, Perlistrikan dan Transportasi', slug: 'bidang-sarana-prasarana-perlistrikan-dan-transportasi' },
  { nama: 'KESLOGMESS', slug: 'keslogmess' },
  { nama: 'Klinik', slug: 'klinik' },
  { nama: 'Bidang Keamanan, Ketertiban', slug: 'bidang-keamanan-ketertiban' },
  { nama: 'Hubungan Masyarakat dan Protokol', slug: 'humas-dan-protokol' },

  // ORGAN STRUKTURAL OTONOM
  { nama: 'IWAPPI', slug: 'iwappi' },
  { nama: 'PUSPAMAYA', slug: 'puspamaya' },
  { nama: 'PUSDEM', slug: 'pusdem' },
  { nama: 'Avicenna Institute', slug: 'avicenna-institute' },
  { nama: 'PUSDAP', slug: 'pusdap' },
  { nama: 'PBHU', slug: 'pbhu' },
  { nama: 'LPBI', slug: 'lpbi' },

  //ORGAN STRUKTURAL KHUSUS
];

export async function seedLembaga(
  strapi: Core.Strapi,
  opts: { publish?: boolean } = {}
) {
  const { publish = false } = opts;
  const uid = 'api::lembaga.lembaga';

  for (const item of seeds) {
    const existing = await strapi.entityService.findMany(uid, {
      filters: { slug: item.slug },
      fields: ['id', 'slug', 'nama'],
      limit: 1,
    });

    if (!existing || existing.length === 0) {
      await strapi.entityService.create(uid, {
        data: {
          nama: item.nama,
          slug: item.slug,
          ...(publish ? { publishedAt: new Date() } : {}),
        },
      });
      strapi.log.info(`✅ Create: ${item.slug}`);
    } else {
      const id = existing[0].id;
      await strapi.entityService.update(uid, id, {
        data: { nama: item.nama },
      });
      strapi.log.info(`♻️ Update nama: ${item.slug}`);
    }
  }

  strapi.log.info('🌱 Seed lembaga selesai.');
}