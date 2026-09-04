export function getBaseUrl(host?: string | null): string {
  if (host) {
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    return `${protocol}://${host}`;
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000"
  );
}

export function getFullUrl(path: string, host?: string | null): string {
  const baseUrl = getBaseUrl(host);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Root-relative public assets (`/logo.svg`, `/fonts/...`) break in Sitecore Pages /
 * editing preview when a foreign `<base href>` rewrites them to the CM/Pages origin.
 * Always emit an absolute rendering-host URL for local public paths.
 *
 * On the client, prefer `window.location.origin` so 127.0.0.1 vs localhost (and
 * Pages proxy hosts) match the document that is actually loading the assets.
 */
export function resolvePublicAssetUrl(path: string, host?: string | null): string {
  if (!path) return path;
  if (/^(?:https?:|data:|blob:)/i.test(path)) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (!host && typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${cleanPath}`;
  }
  return getFullUrl(cleanPath, host);
}
