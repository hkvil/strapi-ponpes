import importSantriService from '../services/import-santri';

export default {
  async import(ctx) {
    return importSantriService.importSantri(ctx);
  },
};
