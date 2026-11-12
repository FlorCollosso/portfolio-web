// Antepone la ruta base del sitio a los archivos de /public.
// En GitHub Pages un repo común se sirve en /<nombre-del-repo>/, no en la raíz.
export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
