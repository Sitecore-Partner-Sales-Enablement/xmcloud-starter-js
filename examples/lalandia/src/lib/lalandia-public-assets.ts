import type { StaticImageData } from 'next/image';
import skyBg from 'assets/images/default_title_bg.jpg';
import footerBoyBg from 'assets/images/footer-bg_08.png';
import { resolvePublicAssetUrl } from 'lib/utils';

function staticSrc(image: StaticImageData | string): string {
  return typeof image === 'string' ? image : image.src;
}

/**
 * Bundled page wallpaper + footer boy.
 * Served from `/_next/static/media/…` so multisite proxy cannot rewrite them to
 * `/lalandia/…` (404), and they are not dependent on `public/` + localhost absolute URLs.
 */
export const LALANDIA_SKY_BG_PATH = staticSrc(skyBg);
export const LALANDIA_FOOTER_BOY_BG_PATH = staticSrc(footerBoyBg);

/** Absolute (or same-origin) URL for the tiled sky background. */
export function getLalandiaSkyBgUrl(host?: string | null): string {
  return resolvePublicAssetUrl(LALANDIA_SKY_BG_PATH, host);
}

/** Absolute (or same-origin) URL for the footer boy peek image. */
export function getLalandiaFooterBoyBgUrl(host?: string | null): string {
  return resolvePublicAssetUrl(LALANDIA_FOOTER_BOY_BG_PATH, host);
}
