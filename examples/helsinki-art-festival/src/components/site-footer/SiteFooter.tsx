'use client';

import React, { JSX } from 'react';
import Link from 'next/link';
import { NextImage as ContentSdkImage, Text } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { cn, componentShell } from 'lib/utils';
import {
  ResolvedFooterLink,
  SiteFooterLinkItem,
  SiteFooterProps,
} from './site-footer.props';

const FALLBACK_PRIMARY = [
  { text: 'Info', href: '/info' },
  { text: 'Programme', href: '/programme' },
  { text: 'Tickets', href: '/tickets' },
  { text: 'Huvila', href: '/huvila' },
  { text: 'Responsibility', href: '/responsibility' },
  { text: 'Media', href: '/media' },
];

const FALLBACK_SECONDARY = [
  { text: 'Info', href: '/info' },
  { text: 'Contact information', href: '/contact' },
  { text: 'Industry Accreditation', href: '/accreditation' },
  { text: 'Art Gifts: Open Source', href: '/art-gifts' },
];

const FALLBACK_SOCIAL = [
  { text: 'Facebook', href: 'https://www.facebook.com/helsinkifestival/', network: 'facebook' },
  { text: 'Instagram', href: 'https://instagram.com/helsinkifestival', network: 'instagram' },
  { text: 'YouTube', href: 'https://www.youtube.com/', network: 'youtube' },
  { text: 'TikTok', href: 'https://www.tiktok.com/@helsinkifestival', network: 'tiktok' },
];

const HELSINKI_LOGO_SRC = '/logos/helsinki.svg';
const STF_LOGO_SRC = '/logos/sustainable-travel-finland.png';
const STF_LOGO_HREF =
  'https://www.visitfinland.fi/en/liiketoiminnan-kehittaminen/vastuullinen-matkailu/sustainable-travel-finland';

const resolveLinks = (items?: SiteFooterLinkItem[]): ResolvedFooterLink[] => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      const field = getFieldValue(item.link) ?? getFieldValue(item.field?.link);
      if (!field) return null;
      const text = field.value?.text || field.value?.title || field.value?.href || `Link ${index + 1}`;
      const href = field.value?.href || '#';
      return {
        id: item.id ?? `${href}-${index}`,
        field,
        text: String(text),
        href,
      };
    })
    .filter((item): item is ResolvedFooterLink => Boolean(item));
};

const detectNetwork = (text: string, href: string): string => {
  const haystack = `${text} ${href}`.toLowerCase();
  if (haystack.includes('facebook')) return 'facebook';
  if (haystack.includes('instagram')) return 'instagram';
  if (haystack.includes('youtube') || haystack.includes('youtu.be')) return 'youtube';
  if (haystack.includes('tiktok')) return 'tiktok';
  return 'generic';
};

