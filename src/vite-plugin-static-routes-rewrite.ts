import type { ViteDevServer } from "vite";
import PluginOptions from "./types.ts";

export default (options: PluginOptions) => {
  return {
    name: "vite-plugin-static-routes-rewrite",
    apply: "serve",
    configureServer(serve: ViteDevServer) {
      serve.middlewares.use((req, _, next) => {
        const { routes } = options;

        if (!routes) {
          throw new Error(`
            vite-plugin-static-routes-rewrite - 
            The object needs to look like this:
            {
              routes: [{
                from: "url",
                to: "url"
              }]
            }`);
        }

        const matchedRoute = (routes || []).find((_route) => {
          if (typeof _route?.from === "string") {
            return req?.originalUrl?.endsWith(_route?.from);
          } else if (_route?.from instanceof RegExp) {
            return _route?.from?.test(req.originalUrl || "");
          }

          return false;
        });

        if (matchedRoute) {
          if (matchedRoute.from instanceof RegExp) {
            req.url = (req?.originalUrl || "").replace(
              matchedRoute.from,
              matchedRoute.to
            );
          } else {
            req.url = matchedRoute.to;
          }
        }

        next();
      });
    },
  };
};
