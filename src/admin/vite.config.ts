import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      host: true,
      allowedHosts: ['.hidayat.me'], // ✅ izinkan semua domain hidayat.me
      port: 5173,
    },
  });
};
