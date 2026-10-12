import type { ImageMetadata } from 'astro';

/**
 * Site photography, loaded from src/assets/photos/ and keyed by file name (without extension).
 * Content files reference a photo by key, e.g. `image: replacement-crew`.
 * Add a photo: drop a .jpg in src/assets/photos/ — it is optimized at build time.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true });

export const photos: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path.split('/').pop()!.replace(/\.(jpe?g|png|webp)$/i, ''), mod.default]),
);

export function photo(name?: string | null): ImageMetadata | undefined {
  if (!name) return undefined;
  const p = photos[name];
  if (!p && import.meta.env.DEV) console.warn(`[photos] no photo named "${name}" in src/assets/photos/`);
  return p;
}
