export default ({ env }) => ({
  host: 'localhost',
  port: 1337,
  url: env('STRAPI_URL', 'http://localhost:1337'),
  app: {
      keys: env.array('APP_KEYS'),
  },
  security: {
      cors: {
          enabled: true,
          origin: [env('FRONTEND_URL', 'http://localhost:3000')],
          credentials: true,
      },
  },
});