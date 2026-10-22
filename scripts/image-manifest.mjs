// Prompts for every generated image on the site.
// Run `npm run images` to generate anything missing, or
// `npm run images -- <name> [name...] --force` to regenerate specific images.
//
// Rules for prompts (keeps imagery usable beyond the demo + Health Canada friendly):
//  - no people, no lifestyle scenes, no vapour being exhaled
//  - no text, logos or brand names (AI text is unreadable and implies fake brands)
//  - consistent black + warm gold palette

const PRODUCT_STYLE =
  "Commercial e-commerce product photograph. The product is perfectly centered and occupies roughly 55% of the frame height, with generous empty space around it on all sides. It stands on a glossy black acrylic surface with a soft, clean reflection, against a seamless deep charcoal-black studio backdrop with a soft, diffuse warm golden glow directly behind the product. Soft diffused key light from the upper left and a thin warm gold rim light outlining the edges; the light sources themselves are out of frame and never visible. The background is clean and uniform with no studio equipment, no plinth and no props, and all four corners of the frame fall off to pure deep black with no bright spots. Photorealistic, tack sharp, accurate real-world materials and proportions, 100mm macro lens, f/8. Absolutely no text, letters, numbers, logos, labels or watermarks. No people, no hands, no vapour.";

const CATEGORY_STYLE =
  "Editorial still-life photograph for a premium specialty retailer. Dark, moody black and warm gold palette, cinematic low-key lighting with warm gold highlights, shallow depth of field. Photorealistic, accurate real-world materials. Absolutely no text, letters, numbers, logos, labels or watermarks. No people, no hands.";

const NO_TEXT = "Absolutely no readable text, letters, numbers, logos, brand names or watermarks anywhere in the image. No people.";

