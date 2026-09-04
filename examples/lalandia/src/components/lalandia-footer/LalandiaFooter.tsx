'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Image, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { resolvePublicAssetUrl } from 'lib/utils';
import { isBundledLalandiaLogo, LalandiaLogo } from 'components/lalandia-brand/LalandiaLogo';
import {
  DEFAULT_FOOTER,
  type FooterLinkGroup,
  type FooterModel,
  type FooterSocialLink,
} from './LalandiaFooter.defaults';
import type { FooterProps, ResolvedFooterFields } from './LalandiaFooter.props';

function parseJsonField<T>(raw: string | undefined, fallback: T): T {
  if (!raw?.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function resolveFooterModel(fields?: FooterProps['fields']): ResolvedFooterFields {
  const datasource = getDatasource(fields);
  const backgroundImageField = getFieldValue(datasource?.backgroundImage);
  const palmImageField = getFieldValue(datasource?.palmImage);
  const mapImageField = getFieldValue(datasource?.mapImage);
  const newsletterTitleField = getFieldValue(datasource?.newsletterTitle);
  const bookHeadlineField = getFieldValue(datasource?.bookHeadline);
  const bookTextField = getFieldValue(datasource?.bookText);
  const bookCtaField = getFieldValue(datasource?.bookCta);
  const privacyLinkField = getFieldValue(datasource?.privacyLink);
  const cookiesLinkField = getFieldValue(datasource?.cookiesLink);
  const linkGroupsJson = getFieldValue(datasource?.linkGroupsJson)?.value?.toString();
  const resortsJson = getFieldValue(datasource?.resortsJson)?.value?.toString();
  const socialLinksJson = getFieldValue(datasource?.socialLinksJson)?.value?.toString();

  const model: FooterModel = {
    ...DEFAULT_FOOTER,
    backgroundImageSrc: backgroundImageField?.value?.src || DEFAULT_FOOTER.backgroundImageSrc,
    palmImageSrc: palmImageField?.value?.src || DEFAULT_FOOTER.palmImageSrc,
    mapImageSrc: mapImageField?.value?.src || DEFAULT_FOOTER.mapImageSrc,
    newsletterTitle: newsletterTitleField?.value?.toString() || DEFAULT_FOOTER.newsletterTitle,
    bookHeadline: bookHeadlineField?.value?.toString() || DEFAULT_FOOTER.bookHeadline,
    bookText: bookTextField?.value?.toString() || DEFAULT_FOOTER.bookText,
    bookCtaLabel: bookCtaField?.value?.text || DEFAULT_FOOTER.bookCtaLabel,
    bookCtaHref: bookCtaField?.value?.href || DEFAULT_FOOTER.bookCtaHref,
    privacyLabel: privacyLinkField?.value?.text || DEFAULT_FOOTER.privacyLabel,
    privacyHref: privacyLinkField?.value?.href || DEFAULT_FOOTER.privacyHref,
    cookiesLabel: cookiesLinkField?.value?.text || DEFAULT_FOOTER.cookiesLabel,
    cookiesHref: cookiesLinkField?.value?.href || DEFAULT_FOOTER.cookiesHref,
    linkGroups: parseJsonField(linkGroupsJson, DEFAULT_FOOTER.linkGroups),
    resorts: parseJsonField(resortsJson, DEFAULT_FOOTER.resorts),
    socialLinks: parseJsonField(socialLinksJson, DEFAULT_FOOTER.socialLinks),
  };

  return {
    model,
    backgroundImageField,
    palmImageField,
    mapImageField,
    newsletterTitleField,
    bookHeadlineField,
    bookTextField,
    bookCtaField,
  };
}

const SOCIAL_ICON: Record<FooterSocialLink['icon'], string> = {
  facebook: 'lalandia-footer__social-icon--facebook',
  instagram: 'lalandia-footer__social-icon--instagram',
  youtube: 'lalandia-footer__social-icon--youtube',
  newsletter: 'lalandia-footer__social-icon--newsletter',
};

type FooterViewProps = {
  model: FooterModel;
  backgroundImageField?: ResolvedFooterFields['backgroundImageField'];
  palmImageField?: ResolvedFooterFields['palmImageField'];
  mapImageField?: ResolvedFooterFields['mapImageField'];
  newsletterTitleField?: ResolvedFooterFields['newsletterTitleField'];
  bookHeadlineField?: ResolvedFooterFields['bookHeadlineField'];
  bookTextField?: ResolvedFooterFields['bookTextField'];
  bookCtaField?: ResolvedFooterFields['bookCtaField'];
  isEditing?: boolean;
};

function LinkGroup({ group, forceOpen }: { group: FooterLinkGroup; forceOpen: boolean }) {
  return (
    <details className="lalandia-footer__group" {...(forceOpen ? { open: true } : {})}>
      <summary className="lalandia-footer__group-title">{group.title}</summary>
      <ul className="lalandia-footer__group-list">
        {group.links.map((link) => (
          <li key={link.id}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export const FooterView: React.FC<FooterViewProps> = ({
  model,
  backgroundImageField,
  palmImageField,
  mapImageField,
  newsletterTitleField,
  bookHeadlineField,
  bookTextField,
  bookCtaField,
  isEditing = false,
}) => {
  const [subscribed, setSubscribed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 690px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  const backgroundSrc = resolvePublicAssetUrl(
    (isEditing && backgroundImageField?.value?.src) || model.backgroundImageSrc
  );

  const renderBookCta = () => {
    if (isEditing && bookCtaField) {
      return (
        <CompatibleLink field={bookCtaField} editable className="lalandia-footer__book-cta">
          {model.bookCtaLabel}
        </CompatibleLink>
      );
    }
    return (
      <Link href={model.bookCtaHref} className="lalandia-footer__book-cta">
        {model.bookCtaLabel}
      </Link>
    );
  };

  // Groups Søndervig + Billund share one column on the live site
  const findGroup = model.linkGroups.find((g) => g.id === 'find-quickly');
  const aboutGroup = model.linkGroups.find((g) => g.id === 'about');
  const sondervigGroup = model.linkGroups.find((g) => g.id === 'groups-sondervig');
  const billundGroup = model.linkGroups.find((g) => g.id === 'groups-billund');
  const rodbyGroup = model.linkGroups.find((g) => g.id === 'groups-rodby');

  return (
    <footer className="lalandia-footer">
      {/* Live uses footer.img-bg + .temp-bg for the boy peek above the dark veil */}
      <div
        className="lalandia-footer__bg"
        aria-hidden="true"
        style={{ backgroundImage: `url(${backgroundSrc})` }}
      />
      {/* Full-bleed translucent veil (matches live .footer-inner) */}
      <div className="lalandia-footer__inner">
        <div className="lalandia-footer__content">
          <div className="lalandia-footer__top">
            <div className="lalandia-footer__newsletter">
              <h3 className="lalandia-footer__newsletter-title">
                {newsletterTitleField && isEditing ? (
                  <Text field={newsletterTitleField} />
                ) : (
                  model.newsletterTitle
                )}
              </h3>
              <div className="lalandia-footer__newsletter-body">
                {subscribed ? (
                  <p className="lalandia-footer__newsletter-thanks">
                    Thank you for subscribing.
                    <br />
                    You can always unsubscribe from within the e-mails you receive from us.
                  </p>
                ) : (
                  <form
                    className="lalandia-footer__newsletter-form"
                    onSubmit={handleNewsletterSubmit}
                  >
                    <div className="lalandia-footer__newsletter-field">
                      <input
                        type="text"
                        name="firstname"
                        placeholder={model.newsletterForenamePlaceholder}
                        required
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="lalandia-footer__newsletter-field">
                      <input
                        type="text"
                        name="lastname"
                        placeholder={model.newsletterSurnamePlaceholder}
                        required
                        autoComplete="family-name"
                      />
                    </div>
                    <div className="lalandia-footer__newsletter-field">
                      <input
                        type="email"
                        name="email"
                        placeholder={model.newsletterEmailPlaceholder}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="lalandia-footer__newsletter-field lalandia-footer__newsletter-field--btn">
                      <button type="submit" className="lalandia-footer__newsletter-submit">
                        {model.newsletterSubmitLabel}
                      </button>
                    </div>
                  </form>
                )}
                <p className="lalandia-footer__newsletter-privacy">
                  {model.newsletterPrivacyPrefix}{' '}
                  <Link href={model.newsletterPrivacyHref}>{model.newsletterPrivacyLinkLabel}</Link>
                </p>
              </div>
            </div>

            {findGroup && (
              <div className="lalandia-footer__col">
                <LinkGroup group={findGroup} forceOpen={isDesktop} />
              </div>
            )}
            {aboutGroup && (
              <div className="lalandia-footer__col">
                <LinkGroup group={aboutGroup} forceOpen={isDesktop} />
              </div>
            )}
            <div className="lalandia-footer__col">
              {sondervigGroup && <LinkGroup group={sondervigGroup} forceOpen={isDesktop} />}
              {billundGroup && <LinkGroup group={billundGroup} forceOpen={isDesktop} />}
            </div>
            {rodbyGroup && (
              <div className="lalandia-footer__col">
                <LinkGroup group={rodbyGroup} forceOpen={isDesktop} />
              </div>
            )}

            <div className="lalandia-footer__palm">
              {palmImageField?.value?.src && isEditing ? (
                <Image field={palmImageField} editable className="lalandia-footer__palm-img" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolvePublicAssetUrl(model.palmImageSrc)}
                  alt=""
                  className="lalandia-footer__palm-img"
                />
              )}
            </div>
          </div>

          <div className="lalandia-footer__sub">
            <div className="lalandia-footer__sub-inner">
              <div className="lalandia-footer__map">
                {mapImageField?.value?.src && isEditing ? (
                  <Image field={mapImageField} editable className="lalandia-footer__map-img" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolvePublicAssetUrl(model.mapImageSrc)}
                    alt="Lalandia centres map"
                    className="lalandia-footer__map-img"
                  />
                )}
                <div className="lalandia-footer__map-links">
                  <Link href="/en/sondervig">Søndervig</Link>
                  <Link href="/en/billund">Billund</Link>
                  <Link href="/en/rodby">Rødby</Link>
                </div>
              </div>

              {model.resorts.map((resort) => (
                <div key={resort.id} className="lalandia-footer__resort">
                  <div className="lalandia-footer__resort-name">{resort.name}</div>
                  <ul className="lalandia-footer__resort-info">
                    {resort.addressLines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                    {resort.cvr && <li>CVR no.: {resort.cvr}</li>}
                    {resort.ean && <li>EAN no.: {resort.ean}</li>}
                    <li className="lalandia-footer__resort-phone-label">Telephone</li>
                    <li className="lalandia-footer__resort-phone">
                      <a href={`tel:${resort.phoneTel}`}>
                        <span className="lalandia-footer__phone-prefix">+45</span> 5461 0500
                      </a>
                    </li>
                    <li className="lalandia-footer__resort-phone-mobile">
                      <a href={`tel:${resort.phoneTel}`}>
                        Call the Service Centre
                        <br />
                        <span>{resort.phoneDisplay}</span>
                      </a>
                    </li>
                    <li>
                      <Link href={resort.contactHref}>{resort.contactLabel}</Link>
                    </li>
                  </ul>
                </div>
              ))}
            </div>

            <div className="lalandia-footer__book">
              <h3 className="lalandia-footer__book-headline">
                {bookHeadlineField && isEditing ? (
                  <Text field={bookHeadlineField} />
                ) : (
                  model.bookHeadline
                )}
              </h3>
              <div className="lalandia-footer__book-text">
                {bookTextField && isEditing ? <Text field={bookTextField} /> : model.bookText}
              </div>
              <h3 className="lalandia-footer__book-phone">
                <a href={`tel:${model.bookPhoneTel}`}>
                  <span>+45</span> 5461 0500
                </a>
              </h3>
              {renderBookCta()}
            </div>
          </div>

          <div className="lalandia-footer__social-row">
            <div className="lalandia-footer__social">
              {model.socialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`lalandia-footer__social-icon ${SOCIAL_ICON[item.icon]}`}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={item.label}
                >
                  <span className={`lalandia-footer__icon lalandia-footer__icon--${item.icon}`} />
                </a>
              ))}
            </div>
            <div className="lalandia-footer__legal">
              <p>
                {model.legalCompany} <sup>®</sup>{' '}
                <Link href={model.privacyHref}>{model.privacyLabel}</Link>{' '}
                <Link href={model.cookiesHref}>{model.cookiesLabel}</Link>
              </p>
            </div>
            <div className="lalandia-footer__brand">
              <Link href={model.logoHref} className="lalandia-footer__brand-link" aria-label={model.logoAlt}>
                {isBundledLalandiaLogo(model.logoSrc) ? (
                  <LalandiaLogo className="lalandia-footer__brand-logo" title={model.logoAlt} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolvePublicAssetUrl(model.logoSrc)}
                    alt={model.logoAlt}
                    className="lalandia-footer__brand-logo"
                    width={183}
                    height={86}
                  />
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/**
 * Sitecore Content SDK component export.
 * Hardcoded defaults apply until footer fields are authored in Sitecore AI.
 */
export const Default: React.FC<Partial<FooterProps>> = (props) => {
  const { page } = useSitecore();
  const isEditing = page?.mode?.isEditing ?? false;
  const resolved = resolveFooterModel(props.fields);

  return (
    <FooterView
      model={resolved.model}
      backgroundImageField={resolved.backgroundImageField}
      palmImageField={resolved.palmImageField}
      mapImageField={resolved.mapImageField}
      newsletterTitleField={resolved.newsletterTitleField}
      bookHeadlineField={resolved.bookHeadlineField}
      bookTextField={resolved.bookTextField}
      bookCtaField={resolved.bookCtaField}
      isEditing={isEditing}
    />
  );
};
