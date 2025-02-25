export default ({ env }) => ({
    host: env('NODE_ENV') === 'production' ? '::' : 'localhost',
    port: env.int('PORT', 1337),
    url: env('URL', 'http://localhost:1337'),
    app: {
        keys: env.array('APP_KEYS'),
    },
    security: {
        cors: {
            enabled: true,
            origin: [
                env('FRONTEND_URL', 'http://localhost:3000'),
            ],
            credentials: true,
        },
    },
    middlewares: {
        settings: {
            session: {
                enabled: true,
                secure: true,
                sameSite: 'none',
                proxy: true
            }
        }
    },
    proxy: env('NODE_ENV') === 'production'
});