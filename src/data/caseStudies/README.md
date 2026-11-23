# Casos de estudio

## Sumar una imagen a MR Obras

1. Exportá tus originales en JPG o PNG a una carpeta, con el nombre que figura en `src` dentro de `mrObras.ts`.
2. Optimizalos hacia la categoría que corresponda:

   ```powershell
   node scripts/optimize-images.mjs ./originales/branding public/images/projects/mr-obras/branding
   ```

3. Revisá en `mrObras.ts` que `ratio` coincida con la proporción real de la pieza y completá `alt`, `title` y, si querés, `description` en español e inglés.
4. Reiniciá `npm run dev`. La lista de archivos disponibles se genera al iniciar.

Cada entrada define ruta (`src`), texto alternativo (`alt`), título (`title`), descripción opcional (`description`), categoría y orden. El orden sale de la posición dentro de su lista.

| Categoría | Carpeta |
| --- | --- |
| Portada | `public/images/projects/mr-obras/cover-*.webp` |
| Identidad | `branding/` |
| UX/UI | `ux-ui/` |
| Frontend | `frontend/` |
| Redes y marketing | `marketing/` |
| Resultado | `results/` |

Las piezas sin archivo aparecen como espacios punteados solo en desarrollo. En producción no se muestran, y las secciones Identidad y Marketing aparecen cuando tienen al menos una pieza real.

Para el video del tour, guardá un MP4 liviano en `public/images/projects/mr-obras/frontend/tour-360-demo.mp4`. La captura actual queda como póster.

## Crear otro caso de estudio

Creá un archivo como `mrObras.ts`, elegí los bloques y su orden, y registralo en `index.ts`. Los proyectos sin registro siguen usando el modal simple.
