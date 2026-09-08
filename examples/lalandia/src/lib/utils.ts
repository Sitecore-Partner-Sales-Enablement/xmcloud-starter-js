/**
 * Build the public site origin for absolute URLs.
 * Prefer an explicit host (from request headers). In production never fall back
 * to localhost — that breaks sky/footer assets on the XM Cloud rendering host.
 */
export function getBaseUrl(host?: string | null, protocol?: string | null): string {
  if (host) {
    const cleanHost = host.split(",")[0].trim();
    const resolvedProtocol =
      protocol ||
      (process.env.NODE_ENV === "development" ? "http" : "https");
    return `${resolvedProtocol}://${cleanHost}`;
  }
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  // Production without configured URL / host: caller should prefer root-relative paths
  return "";
}

export function getFullUrl(path: string, host?: string | null, protocol?: string | null): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getBaseUrl(host, protocol);
  if (!baseUrl) return cleanPath;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Root-relative public / bundled assets break in Sitecore Pages when a foreign
 * `<base href>` rewrites them to the CM/Pages origin. Prefer an absolute
 * rendering-host URL when we know the origin.
 *
 * On the client, use `window.location.origin`.
 * In production SSR without a host, return a root-relative path (same RH origin)
 * instead of baking `http://localhost:3000/...` into HTML.
 */
export function resolvePublicAssetUrl(path: string, host?: string | null): string {
  if (!path) return path;
  if (/^(?:https?:|data:|blob:)/i.test(path)) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (!host && typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${cleanPath}`;
  }
  if (host) {
    return getFullUrl(cleanPath, host);
  }
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;
  if (configured) {
    return `${configured.replace(/\/$/, "")}${cleanPath}`;
  }
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:3000${cleanPath}`;
  }
  // Deployed RH: root-relative hits this app (and `/_next/static` bypasses proxy)
  return cleanPath;
}
