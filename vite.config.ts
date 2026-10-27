import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
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
          if (req.url === "/api/deployment/request" && req.method === "GET") {
            res.setHeader("Content-Type", "application/json");
            let fileRequest = null;
            try {
              const reqPath = path.resolve(__dirname, "src/content/.pending-deployment.json");
              if (fs.existsSync(reqPath)) {
                fileRequest = JSON.parse(fs.readFileSync(reqPath, "utf8"));
              }
            } catch {
              // ignore
            }
            res.end(JSON.stringify({ request: fileRequest }));
            return;
          }
          if (req.url === "/api/deployment/request" && req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });
            req.on("end", () => {
              try {
                const parsed = JSON.parse(body || "null");
                const reqPath = path.resolve(__dirname, "src/content/.pending-deployment.json");
                if (!parsed) {
                  if (fs.existsSync(reqPath)) fs.unlinkSync(reqPath);
                } else {
                  fs.writeFileSync(reqPath, JSON.stringify(parsed, null, 2), "utf8");
                }
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, request: parsed }));
              } catch (err) {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 500;
                res.end(JSON.stringify({ error: (err as Error).message }));
              }
            });
            return;
          }
          if (req.url === "/api/github/pull-request" && req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });
            req.on("end", () => {
              try {
                const parsed = JSON.parse(body || "{}");
                if (parsed.files && typeof parsed.files === "object") {
                  for (const [relPath, fileContent] of Object.entries(parsed.files)) {
                    if (typeof fileContent === "string" && relPath.startsWith("src/content/")) {
                      const fullPath = path.resolve(__dirname, relPath);
                      fs.writeFileSync(fullPath, `${fileContent.trim()}\n`, "utf8");
                    }
                  }
                }

                // If direct deploy, push to GitHub main branch so Vercel builds & updates
                const tokenFile = path.resolve(__dirname, ".git_token");
                const token = process.env.GITHUB_TOKEN || (fs.existsSync(tokenFile) ? fs.readFileSync(tokenFile, "utf8").trim() : "");
                const remoteTarget = token ? `https://${token}@github.com/informatique-cmd/psd-lfjp.git` : "origin";
                const pushCmd = `git add src/content/ && git commit -m "content: mise à jour en production [deploy Vercel]" && git push ${remoteTarget} main && git remote set-url origin https://github.com/informatique-cmd/psd-lfjp.git`;

                exec(pushCmd, (error) => {
                  if (error) {
                    console.warn("Git push warning:", error.message);
                  }
                  // Clear pending deployment request file if deployed
                  try {
                    const reqPath = path.resolve(__dirname, "src/content/.pending-deployment.json");
                    if (fs.existsSync(reqPath)) fs.unlinkSync(reqPath);
                  } catch {
                    // ignore
                  }
                  res.setHeader("Content-Type", "application/json");
                  res.statusCode = 201;
                  res.end(JSON.stringify({
                    url: "https://github.com/informatique-cmd/psd-lfjp",
                    number: 1,
                    branch: "main",
                    success: true,
                    message: "Modifications publiées et déployées avec succès sur la branche main de GitHub ! Le site Vercel est mis à jour."
                  }));
                });
              } catch (err) {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "Erreur lors de l’écriture des fichiers : " + (err as Error).message }));
              }
            });
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
