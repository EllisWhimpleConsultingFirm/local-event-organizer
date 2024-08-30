import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createServer$1 } from "vite";
const PORT = 3e3;
async function createServer() {
  const app = express();
  const vite = await createServer$1({
    server: { middlewareMode: true },
    appType: "custom"
  });
  app.get("health", (req, res) => {
    res.status(200).json({ message: "Healthy" });
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const appHtml = await render(url);
      const html = template.replace(``, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
createServer().then();
