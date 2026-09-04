'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Image, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { resolvePublicAssetUrl } from 'lib/utils';
import { isBundledLalandiaLogo, LalandiaLogo } from 'components/lalandia-brand/LalandiaLogo';
import { DEFAULT_HEADER, type HeaderModel, type HeaderNavLink } from './LalandiaHeader.defaults';
import type { HeaderProps, ResolvedHeaderFields } from './LalandiaHeader.props';

function parseJsonField<T>(raw: string | undefined, fallback: T): T {
  if (!raw?.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function resolveHeaderModel(fields?: HeaderProps['fields']): ResolvedHeaderFields {
  const datasource = getDatasource(fields);
  const logoField = getFieldValue(datasource?.logo);
  const logoLinkField = getFieldValue(datasource?.logoLink);
  const menuLabelField = getFieldValue(datasource?.menuLabel);
  const bookCtaField = getFieldValue(datasource?.bookCta);
  const languageCodeField = getFieldValue(datasource?.currentLanguageCode);
  const navigationJson = getFieldValue(datasource?.navigationJson)?.value?.toString();
  const languagesJson = getFieldValue(datasource?.languagesJson)?.value?.toString();

  const model: HeaderModel = {
    ...DEFAULT_HEADER,
    logoSrc: logoField?.value?.src || DEFAULT_HEADER.logoSrc,
    logoAlt: logoField?.value?.alt?.toString() || DEFAULT_HEADER.logoAlt,
    logoHref: logoLinkField?.value?.href || DEFAULT_HEADER.logoHref,
    menuLabel: menuLabelField?.value?.toString() || DEFAULT_HEADER.menuLabel,
    bookLabel: bookCtaField?.value?.text || DEFAULT_HEADER.bookLabel,
    bookHref: bookCtaField?.value?.href || DEFAULT_HEADER.bookHref,
    currentLanguageCode:
      languageCodeField?.value?.toString() || DEFAULT_HEADER.currentLanguageCode,
    items: parseJsonField(navigationJson, DEFAULT_HEADER.items),
    languages: parseJsonField(languagesJson, DEFAULT_HEADER.languages),
  };

  return { model, logoField, logoLinkField, menuLabelField, bookCtaField };
}

const Chevron: React.FC<{ open?: boolean }> = ({ open }) => (
  <svg
    className={`lalandia-header__chevron${open ? ' is-open' : ''}`}
    viewBox="0 0 12 8"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M1 1.5 L6 6.5 L11 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

/** Matches lalandia.dk `.icon-arrow-down` (glyph E003). */
const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={className ? `lalandia-header__icon-arrow ${className}` : 'lalandia-header__icon-arrow'} aria-hidden="true" />
);

/** Matches lalandia.dk `.icon-culture` (Lalandia icon font, glyph E016). */
const GlobeIcon: React.FC = () => (
  <span className="lalandia-header__globe" aria-hidden="true" />
);

type HeaderViewProps = {
  model: HeaderModel;
  logoField?: ResolvedHeaderFields['logoField'];
  logoLinkField?: ResolvedHeaderFields['logoLinkField'];
  menuLabelField?: ResolvedHeaderFields['menuLabelField'];
  bookCtaField?: ResolvedHeaderFields['bookCtaField'];
  isEditing?: boolean;
};

export const HeaderView: React.FC<HeaderViewProps> = ({
  model,
  logoField,
  logoLinkField,
  menuLabelField,
  bookCtaField,
  isEditing = false,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [nestedId, setNestedId] = useState<string | null>(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navId = useId();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('lalandia-header-mobile-open', isMobileOpen);
    return () => document.body.classList.remove('lalandia-header-mobile-open');
  }, [isMobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia('(min-width: 1150px)').matches) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setActiveId(null);
      setNestedId(null);
    }, 160);
  };

  const openItem = (id: string) => {
    clearCloseTimer();
    setActiveId(id);
    setNestedId(null);
    setIsLanguageOpen(false);
  };

  const activeItem = model.items.find((item) => item.id === activeId) ?? null;
  const isCompactLogo = Boolean(activeId) || isScrolled;

  const renderLogo = () => {
    const image =
      logoField?.value?.src && !isBundledLalandiaLogo(logoField.value.src) ? (
        <Image field={logoField} className="lalandia-header__logo-img" editable={isEditing} />
      ) : isBundledLalandiaLogo(model.logoSrc) ? (
        <LalandiaLogo className="lalandia-header__logo-img" title={model.logoAlt} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvePublicAssetUrl(model.logoSrc)}
          alt={model.logoAlt}
          className="lalandia-header__logo-img"
        />
      );

    if (isEditing && logoLinkField) {
      return (
        <CompatibleLink field={logoLinkField} editable className="lalandia-header__logo-link">
          {image}
        </CompatibleLink>
      );
    }

    return (
      <Link href={model.logoHref} className="lalandia-header__logo-link" aria-label={model.logoAlt}>
        {image}
      </Link>
    );
  };

  const renderBookCta = (className: string) => {
    if (isEditing && bookCtaField) {
      return (
        <CompatibleLink field={bookCtaField} editable className={className}>
          {model.bookLabel}
        </CompatibleLink>
      );
    }

    return (
      <Link href={model.bookHref} className={className}>
        {model.bookLabel}
      </Link>
    );
  };

  const renderSubLink = (link: HeaderNavLink) => {
    const hasChildren = Boolean(link.children?.length);
    if (!hasChildren) {
      return (
        <li key={link.id} className="lalandia-header__sub-item">
          <Link href={link.href}>{link.label}</Link>
        </li>
      );
    }

    const isNestedOpen = nestedId === link.id;
    return (
      <li
        key={link.id}
        className={`lalandia-header__sub-item has-children${isNestedOpen ? ' is-open' : ''}`}
        onMouseEnter={() => setNestedId(link.id)}
      >
        <button
          type="button"
          className="lalandia-header__sub-trigger"
          aria-expanded={isNestedOpen}
          onClick={() => setNestedId(isNestedOpen ? null : link.id)}
        >
          {link.label}
          <Chevron open={isNestedOpen} />
        </button>
        {isNestedOpen && link.children && (
          <ul className="lalandia-header__nested-list">
            {link.children.map((child) => (
              <li key={child.id}>
                <Link href={child.href}>{child.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div
      className={`lalandia-header${isScrolled ? ' is-scrolled' : ''}${activeId ? ' has-subnav' : ''}${isMobileOpen ? ' is-mobile-open' : ''}`}
    >
      <nav className="lalandia-header__nav" aria-label="Primary">
        <div className="lalandia-header__wrapper">
          <div className={`lalandia-header__logo${isCompactLogo ? ' is-compact' : ''}`}>
            {renderLogo()}
          </div>

          <div className="lalandia-header__menu">
            <span className="lalandia-header__menu-label">
              {menuLabelField && isEditing ? <Text field={menuLabelField} /> : model.menuLabel}
            </span>

            <ul className="lalandia-header__list" id={navId}>
              {model.items.map((item, index) => {
                const isActive = activeId === item.id;
                const showDividerAfter = index === 2;
                return (
                  <li
                    key={item.id}
                    className={`lalandia-header__item${isActive ? ' is-active' : ''}${showDividerAfter ? ' has-divider' : ''}`}
                    onMouseEnter={() => openItem(item.id)}
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      href={item.href === '#' ? item.children?.[0]?.href || '#' : item.href}
                      data-text={item.label}
                      className="lalandia-header__link"
                      aria-expanded={item.children?.length ? isActive : undefined}
                      onFocus={() => openItem(item.id)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Compact / tablet-mobile: Book hangs under the bar (matches lalandia.dk nav.small) */}
          <div className="lalandia-header__compact-book">
            {renderBookCta('lalandia-header__book')}
          </div>

          <div className="lalandia-header__tools">
            <div
              className={`lalandia-header__language${isLanguageOpen ? ' is-open' : ''}`}
              onMouseEnter={() => {
                clearCloseTimer();
                setIsLanguageOpen(true);
                setActiveId(null);
              }}
              onMouseLeave={() => setIsLanguageOpen(false)}
            >
              <button
                type="button"
                className="lalandia-header__language-button"
                aria-expanded={isLanguageOpen}
                aria-haspopup="listbox"
                onClick={() => setIsLanguageOpen((open) => !open)}
              >
                <GlobeIcon />
                <span className="lalandia-header__language-code">{model.currentLanguageCode}</span>
                <Chevron open={isLanguageOpen} />
              </button>
              {isLanguageOpen && (
                <ul className="lalandia-header__language-list" role="listbox">
                  {model.languages.map((language) => (
                    <li key={language.id}>
                      <Link href={language.href}>{language.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              className="lalandia-header__burger"
              aria-expanded={isMobileOpen}
              aria-controls={`${navId}-mobile`}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileOpen((open) => !open)}
            >
              <span className="lalandia-header__burger-line" />
              <span className="lalandia-header__burger-line" />
              <span className="lalandia-header__burger-line" />
            </button>
          </div>
        </div>

        <div
          className={`lalandia-header__subnav${activeItem ? ' is-open' : ''}`}
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
        >
          {activeItem?.children && (
            <div className="lalandia-header__subnav-inner">
              <ul className="lalandia-header__sub-list">
                {activeItem.children.map((child) => renderSubLink(child))}
              </ul>
              {renderBookCta('lalandia-header__book')}
            </div>
          )}
        </div>

        {/* Compact drawer (<1150px) — mirrors lalandia.dk .small-nav */}
        <div
          id={`${navId}-mobile`}
          className={`lalandia-header__mobile${isMobileOpen ? ' is-open' : ''}`}
          aria-hidden={!isMobileOpen}
        >
          <div className="lalandia-header__mobile-panel">
            <div className="lalandia-header__mobile-centers">
              {model.items.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={item.href === '#' ? item.children?.[0]?.href || '#' : item.href}
                  className="lalandia-header__mobile-center"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.label}
                  <span className="lalandia-header__mobile-center-arrow" aria-hidden="true">
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>

            <div className="lalandia-header__mobile-accordion">
              <div className="lalandia-header__mobile-row">
                <Link href="/" onClick={() => setIsMobileOpen(false)}>
                  Home page
                </Link>
              </div>

              {model.items.slice(3).map((item) => (
                <details key={item.id} className="lalandia-header__mobile-details">
                  <summary>
                    <span className="lalandia-header__mobile-details-label">{item.label}</span>
                    <ArrowIcon className="lalandia-header__mobile-details-arrow" />
                  </summary>
                  <div className="lalandia-header__mobile-subitems">
                    {(item.children ?? []).map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        className="lalandia-header__mobile-subitem"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}

              <details className="lalandia-header__mobile-details">
                <summary>
                  <span className="lalandia-header__mobile-details-label">About Lalandia</span>
                  <ArrowIcon className="lalandia-header__mobile-details-arrow" />
                </summary>
                <div className="lalandia-header__mobile-subitems">
                  <Link
                    href="/en/about/news"
                    className="lalandia-header__mobile-subitem"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    News
                  </Link>
                  <Link
                    href="/en/about/press"
                    className="lalandia-header__mobile-subitem"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Press
                  </Link>
                  <Link
                    href="/en/about/jobs-at-lalandia"
                    className="lalandia-header__mobile-subitem"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Jobs
                  </Link>
                  <Link
                    href="/en/about/fehmarnbelt-fixed-link"
                    className="lalandia-header__mobile-subitem"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Fehmarnbelt Fixed Link
                  </Link>
                </div>
              </details>
            </div>

            <div className="lalandia-header__mobile-tools">
              <div className="lalandia-header__mobile-lang">
                <span className="lalandia-header__globe lalandia-header__mobile-lang-globe" aria-hidden="true" />
                <select
                  aria-label="Language"
                  defaultValue={
                    model.languages.find((l) => l.code === model.currentLanguageCode)?.href ||
                    model.languages.find((l) => l.code === 'en')?.href ||
                    model.languages[0]?.href
                  }
                  onChange={(event) => {
                    if (event.target.value) {
                      window.location.href = event.target.value;
                    }
                  }}
                >
                  {model.languages.map((language) => (
                    <option key={language.id} value={language.href}>
                      {language.label}
                    </option>
                  ))}
                </select>
                <ArrowIcon className="lalandia-header__mobile-lang-arrow" />
              </div>

              <div className="lalandia-header__mobile-search">
                <div className="lalandia-header__mobile-search-wrap">
                  <input
                    type="search"
                    className="lalandia-header__mobile-search-input"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <span className="lalandia-header__mobile-search-btn" aria-hidden="true">
                    <span className="lalandia-header__icon-search" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

/**
 * Sitecore Content SDK component export.
 * Hardcoded defaults apply until header fields are authored in Sitecore AI.
 */
export const Default: React.FC<Partial<HeaderProps>> = (props) => {
  const { page } = useSitecore();
  const isEditing = page?.mode?.isEditing ?? false;
  const resolved = resolveHeaderModel(props.fields);

  return (
    <HeaderView
      model={resolved.model}
      logoField={resolved.logoField}
      logoLinkField={resolved.logoLinkField}
      menuLabelField={resolved.menuLabelField}
      bookCtaField={resolved.bookCtaField}
      isEditing={isEditing}
    />
  );
};
