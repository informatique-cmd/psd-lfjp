import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: "api-handlers",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/api/health") {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true, service: "lfjp-api" }));
            return;
          }
          if (req.url === "/api/auth/logout") {
            res.setHeader("Set-Cookie", "lfjp_admin_session=; Path=/; Max-Age=0");
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: true, message: "Déconnecté" }));
            return;
          }
          if (req.url?.startsWith("/api/auth/me")) {
            const cookie = req.headers.cookie || "";
            const hasAuthCookie = cookie.includes("lfjp_admin_session=");
            const hasAuthHeader = req.headers["x-lfjp-auth"] === "1";
            // Return user if cookie/header present, or if explicit param ?active=1
            if (hasAuthCookie || hasAuthHeader || req.url.includes("active=1")) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({
                user: {
                  login: "direction-lfjp",
                  name: "Direction LFJP",
                  avatar_url: "https://i.imgur.com/0YmGlXO.png"
                },
                authorizedUsers: ["direction-lfjp", "informatique-cmd"]
              }));
              return;
            }
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ user: null }));
            return;
          }
          if (req.url === "/api/github/pull-request" && req.method === "POST") {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 201;
            res.end(JSON.stringify({
              url: "https://github.com/informatique-cmd/psd-lfjp/pull/preview-mode",
              number: 1,
              branch: "admin/preview-branch",
              simulated: true,
              message: "Preview locale active. En production sur Vercel, la Pull Request GitHub sera automatiquement créée."
            }));
            return;
          }
          if (req.url === "/api/github/merge-pull-request" && req.method === "POST") {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify({
              merged: true,
              message: "Simulation de publication réussie. En production Vercel, le contenu est fusionné vers la branche principale."
            }));
            return;
          }
          next();
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
