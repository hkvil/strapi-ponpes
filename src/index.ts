// src/index.ts
import type { Core } from '@strapi/strapi';
import { seedLembaga } from './seeds/lembaga.seed';
import { seedPonpesData } from './seeds/ponpes.seed';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Trigger manual via ENV agar tidak jalan tiap boot
    if (process.env.RUN_SEED === 'lembaga') {
      strapi.log.info('🚀 Running lembaga seed (bootstrap)…');
      await seedLembaga(strapi, { publish: true }); // set false kalau tidak ingin auto publish
      strapi.log.info('✅ Lembaga seed done.');
    } else if (process.env.RUN_SEED === 'ponpes') {
      strapi.log.info('🚀 Running ponpes full seed (bootstrap)…');
      await seedPonpesData(strapi);
      strapi.log.info('✅ Ponpes seed done.');
    } else {
      strapi.log.info('⏭️  Skip seeding (set RUN_SEED=lembaga or RUN_SEED=ponpes to run).');
    }
  },
};
