// Generates site imagery with Google's Gemini image model (Nano Banana Pro).
//
//   npm run images                      generate any image that doesn't exist yet
//   npm run images -- hero-boutique     only the named image(s)
//   npm run images -- --force           regenerate everything
//
// Requires GEMINI_API_KEY in .env.local. Full-resolution originals are kept in
// assets/originals/ (not deployed); web-optimised WebP files go to public/images/.

import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { images } from "./image-manifest.mjs";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3-pro-image";
const CONCURRENCY = Number(process.env.IMAGE_CONCURRENCY ?? 4);
const ROOT = path.resolve(import.meta.dirname, "..");

if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY. Add it to .env.local and run via `npm run images`.");
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

const exists = (p) => access(p).then(() => true, () => false);

async function generate(image, attempt = 1) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: image.prompt }] }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: image.aspectRatio, imageSize: image.size },
        },
      }),
    },
  );

  const body = await res.json().catch(() => ({}));
  const part = body?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);

  if (!res.ok || !part) {
    const reason = body?.error?.message ?? body?.candidates?.[0]?.finishReason ?? res.statusText;
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 4000 * attempt));
      return generate(image, attempt + 1);
    }
    throw new Error(`${image.name}: ${reason}`);
  }

  return Buffer.from(part.inlineData.data, "base64");
}

async function processImage(image) {
  const originalPath = path.join(ROOT, "assets/originals", image.group, `${image.name}.jpg`);
  const webPath = path.join(ROOT, "public/images", image.group, `${image.name}.webp`);

  if (!force && (await exists(webPath))) {
    console.log(`• skip   ${image.group}/${image.name} (exists)`);
    return;
  }

  const started = Date.now();
  const buffer = await generate(image);

  await mkdir(path.dirname(originalPath), { recursive: true });
  await mkdir(path.dirname(webPath), { recursive: true });
  await writeFile(originalPath, buffer);
  await sharp(buffer)
    .resize({ width: image.width, withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toFile(webPath);

  console.log(`✓ done   ${image.group}/${image.name} (${((Date.now() - started) / 1000).toFixed(1)}s)`);
}

const queue = images.filter((img) => only.length === 0 || only.includes(img.name));
const failures = [];

async function worker() {
  while (queue.length) {
    const image = queue.shift();
    try {
      await processImage(image);
    } catch (err) {
      failures.push(err.message);
      console.error(`✗ failed ${err.message}`);
    }
  }
}

console.log(`Generating ${queue.length} image(s) with ${MODEL}…`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

if (failures.length) {
  console.error(`\n${failures.length} image(s) failed:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log("\nAll images ready.");