const SocialIcon = ({ network }: { network: string }) => {
  const common = 'h-4 w-4 fill-black';
  switch (network) {
    case 'facebook':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v8h4v-8h3l1-4h-4V9c0-.6.4-1 1-1z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5zM17 7.75a.75.75 0 1 1-.75-.75.75.75 0 0 1 .75.75z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.4 5.4 12 5.4 12 5.4s-7.4 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.4.4 8.8.4 8.8.4s7.4 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.5v-6.6l6.2 3.3-6.2 3.3z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <path d="M14.5 3c.4 2.4 1.9 4 4.3 4.3V10c-1.5 0-2.9-.5-4-1.3v6.2A5.9 5.9 0 1 1 8.9 9.1v2.7a3.2 3.2 0 1 0 2.3 3.1V3h3.3z" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};

export const Default = ({ params, fields, page }: SiteFooterProps): JSX.Element => {
  const isEditing = Boolean(page?.mode?.isEditing);
  const { styles, RenderingIdentifier: id } = params ?? {};
  const datasource = getDatasource(fields);

  const partnerLogoField = getFieldValue(datasource?.partnerLogo);
  const partnerLogoLinkField = getFieldValue(datasource?.partnerLogoLink);
  const certificationLogoField = getFieldValue(datasource?.certificationLogo);
  const certificationLogoLinkField = getFieldValue(datasource?.certificationLogoLink);
  const cookieLabelField = getFieldValue(datasource?.cookieLabel);

  const primaryLinks = resolveLinks(datasource?.children?.results);
  const secondaryLinks = resolveLinks(datasource?.secondaryLinks?.results);
  const socialLinks = resolveLinks(datasource?.socialLinks?.results);

  const displayPrimary =
    primaryLinks.length > 0
      ? primaryLinks
      : FALLBACK_PRIMARY.map((item, index) => ({
          id: `primary-${index}`,
          field: { value: { href: item.href, text: item.text } },
          text: item.text,
          href: item.href,
        }));

  const displaySecondary =
    secondaryLinks.length > 0
      ? secondaryLinks
      : FALLBACK_SECONDARY.map((item, index) => ({
          id: `secondary-${index}`,
          field: { value: { href: item.href, text: item.text } },
          text: item.text,
          href: item.href,
        }));

  const displaySocial =
    socialLinks.length > 0
      ? socialLinks.map((item) => ({
          ...item,
          network: detectNetwork(item.text, item.href),
        }))
      : FALLBACK_SOCIAL.map((item, index) => ({
          id: `social-${index}`,
          field: { value: { href: item.href, text: item.text } },
          text: item.text,
          href: item.href,
          network: item.network,
        }));

  const cookieLabel =
    (cookieLabelField?.value ? String(cookieLabelField.value) : undefined) || 'Cookie settings';

  const primaryLinkClass =
    'font-body text-[25px] font-bold leading-[1.2] text-black no-underline transition-colors hover:text-white hover:no-underline';
  const secondaryLinkClass =
    'font-body text-[16px] font-normal leading-[40px] text-black no-underline transition-colors hover:text-white hover:no-underline';
  const socialLinkClass =
    'mb-2 flex items-center gap-3 text-black no-underline transition-colors hover:text-white hover:no-underline';

  const renderTextLink = (
    item: ResolvedFooterLink,
    className: string,
    useDatasource: boolean
  ) => {
    if (useDatasource || isEditing) {
      return (
        <CompatibleLink field={item.field} editable={isEditing} className={className} />
      );
    }
    return (
      <Link href={item.href} className={className}>
        {item.text}
      </Link>
    );
  };

  return (
    <div
      className={cn(
        componentShell,
        'site-footer w-full bg-bg-footer px-4 pt-[100px] pb-[60px] text-black md:px-8',
        styles
      )}
      id={id}
    >
      <div className="container mx-auto grid w-full max-w-[1250px] grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* Column 1 — logos */}
        <div className="footer-logos flex flex-col gap-6">
          <div className="footer-logo">
            {partnerLogoField?.value?.src ? (
              partnerLogoLinkField?.value?.href ? (
                <CompatibleLink field={partnerLogoLinkField} className="inline-flex no-underline">
                  <ContentSdkImage
                    field={partnerLogoField}
                    className="h-[46px] w-auto max-w-[100px] object-contain"
                  />
                </CompatibleLink>
              ) : (
                <ContentSdkImage
                  field={partnerLogoField}
                  className="h-[46px] w-auto max-w-[100px] object-contain"
                />
              )
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={HELSINKI_LOGO_SRC}
                alt="Helsinki"
                width={100}
                height={46}
                className="h-[46px] w-[100px] object-contain"
              />
            )}
          </div>

          <div className="footer-logo no-invert">
            {certificationLogoField?.value?.src ? (
              certificationLogoLinkField?.value?.href ? (
                <CompatibleLink
                  field={certificationLogoLinkField}
                  className="inline-flex no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ContentSdkImage
                    field={certificationLogoField}
                    className="h-auto w-[100px] object-contain"
                  />
                </CompatibleLink>
              ) : (
                <ContentSdkImage
                  field={certificationLogoField}
                  className="h-auto w-[100px] object-contain"
                />
              )
            ) : (
              <a
                href={STF_LOGO_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex no-underline"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={STF_LOGO_SRC}
                  alt="Sustainable Travel Finland"
                  width={160}
                  height={52}
                  className="h-[52px] w-auto max-w-[160px] object-contain"
                />
              </a>
            )}
          </div>
        </div>

        {/* Column 2 — primary nav */}
        <div>
          <ul className="primary-nav m-0 flex list-none flex-col gap-0 p-0">
            {displayPrimary.map((item) => (
              <li key={item.id} className="nav-item list-none">
                {renderTextLink(item, primaryLinkClass, primaryLinks.length > 0)}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — secondary nav + cookie settings */}
        <div>
          <ul className="secondary-nav m-0 flex list-none flex-col p-0">
            {displaySecondary.map((item) => (
              <li key={item.id} className="nav-item list-none">
                {renderTextLink(item, secondaryLinkClass, secondaryLinks.length > 0)}
              </li>
            ))}
            <li className="nav-item list-none">
              <button
                type="button"
                className="cookie-consent inline-block border-0 bg-transparent p-0 text-left font-body text-[16px] font-normal leading-[40px] text-black transition-colors hover:text-white"
                onClick={() => {
                  // Hook for cookie consent manager when available
                  const w = window as Window & { klaro?: { show?: () => void } };
                  w.klaro?.show?.();
                }}
              >
                {isEditing && cookieLabelField ? <Text field={cookieLabelField} /> : cookieLabel}
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4 — social */}
        <div className="icons flex flex-col gap-2">
          {displaySocial.map((item) => {
            const network = 'network' in item ? String(item.network) : detectNetwork(item.text, item.href);
            const content = (
              <>
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center bg-white">
                  <SocialIcon network={network} />
                </span>
                <span className="font-body text-[16px] font-normal">{item.text}</span>
              </>
            );

            if (socialLinks.length > 0 || isEditing) {
              return (
                <CompatibleLink
                  key={item.id}
                  field={item.field}
                  editable={isEditing}
                  className={socialLinkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </CompatibleLink>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={socialLinkClass}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {isEditing && !datasource && (
        <p className="is-empty-hint mx-auto mt-8 max-w-[1250px] font-body text-sm text-black/70">
          Site Footer: configure primary links, secondary links, and social links in the
          datasource.
        </p>
      )}
    </div>
  );
};
