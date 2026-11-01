/**
 * Turns the raw photos in /photos into web-ready WebP files in
 * /public/images/products, named after the product they belong to:
 *   <slug>-<n>-480.webp and <slug>-<n>-960.webp
 *
 * Run with `npm run images`. Existing outputs are skipped, so delete a file
 * (or the whole folder) to regenerate it. To add a product photo, drop the JPG
 * into /photos and add its filename to the right slug below.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = path.resolve('photos')
const OUT = path.resolve('public/images/products')
const WIDTHS = [480, 960]

// slug -> source photos, in display order (the first one is the cover)
const PHOTOS = {
  'woven-crossbody': ['14-28-26', '14-28-36', '14-28-33'],
  'croc-top-handle': ['14-28-48', '14-28-41', '14-28-46', '14-28-45'],
  'curve-hobo': ['14-28-56', '14-28-52', '14-28-53', '14-28-54', '14-28-55', '14-28-50'],
  'suede-bow-bag': ['14-29-01', '14-28-59', '14-29-02', '14-28-58'],
  'heritage-duffel': ['14-29-28', '14-29-21', '14-29-24', '14-29-22', '14-29-27', '14-29-25'],
  'croc-trapeze-bag': ['14-29-53', '14-29-55', '14-29-51', '14-29-54'],
  'quilted-phone-crossbody': ['14-30-04', '14-30-06', '14-30-01', '14-30-02'],
  'zip-bifold-wallet': ['14-29-09', '14-29-05'],
  'classic-bifold-wallet': ['14-29-46', '14-29-47', '14-29-48'],
  'quilted-long-wallet': ['14-30-09', '14-30-10'],
  'espresso-dress-belt': ['14-29-40', '14-29-33', '14-29-35'],
  'black-dress-belt': ['14-29-36', '14-29-37'],
  'croc-card-holder': ['14-29-42'],
  'slim-card-holder': ['14-29-43'],
  'slim-phone-sleeve': ['14-29-50'],
}

// These photos carry the logo and price printed along the top; that band is cropped off.
const WATERMARKED = new Set(['croc-trapeze-bag', 'quilted-phone-crossbody', 'quilted-long-wallet'])
const WATERMARK_BAND = 0.2

async function load(input, slug) {
  const image = sharp(input).rotate()
  if (!WATERMARKED.has(slug)) return image
  const { width, height } = await image.metadata()
  const top = Math.round(height * WATERMARK_BAND)
  return image.extract({ left: 0, top, width, height: height - top })
}

const exists = (file) =>
  fs.access(file).then(
    () => true,
    () => false,
  )

await fs.mkdir(OUT, { recursive: true })
let written = 0

for (const [slug, stamps] of Object.entries(PHOTOS)) {
  for (const [i, stamp] of stamps.entries()) {
    const input = path.join(SRC, `photo_2026-11-01_${stamp}.jpg`)
    for (const width of WIDTHS) {
      const output = path.join(OUT, `${slug}-${i + 1}-${width}.webp`)
      if (await exists(output)) continue
      const image = await load(input, slug)
      await image.resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(output)
      written++
    }
  }
}

console.log(`Images ready in public/images/products (${written} written).`)
