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
      allowedHosts: ['.ngrok-free.app','.trycloudflare.com'], // ✅ izinkan semua domain ngrok
      port: 5173,
    },
  });
};
