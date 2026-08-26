# Playground Sticker Artwork Spec V1

## Asset location

Place production sticker artwork in `public/images/playground/stickers/` and reference it from a sticker definition with a root-relative `artworkSrc`, for example:

```ts
artworkSrc: "/images/playground/stickers/emir-inside.png",
```

## Artwork contract

- Author artwork flat and front-facing. The browser applies cylindrical curvature, local rotation, lift, and placement.
- Do not bake can curvature, perspective, lighting, or studio reflections into the artwork.
- Preserve the intended aspect ratio with the definition's explicit `width` and `height` values.
- Use transparent backgrounds where the visible silhouette is non-rectangular. The renderer respects texture alpha; the rectangular curved patch remains the intentional V1 pointer hit area.
- Keep normal artwork to roughly 512 px on its longest side. Use up to 1024 px only for a sticker with genuinely necessary fine detail. Do not supply 2K or 4K textures for these small surfaces.

## Recommended formats

Use PNG or WebP for raster artwork, including transparent artwork. These are the production-safe formats for the current browser and Three.js loader path. SVG is not part of this runtime contract unless it is separately validated without adding an SVG parsing dependency.

## Runtime behavior

Artwork textures use sRGB colour space, mipmapped minification, linear magnification, and capped anisotropy. Alpha cutouts use a restrained `0.08` alpha test while keeping depth testing and depth writing enabled, so rear-side occlusion and sticker overlap remain physical. Artwork should therefore be predominantly opaque, with transparency used for cutout regions rather than whole-sticker opacity.

When `artworkSrc` is omitted, the renderer uses the definition's `fallbackColor`. No production artwork is included in this repository yet.
