// Convierte imágenes originales (JPG/PNG gigantes) a WebP livianos en dos tamaños.
// Uso: node scripts/optimize-images.mjs <carpeta-origen> [carpeta-destino]
// Ejemplo: node scripts/optimize-images.mjs ./originales ./public/images/projects
import { readdir, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const [, , srcDir, outDir = 'public/images/projects'] = process.argv
const WIDTHS = [640, 1280]

if (!srcDir) {
  console.error('Falta la carpeta de origen. Uso: node scripts/optimize-images.mjs <origen> [destino]')
  process.exit(1)
}

const slug = (name) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

await mkdir(outDir, { recursive: true })
const files = (await readdir(srcDir)).filter((f) => /\.(jpe?g|png)$/i.test(f))

for (const file of files) {
  const input = path.join(srcDir, file)
  const base = slug(path.parse(file).name)
  const before = (await stat(input)).size

  for (const width of WIDTHS) {
    const output = path.join(outDir, `${base}-${width}.webp`)
    const info = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(output)
    console.log(`${file} → ${path.basename(output)}  ${(before / 1024).toFixed(0)} KB → ${(info.size / 1024).toFixed(0)} KB`)
  }
}
