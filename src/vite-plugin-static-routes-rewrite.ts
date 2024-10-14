import type { ViteDevServer } from "vite";
import PluginOptions from "./types.ts";

export default (options: PluginOptions) => {
  return {
    name: "vite-plugin-static-routes-rewrite",
    apply: "serve",
    configureServer(serve: ViteDevServer) {
      serve.middlewares.use((req, _, next) => {
        const { routes } = options;

        // Überprüfen, ob die URL entweder mit einer statischen Route oder einer Regex-basierten Route übereinstimmt
        const matchedRoute = routes.find((_route) => {
          if (typeof _route.from === "string") {
            return req?.originalUrl?.endsWith(_route.from);
          } else if (_route.from instanceof RegExp) {
            return _route.from.test(req.originalUrl || "");
          }
          return false;
        });

        // Wenn eine passende Route gefunden wurde, URL umschreiben
        if (matchedRoute) {
          // Wenn es eine Regex-basierte Route ist, können wir den Zielpfad dynamisch anpassen
          if (matchedRoute.from instanceof RegExp) {
            req.url = (req?.originalUrl || '').replace(matchedRoute.from, matchedRoute.to);
          } else {
            req.url = matchedRoute.to;
          }
        }

        next();
      });
    },
  };
}
