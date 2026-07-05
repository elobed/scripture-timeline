# Línea del Tiempo Bíblica

Una aplicación web de línea del tiempo histórica interactiva sobre la historia de la Biblia, traducciones bíblicas, doctrina cristiana e historia eclesiástica.

## Tecnología

- **Angular** (última versión estable) con standalone components
- **CSS Custom Properties** para theming claro/oscuro
- **GSAP** para animaciones avanzadas
- **QRCode.js** para generación de QR al imprimir
- **HashLocationStrategy** para compatibilidad con GitHub Pages

## Instalación

```bash
git clone https://github.com/TU_USUARIO/scripture-timeline
cd scripture-timeline
npm install
```

## Desarrollo local

```bash
npm start
# o
npx ng serve
```

Abre http://localhost:4200 — la app redirige automáticamente a `/#/timeline`.

## Build de producción

```bash
npm run build
# Salida en: dist/scripture-timeline/browser/
```

## Deploy a GitHub Pages

### Automático (GitHub Actions)

El workflow `.github/workflows/deploy.yml` se ejecuta automáticamente en cada push a `main`. Para habilitarlo:

1. En tu repositorio en GitHub, ve a **Settings → Pages**.
2. En **Build and deployment**, selecciona la rama `gh-pages` como fuente.
3. El workflow construirá y desplegará la app automáticamente.

### Configurar dominio personalizado

1. Abre `.github/workflows/deploy.yml`.
2. Reemplaza `YOUR_CUSTOM_DOMAIN` con tu dominio (ej: `timeline.midominio.com`):
   ```yaml
   cname: timeline.midominio.com
   ```
3. En tu proveedor de DNS, agrega un registro CNAME que apunte `timeline.midominio.com` → `TU_USUARIO.github.io`.
4. En GitHub → **Settings → Pages**, verifica la configuración del dominio personalizado.

> Si **no tienes dominio personalizado**, elimina la línea `cname:` del workflow.

## Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── header/          # Header con auto-ocultar en scroll
│   │   ├── footer/          # Footer (contenido pendiente)
│   │   ├── timeline/        # Componente principal de la línea del tiempo
│   │   ├── event-card/      # Tarjeta individual de evento
│   │   ├── event-modal/     # Modal de detalle con HTML embebido
│   │   └── filter-panel/    # Panel de filtros + botón imprimir
│   ├── data/
│   │   └── timeline-events.data.ts  # 📌 Todos los datos están aquí
│   ├── models/
│   │   └── timeline.models.ts       # Interfaces TypeScript
│   ├── pages/
│   │   └── timeline-page/   # Página enrutada /timeline
│   ├── services/
│   │   ├── filter.service.ts   # Lógica de filtros + URL sync
│   │   └── theme.service.ts    # Toggle claro/oscuro
│   └── utils/
│       └── parse-year.util.ts  # parseYearString() utilitaria
├── styles/
│   └── variables.css   # 🎨 Todos los tokens de color aquí
└── styles.css           # Estilos globales
```

## Agregar eventos

Edita `src/app/data/timeline-events.data.ts` y agrega un objeto al array `rawEvents`:

```typescript
{
  year: '1850',
  title: 'Mi nuevo evento',
  tags: ['biblia'],       // IDs: biblia | doctrina | historia | roma
  era: 'Nombre de la era',
  shortDesc: 'Descripción corta...',
  fullDesc: `HTML completo del detalle...`,
  image: 'https://url-de-imagen.jpg',
}
```

Los eventos se ordenan automáticamente por año.

## Funcionalidades

- 🌓 **Modo claro/oscuro** con toggle en el header
- 🔍 **Filtros por categoría** con modos OR y AND
- ⭐ **Resaltado** de categorías (clic derecho en filtro)
- 🔗 **Estado en URL** — comparte filtros y resaltados vía URL
- 🖨️ **Impresión** con código QR de la URL actual
- ↔️ **Scroll horizontal** drag-to-scroll + rueda normalizada
- 📱 **Responsive** — vertical en móvil, horizontal en desktop

## Licencia

Open source. Todas las dependencias son gratuitas y de código abierto.
