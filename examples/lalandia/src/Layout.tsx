import React, { JSX } from "react";
import { Field, ImageField, Page } from "@sitecore-content-sdk/nextjs";
import Scripts from "src/Scripts";
import SitecoreStyles from "components/content-sdk/SitecoreStyles";
import { DesignLibraryApp } from "@sitecore-content-sdk/nextjs";
import { AppPlaceholder } from "@sitecore-content-sdk/nextjs";
import componentMap from ".sitecore/component-map";
import {
  generateWebSiteSchema,
  generateOrganizationSchema,
} from "src/lib/structured-data/schema";
import StructuredData from "src/components/structured-data/StructuredData";
import type { JsonLdValue } from "src/lib/structured-data/jsonld";
import { getBaseUrl } from "src/lib/utils";
import {
  LALANDIA_SKY_BG_PATH,
  getLalandiaSkyBgUrl,
} from "src/lib/lalandia-public-assets";
import { LalandiaPageSky } from "components/lalandia-brand/LalandiaPageSky";

interface LayoutProps {
  page: Page;
  baseUrl?: string;
}

export interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
  metadataTitle?: Field;
  metadataKeywords?: Field;
  pageTitle?: Field;
  metadataDescription?: Field;
  pageSummary?: Field;
  ogTitle?: Field;
  ogDescription?: Field;
  ogImage?: ImageField;
  thumbnailImage?: ImageField;
}

const Layout = ({ page, baseUrl: baseUrlProp }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  // Use request-derived baseUrl when provided so JSON-LD URLs match actual port/host
  const baseUrl = baseUrlProp ?? getBaseUrl();
  const websiteSchema = generateWebSiteSchema(
    "Lalandia",
    baseUrl,
    "Lalandia holiday centres with Aquadome water parks in Denmark — Søndervig, Billund and Rødby"
  );
  const organizationSchema = generateOrganizationSchema(
    "Lalandia",
    baseUrl,
    undefined,
    "Lalandia holiday centres with Aquadome water parks in Denmark — Søndervig, Billund and Rødby"
  );

  // Bundled `/_next/static/media/…` sky — never localhost, never multisite-rewritten
  const skyBgUrl = baseUrl
    ? `${baseUrl.replace(/\/$/, "")}${LALANDIA_SKY_BG_PATH}`
    : getLalandiaSkyBgUrl();

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <StructuredData id="website-schema" data={websiteSchema as JsonLdValue} />
      <StructuredData
        id="organization-schema"
        data={organizationSchema as JsonLdValue}
      />
      {mode.isDesignLibrary ? (
        route && (
          <DesignLibraryApp
            page={page}
            rendering={route}
            componentMap={componentMap}
            loadServerImportMap={() => import(".sitecore/import-map.server")}
          />
        )
      ) : (
        <div className="lalandia-page">
          {/* Client sky — absolute RH origin beats Pages <base href> */}
          <LalandiaPageSky src={skyBgUrl} />
          <div id="header" className="lalandia-page__slot">
            {route && (
              <AppPlaceholder
                page={page}
                componentMap={componentMap}
                name="headless-header"
                rendering={route}
              />
            )}
          </div>
          <div id="content" className="lalandia-page__slot">
            {route && (
              <AppPlaceholder
                page={page}
                componentMap={componentMap}
                name="headless-main"
                rendering={route}
              />
            )}
          </div>
          <div id="footer" className="lalandia-page__slot">
            {route && (
              <AppPlaceholder
                page={page}
                componentMap={componentMap}
                name="headless-footer"
                rendering={route}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
