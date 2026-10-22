import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Derive home-screen assets from the existing emblem; no external image service.
const source = await readFile(new URL("../src/app/icon.svg", import.meta.url));
const output = new URL("../public/icons/", import.meta.url);
await mkdir(output, { recursive: true });
for (const size of [192, 512]) {
  await sharp(source).resize(size, size).png().toFile(fileURLToPath(new URL(`app-${size}.png`, output)));
}
// Keep all artwork inside the central safe zone for circular/adaptive icon masks.
const inset = await sharp(source).resize(320, 320).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#0a0a0a" } })
  .composite([{ input: inset, gravity: "centre" }])
  .png()
  .toFile(fileURLToPath(new URL("app-maskable-512.png", output)));
await sharp(source).resize(180, 180).png().toFile(
  fileURLToPath(new URL("../src/app/apple-icon.png", import.meta.url)),
);