/** @type {{ name: string, group: string, aspectRatio: string, size: "1K" | "2K" | "4K", width: number, prompt: string }[]} */
export const images = [
  // ---------------------------------------------------------------- scenes
  {
    name: "hero-boutique",
    group: "scenes",
    aspectRatio: "16:9",
    size: "4K",
    width: 2880,
    prompt: `Wide interior photograph of an upscale, modern specialty vape boutique at night, completely empty. Black lacquered walls and floor-to-ceiling display shelving with warm LED-lit brushed brass edges, neatly merchandised rows of unbranded vape devices, pod kits and small glass e-liquid bottles. A long black marble sales counter with brass trim runs through the right side of the foreground. Warm golden accent lighting, polished dark floor with soft reflections. The left third of the frame is darker, calmer and less busy, leaving negative space for website headline text. Architectural interior photography, 24mm lens, photorealistic, high dynamic range. ${NO_TEXT}`,
  },
  {
    name: "vapor",
    group: "scenes",
    aspectRatio: "16:9",
    size: "2K",
    width: 2560,
    prompt: `Abstract high-speed photograph of soft, billowing clouds of white vapour swirling against a pure black background, backlit with warm golden light so the edges glow amber and gold. Elegant, flowing, silky texture, with most of the frame left as pure black negative space. Photorealistic, ultra detailed. No objects. ${NO_TEXT}`,
  },
  {
    name: "storefront",
    group: "scenes",
    aspectRatio: "3:2",
    size: "4K",
    width: 2560,
    prompt: `Exterior photograph at blue hour of a modern boutique retail storefront on a quiet downtown street in a mid-sized Canadian city. Matte black facade with slim brass trim and large floor-to-ceiling glass windows. Inside, the shop is open and fully merchandised: dark black display shelving with warm golden LED accent strips, stocked with rows of small products, softly out of focus through the glass. The interior is moody and warm, not bright white, no bare or empty shelves. A blank black sign panel above the door with no lettering. Wet pavement with gentle reflections and a couple of street lamps. Architectural photography, 35mm lens, photorealistic. No cars in focus. ${NO_TEXT}`,
  },
  {
    name: "counter",
    group: "scenes",
    aspectRatio: "4:5",
    size: "2K",
    width: 1600,
    prompt: `Close-up photograph of a polished black marble retail counter with a brushed brass edge inside an upscale vape boutique. On the counter, a neatly arranged selection of unbranded premium pod vape devices in black and gold finishes and two small amber glass dropper bottles with plain black labels. Background softly blurred with warm golden bokeh from lit display shelves. Moody, warm, photorealistic, 85mm lens, f/2. ${NO_TEXT}`,
  },
  {
    name: "eliquid-wall",
    group: "scenes",
    aspectRatio: "21:9",
    size: "4K",
    width: 2880,
    prompt: `Wide photograph of a wall of illuminated retail shelving in a boutique: rows upon rows of small glass and plastic e-liquid bottles with plain blank black labels, arranged in neat colour-graded order, liquids in amber, gold, clear and soft jewel tones catching warm backlight. Brushed brass shelf edges with warm LED strips. Shallow depth of field, focus on the centre shelves, edges falling into soft darkness. Photorealistic. ${NO_TEXT}`,
  },
  {
    name: "spotlight-device",
    group: "scenes",
    aspectRatio: "16:9",
    size: "4K",
    width: 2560,
    prompt: `Cinematic wide product hero photograph: a single slim brushed champagne-gold anodized aluminium disposable vape device with a matte black mouthpiece stands upright on a polished black marble plinth, placed right of centre. Deep black background, soft warm golden rim light tracing the device's edges, a soft golden glow behind it and faint, delicate wisps of vapour drifting in the darkness behind. The left half of the frame is calm, empty dark negative space for website text. Shot on a 100mm lens, shallow depth of field, photorealistic, premium commercial look. ${NO_TEXT}`,
  },
  {
    name: "marble",
    group: "scenes",
    aspectRatio: "16:9",
    size: "2K",
    width: 2560,
    prompt: `Seamless top-down texture photograph of polished nero marquina black marble with fine, delicate veins of real gold leaf running through it. Subtle and elegant, mostly deep black. Even soft lighting, photorealistic, ultra high detail. No objects. ${NO_TEXT}`,
  },

  // ------------------------------------------------------------ categories
  {
    name: "disposables",
    group: "categories",
    aspectRatio: "4:5",
    size: "2K",
    width: 1200,
    prompt: `A curated arrangement of five sleek unbranded disposable vape devices standing upright in a staggered row on a black marble plinth, finishes in brushed champagne gold, matte black, deep emerald green, burgundy and pearl white, each with a black mouthpiece. ${CATEGORY_STYLE}`,
  },
  {
    name: "pod-systems",
    group: "categories",
    aspectRatio: "4:5",
    size: "2K",
    width: 1200,
    prompt: `A premium refillable pod system vape device in matte black with gold accents lying at an angle next to its detached transparent refillable pod cartridge, and a second device in brushed gold standing upright, arranged on dark slate stone. ${CATEGORY_STYLE}`,
  },
  {
    name: "e-liquids",
    group: "categories",
    aspectRatio: "4:5",
    size: "2K",
    width: 1200,
    prompt: `Three glass e-liquid bottles with black dropper caps filled with amber, golden and clear liquids, plain blank black labels, arranged on a black marble surface, warm light passing through the liquid and casting golden caustic reflections on the marble. ${CATEGORY_STYLE}`,
  },
  {
    name: "advanced-kits",
    group: "categories",
    aspectRatio: "4:5",
    size: "2K",
    width: 1200,
    prompt: `A premium box mod vape kit in black zinc alloy with brushed gold side panels and a glass sub-ohm tank on top, standing at a three-quarter angle on black volcanic stone, small blank dark display screen. ${CATEGORY_STYLE}`,
  },
  {
    name: "coils-pods",
    group: "categories",
    aspectRatio: "4:5",
    size: "2K",
    width: 1200,
    prompt: `Neatly arranged replacement vape coils (stainless steel cylinders with visible mesh windows) and empty transparent replacement pod cartridges laid out in a precise grid on a matte black tray, viewed from above at a slight angle. ${CATEGORY_STYLE}`,
  },
  {
    name: "accessories",
    group: "categories",
    aspectRatio: "4:5",
    size: "2K",
    width: 1200,
    prompt: `Flat-lay of vape accessories on a black leather surface: two 18650 lithium batteries with plain gold wraps, a braided black USB-C charging cable coiled neatly, a black leather zip carrying case and a compact two-bay battery charger. ${CATEGORY_STYLE}`,
  },

  // -------------------------------------------------------------- products
  ...[
    ["disposable-gold", "A slim cylindrical disposable vape device in brushed champagne-gold anodized aluminium with a matte black flat mouthpiece."],
    ["disposable-onyx", "A slim flat rectangular disposable vape device in soft-touch matte black with a thin polished gold band just below the mouthpiece."],
    ["disposable-emerald", "A slim flat rectangular disposable vape device with a glossy deep emerald-green-to-black gradient finish and a black mouthpiece."],
    ["disposable-crimson", "A slim flat rectangular disposable vape device in metallic deep burgundy crimson with a black mouthpiece."],
    ["disposable-pearl", "A slim flat rectangular disposable vape device in pearlescent white with a subtle iridescent sheen and a satin silver mouthpiece."],
    ["disposable-max", "A larger rectangular high-capacity disposable vape device in gunmetal grey with a small dark rectangular glass display window on the front (screen switched off and blank) and a black mouthpiece."],
    ["pod-noir", "A compact refillable pod system vape device in matte black with a textured black leather inlay panel and a smoked translucent pod on top."],
    ["pod-gilded", "A compact refillable pod system vape device in polished gold metal with a clear transparent refillable pod on top, slim oval shape."],
    ["pod-carbon", "A refillable pod mod vape device with a carbon fibre front panel, gunmetal frame, a small blank dark display, a knurled adjustable airflow ring and a translucent grey pod."],
    ["pod-closed", "A sleek closed pod system vape device in black and brushed silver standing upright, with two spare prefilled pods (amber-tinted liquid, unlabelled) lying in front of it."],
    ["liquid-30-salt", "A 30 mL glass e-liquid bottle with a black child-resistant dropper cap, filled with golden amber liquid, plain matte black label with no printing."],
    ["liquid-60-freebase", "A 60 mL squeezable matte black plastic e-liquid bottle with a slender nozzle tip and a gold child-resistant cap, no printing."],
    ["liquid-trio", "A set of three 30 mL glass e-liquid bottles with black dropper caps, liquids in pale gold, amber and clear, plain black labels with no printing, arranged in a small triangle."],
    ["mod-sovereign", "A premium box mod vape kit in black zinc alloy with brushed gold side panels and a glass sub-ohm tank, small blank dark screen, three-quarter view."],
    ["mod-compact", "A compact single-battery box mod vape kit in gunmetal grey with a short glass tank and black drip tip, small blank screen, three-quarter view."],
    ["coils-mesh", "A neat row of five replacement vape mesh coils (stainless steel cylinders with mesh windows and white cotton visible) standing upright in front of a small open matte black box."],
    ["pods-replacement", "Three empty transparent replacement vape pod cartridges with black bases, arranged in a fan."],
    ["battery-18650", "Two cylindrical 18650 rechargeable lithium batteries with plain glossy gold wraps and no printing, standing side by side."],
    ["charger-dual", "A compact matte black two-bay smart battery charger with two gold-wrapped cylindrical batteries inserted, small blank indicator panel."],
    ["case-leather", "A premium black leather zip-around vape carrying case, partially open to reveal a soft grey felt interior with elastic loops."],
    ["cable-usbc", "A neatly coiled braided black USB-C charging cable with gold-plated metal connectors."],
  ].map(([name, subject]) => ({
    name,
    group: "products",
    aspectRatio: "1:1",
    size: "2K",
    width: 1600,
    prompt: `${subject} ${PRODUCT_STYLE}`,
  })),
];
