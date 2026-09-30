import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";

const dir = path.join(process.cwd(), "new trips details");
const outDir = path.join(process.cwd(), "scripts", "pdf-text");
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".pdf"));

for (const file of files) {
  const buf = fs.readFileSync(path.join(dir, file));
  const parser = new PDFParse({ data: buf });
  await parser.load();
  const result = await parser.getText();
  const text = typeof result === "string" ? result : result?.text || JSON.stringify(result, null, 2);
  const safe = file.replace(/[^\w.\-]+/g, "_").replace(/\.pdf$/i, ".txt");
  fs.writeFileSync(path.join(outDir, safe), text, "utf8");
  await parser.destroy();
  console.log("OK", file, "chars=", text.length);
}
