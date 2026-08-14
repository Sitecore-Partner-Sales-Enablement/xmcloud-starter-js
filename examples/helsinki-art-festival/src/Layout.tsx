import React, { JSX } from 'react';
import { Field, ImageField, Page } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'components/content-sdk/SitecoreStyles';
import { DesignLibraryApp } from '@sitecore-content-sdk/nextjs';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import componentMap from '.sitecore/component-map';
import {
  generateWebSiteSchema,
  generateOrganizationSchema,
} from 'src/lib/structured-data/schema';
import StructuredData from 'src/components/structured-data/StructuredData';
import type { JsonLdValue } from 'src/lib/structured-data/jsonld';
import { cn, getBaseUrl } from 'src/lib/utils';

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
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';
  const baseUrl = baseUrlProp ?? getBaseUrl();
  const websiteSchema = generateWebSiteSchema(
    'Helsinki Art Festival',
    baseUrl,
    'Helsinki Art Festival — Night of the Arts inspired experience'
  );
  const organizationSchema = generateOrganizationSchema(
    'Helsinki Art Festival',
    baseUrl,
    undefined,
    'Helsinki Art Festival — Night of the Arts inspired experience'
  );

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <StructuredData id="website-schema" data={websiteSchema as JsonLdValue} />
      <StructuredData id="organization-schema" data={organizationSchema as JsonLdValue} />
      <div className={cn(mainClassPageEditing, 'min-h-screen bg-bg-basic-color text-text-basic')}>
        {mode.isDesignLibrary ? (
          route && (
            <DesignLibraryApp
              page={page}
              rendering={route}
              componentMap={componentMap}
              loadServerImportMap={() => import('.sitecore/import-map.server')}
            />
          )
        ) : (
          <>
            <header className="sticky top-0 z-40 border-b border-border-gray bg-bg-basic-color">
              <div id="header" className="relative w-full">
                {route && (
                  <AppPlaceholder
                    page={page}
                    componentMap={componentMap}
                    name="headless-header"
                    rendering={route}
                  />
                )}
              </div>
            </header>
            <main className="bg-bg-basic-color">
              <div id="content" className="relative w-full">
                {route && (
                  <AppPlaceholder
                    page={page}
                    componentMap={componentMap}
                    name="headless-main"
                    rendering={route}
                  />
                )}
              </div>
            </main>
            <footer>
              <div id="footer" className="relative w-full">
                {route && (
                  <AppPlaceholder
                    page={page}
                    componentMap={componentMap}
                    name="headless-footer"
                    rendering={route}
                  />
                )}
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
