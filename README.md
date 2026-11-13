# PixelForge Studio

Mobile-first design editor built with Next.js. The current implementation is a browser-based Phase 1 editor foundation.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Current functionality

- Add and manipulate text, shapes, and images on a scalable SVG canvas.
- Edit text, font, fill, opacity, rotation, position, and layer ordering.
- Hide and lock layers; resize by dragging the canvas handle.
- Undo and redo editor changes.
- Autosave the current project in browser local storage and save/open multiple local projects.
- Export PNG, JPG, SVG, and editable `.pftheme` JSON files; import `.pftheme` files.
- Responsive dark dashboard and editor layouts; PWA manifest metadata.

## Limitations

This version stores projects in the current browser and device only. Cloud sync, Supabase authentication/storage, shared marketplace resources, server-side moderation, and production-grade font uploads are not configured. Image assets are embedded in local project data, with a 5 MB per-image limit. Theme import validates format and basic layer structure but does not unpack external asset archives.

## Deploy to Vercel

Import `adnanahmedjobayer0/pixelforge-studio` in Vercel and select the `copilot/pixelforge-core-editor` branch for a preview deployment, or merge the branch into the production branch to deploy production. The project uses Next.js defaults and does not require environment variables for the local editor features.
