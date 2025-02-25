/**
 * issue router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::issue.issue', {
    config: {
        create: {
            middlewares: ["global::set-user", "api::issue.rate-limit"],
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
