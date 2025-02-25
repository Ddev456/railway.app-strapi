/**
 * configuration router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::configuration.configuration', {
    config: {
        create: {
            middlewares: ["global::set-user"],
        },
        find: {
            middlewares: ["global::is-owner"],
        },
        findOne: {
            middlewares: ["global::is-owner"],
        },
        update: {
            middlewares: ["global::is-owner"],
        },
        delete: {
            middlewares: ["global::is-owner"],
        },
    }
});
