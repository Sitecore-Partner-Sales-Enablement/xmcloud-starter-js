'use client';

import React, { useEffect, useState } from 'react';
import {
  LALANDIA_SKY_BG_PATH,
  getLalandiaSkyBgUrl,
} from 'lib/lalandia-public-assets';

type LalandiaPageSkyProps = {
  /** Optional SSR absolute URL (used until client origin is known). */
  src?: string;
};

/**
 * Tiled sky wallpaper. Resolves the asset against `window.location.origin` on
 * the client so Sitecore Pages `<base href>` cannot point `/_next/static/…`
 * at pages.sitecorecloud.io (preview works; editor iframe would 404).
 */
export function LalandiaPageSky({ src }: LalandiaPageSkyProps) {
  const [bgUrl, setBgUrl] = useState(src || getLalandiaSkyBgUrl());

  useEffect(() => {
    setBgUrl(`${window.location.origin}${LALANDIA_SKY_BG_PATH}`);
  }, []);

  return (
    <div
      className="lalandia-page__sky"
      aria-hidden="true"
      style={{ backgroundImage: `url(${bgUrl})` }}
    />
  );
}
