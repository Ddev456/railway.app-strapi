/**
 * `rate-limit` middleware
 */

import { RateLimit } from "koa2-ratelimit";
import type { Core } from "@strapi/strapi";
import { Context, Next } from "koa";

export default (_config: any, { }: { strapi: Core.Strapi }) => {
  return async (ctx: Context, next: Next) => {
    return RateLimit.middleware({
      interval: { min: 60 },
      max: 4,
      message: "Trop de demandes, veuillez réessayer plus tard.",
      headers: true,
    })(ctx, next);
  };
};