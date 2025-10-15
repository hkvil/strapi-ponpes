export default {
  routes: [
    {
      method: 'POST',
      path: '/santris/import-csv',
      handler: 'santri.importCsv',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
