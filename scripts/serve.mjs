import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

const root = resolve("out");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2", ".ico": "image/x-icon" };

if (!existsSync(resolve(root, "index.html"))) {
  console.error("Build Florii first with npm run build.");
  process.exit(1);
}

createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method || "")) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    return response.end();
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403);
      return response.end();
    }
    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) { file = resolve(file, "index.html"); info = await stat(file).catch(() => null); }
    if (!info?.isFile()) {
      file = resolve(root, "404.html");
      response.statusCode = 404;
    }
    response.setHeader("Content-Type", mime[extname(file)] || "application/octet-stream");
    response.setHeader("X-Content-Type-Options", "nosniff");
    if (request.method === "HEAD") return response.end();
    createReadStream(file).on("error", () => response.destroy()).pipe(response);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
  }
}).listen(port, host, () => console.log(`Florii is ready at http://${host}:${port}`));
