// src/index.ts
import type { Core } from '@strapi/strapi';
import { seedLembaga } from './seeds/lembaga.seed';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Trigger manual via ENV agar tidak jalan tiap boot
    if (process.env.RUN_SEED === 'lembaga') {
      strapi.log.info('🚀 Running lembaga seed (bootstrap)…');
      await seedLembaga(strapi, { publish: true }); // set false kalau tidak ingin auto publish
      strapi.log.info('✅ Lembaga seed done.');
    } else {
      strapi.log.info('⏭️  Skip seeding (set RUN_SEED=lembaga to run).');
    }
  },
};
