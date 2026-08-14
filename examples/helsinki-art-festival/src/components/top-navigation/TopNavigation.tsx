'use client';

import React, { useEffect, useId, useRef, useState, JSX } from 'react';
import Link from 'next/link';
import { NextImage as ContentSdkImage, Text } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { cn, componentShell } from 'lib/utils';
import {
  ResolvedNavLink,
  TopNavigationLinkItem,
  TopNavigationProps,
} from './top-navigation.props';
import { FESTIVAL_LOGO_DATA_URI } from './festival-logo';

/** Demo links matching helsinkifestival.fi when no datasource is configured */
const FALLBACK_NAV: Array<{ text: string; href: string }> = [
  { text: 'Info', href: '/info' },
  { text: 'Programme', href: '/programme' },
  { text: 'Tickets', href: '/tickets' },
  { text: 'Huvila', href: '/huvila' },
  { text: 'Responsibility', href: '/responsibility' },
  { text: 'Media', href: '/media' },
];

const FALLBACK_LANGUAGES: Array<{ text: string; href: string }> = [
  { text: 'Suomi', href: '/' },
  { text: 'English', href: '/en' },
];

const resolveLinkItems = (items?: TopNavigationLinkItem[]): ResolvedNavLink[] => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      const field = getFieldValue(item.link) ?? getFieldValue(item.field?.link);
      if (!field) return null;

      const text =
        field.value?.text ||
        field.value?.title ||
        field.value?.href ||
        `Link ${index + 1}`;
      const href = field.value?.href || '#';

      return {
        id: item.id ?? `${href}-${index}`,
        field,
        text: String(text),
        href,
      };
    })
    .filter((item): item is ResolvedNavLink => Boolean(item));
};

const FestivalMark = ({ className }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={FESTIVAL_LOGO_DATA_URI}
    alt=""
    width={60}
    height={60}
    className={cn('h-[60px] w-[60px] object-contain', className)}
    aria-hidden
  />
);

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CaretIcon = ({ open }: { open?: boolean }) => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    aria-hidden
    className={cn('transition-transform', open && 'rotate-180')}
  >
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Default = ({ params, fields, page }: TopNavigationProps): JSX.Element => {
  const isEditing = Boolean(page?.mode?.isEditing);
  const { styles, RenderingIdentifier: id } = params ?? {};
  const datasource = getDatasource(fields);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const languageMenuId = useId();
  const searchPanelId = useId();

  const logoField = getFieldValue(datasource?.logo);
  const homeLinkField = getFieldValue(datasource?.homeLink);
  const searchLinkField = getFieldValue(datasource?.searchLink);
  const languageLabelField = getFieldValue(datasource?.languageLabel);

  const navLinks = resolveLinkItems(datasource?.children?.results);
  const languageLinks = resolveLinkItems(datasource?.languages?.results);

  const displayNav =
    navLinks.length > 0
      ? navLinks
      : FALLBACK_NAV.map((item, index) => ({
          id: `fallback-${index}`,
          field: { value: { href: item.href, text: item.text } },
          text: item.text,
          href: item.href,
        }));

  const displayLanguages =
    languageLinks.length > 0
      ? languageLinks
      : FALLBACK_LANGUAGES.map((item, index) => ({
          id: `lang-${index}`,
          field: { value: { href: item.href, text: item.text } },
          text: item.text,
          href: item.href,
        }));

  const languageLabel =
    (languageLabelField?.value ? String(languageLabelField.value) : undefined) || 'EN';
  const homeHref = homeLinkField?.value?.href || '/';
  const searchHref = searchLinkField?.value?.href || '/search';
  const hasLogo = Boolean(logoField?.value?.src);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageOpen(false);
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeOverlays = () => {
    setIsLanguageOpen(false);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    const url = query ? `${searchHref}?q=${encodeURIComponent(query)}` : searchHref;
    window.location.href = url;
  };

  const Brand = () => {
    // In Pages editor, Next/Image optimizer URLs and root-relative public paths
    // often resolve against the wrong host — use a plain <img> (data URI fallback
    // or the Sitecore media src) so the logo keeps working in editing/preview.
    const logoAlt =
      typeof logoField?.value?.alt === 'string' && logoField.value.alt
        ? logoField.value.alt
        : 'Helsinki Art Festival';

    const mark = hasLogo ? (
      isEditing ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={String(logoField?.value?.src)}
          alt={logoAlt}
          width={60}
          height={60}
          className="h-[60px] w-[60px] object-contain"
        />
      ) : (
        <ContentSdkImage field={logoField} className="h-[60px] w-[60px] object-contain" />
      )
    ) : (
      <FestivalMark />
    );

    if (isEditing && homeLinkField) {
      return (
        <CompatibleLink
          field={homeLinkField}
          className="brand inline-flex shrink-0 items-center no-underline"
          aria-label="Helsinki Art Festival"
        >
          {mark}
        </CompatibleLink>
      );
    }

    return (
      <Link
        href={homeHref}
        className="brand inline-flex shrink-0 items-center no-underline"
        aria-label="Helsinki Art Festival"
        onClick={closeOverlays}
      >
        {mark}
      </Link>
    );
  };

    // Matches helsinkifestival.fi header .nav-link: Van Condensed Pro stand-in, 20px / 700 / black
  const navLinkClass = cn(
    'nav-link font-body text-[20px] font-bold leading-6 text-black no-underline',
    'hover:text-black hover:no-underline focus-visible:text-black focus-visible:no-underline'
  );

  const NavList = ({ mobile = false }: { mobile?: boolean }) => (
    <ul
      className={cn(
        'primary-nav-list m-0 flex list-none items-center justify-center p-0',
        mobile ? 'flex-col items-stretch gap-1' : 'flex-row flex-wrap'
      )}
    >
      {displayNav.map((item) => (
        <li key={item.id} className={cn('nav-item list-none', !mobile && 'mx-[18px]')}>
          {isEditing || navLinks.length > 0 ? (
            <CompatibleLink
              field={item.field}
              editable={isEditing}
              className={cn(navLinkClass, mobile && 'block px-2 py-3 text-[25px]')}
              onClick={closeOverlays}
            />
          ) : (
            <Link
              href={item.href}
              className={cn(navLinkClass, mobile && 'block px-2 py-3 text-[25px]')}
              onClick={closeOverlays}
            >
              {item.text}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(componentShell, 'top-navigation w-full bg-bg-basic-color', styles)}
      id={id}
    >
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:bg-black focus:px-4 focus:py-2 focus:text-white focus:no-underline"
      >
        Skip to content
      </a>

      <div className="outer-container mx-auto flex h-[100px] w-full max-w-[1400px] items-center gap-4 px-4 md:px-8">
        <Brand />

        {/* Desktop primary nav */}
        <nav
          className="primary-nav hidden min-w-0 flex-1 md:block"
          role="navigation"
          aria-label="Primary"
        >
          <NavList />
        </nav>

        {/* Desktop utilities */}
        <div className="ml-auto hidden items-center gap-5 md:flex">
          <div className="relative">
            <button
              type="button"
              className="nav-link nav-link-caret inline-flex items-center gap-1.5 font-body pr-4 text-[20px] font-bold leading-6 text-black no-underline hover:text-black"
              aria-expanded={isLanguageOpen}
              aria-controls={languageMenuId}
              aria-label={`Language: ${languageLabel}`}
              onClick={() => {
                setIsLanguageOpen((open) => !open);
                setIsSearchOpen(false);
              }}
            >
              {isEditing && languageLabelField ? (
                <Text field={languageLabelField} />
              ) : (
                <span>{languageLabel}</span>
              )}
              <CaretIcon open={isLanguageOpen} />
            </button>
            {isLanguageOpen && (
              <ul
                id={languageMenuId}
                className="absolute top-full right-0 z-50 mt-3 min-w-[160px] list-none border border-black bg-white p-2 shadow-none"
              >
                {displayLanguages.map((item) => (
                  <li key={item.id} className="list-none">
                    {languageLinks.length > 0 || isEditing ? (
                      <CompatibleLink
                        field={item.field}
                        editable={isEditing}
                        className="block px-3 py-2 font-body text-base text-black no-underline hover:bg-bg-hero"
                        onClick={closeOverlays}
                      />
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-3 py-2 font-body text-base text-black no-underline hover:bg-bg-hero"
                        onClick={closeOverlays}
                      >
                        {item.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            className="nav-link inline-flex h-10 w-10 items-center justify-center text-black"
            aria-expanded={isSearchOpen}
            aria-controls={searchPanelId}
            aria-label="Search"
            onClick={() => {
              setIsSearchOpen((open) => !open);
              setIsLanguageOpen(false);
            }}
          >
            <SearchIcon />
          </button>
        </div>

        {/* Mobile utilities */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <button
            type="button"
            className="language-toggle inline-flex h-10 items-center gap-1 px-2 font-body text-[20px] font-bold leading-6 text-black"
            aria-label="Select language"
            aria-expanded={isLanguageOpen}
            onClick={() => {
              setIsLanguageOpen((open) => !open);
              setIsSearchOpen(false);
              setIsMenuOpen(false);
            }}
          >
            <span>{languageLabel}</span>
            <CaretIcon open={isLanguageOpen} />
          </button>
          <button
            type="button"
            className="search-toggle inline-flex h-10 w-10 items-center justify-center text-black"
            aria-label="Search"
            aria-expanded={isSearchOpen}
            onClick={() => {
              setIsSearchOpen((open) => !open);
              setIsLanguageOpen(false);
              setIsMenuOpen(false);
            }}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className="menu-toggle inline-flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            aria-controls="top-navigation-mobile-nav"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close navigation' : 'Toggle navigation'}
            onClick={() => {
              setIsMenuOpen((open) => !open);
              setIsLanguageOpen(false);
              setIsSearchOpen(false);
            }}
          >
            <span
              className={cn(
                'block h-0.5 w-6 bg-black transition',
                isMenuOpen && 'translate-y-2 rotate-45'
              )}
            />
            <span className={cn('block h-0.5 w-6 bg-black transition', isMenuOpen && 'opacity-0')} />
            <span
              className={cn(
                'block h-0.5 w-6 bg-black transition',
                isMenuOpen && '-translate-y-2 -rotate-45'
              )}
            />
          </button>
        </div>
      </div>

      {/* Search panel */}
      {isSearchOpen && (
        <div
          id={searchPanelId}
          className="border-t border-border-gray bg-accent-orange px-4 py-5 md:px-8"
        >
          <form
            className="mx-auto flex w-full max-w-[1400px] items-center gap-3"
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <label htmlFor="top-nav-search" className="sr-only">
              Search
            </label>
            <input
              ref={searchInputRef}
              id="top-nav-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              className="w-full border-0 border-b-2 border-black bg-transparent px-0 py-2 font-body text-xl text-black outline-none placeholder:text-black/60"
            />
            <button
              type="submit"
              className="shrink-0 bg-black px-5 py-2 font-body text-base font-bold text-white no-underline"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile language panel */}
      {isLanguageOpen && (
        <div className="border-t border-border-gray bg-accent-teal px-4 py-4 md:hidden">
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {displayLanguages.map((item) => (
              <li key={item.id} className="list-none">
                <Link
                  href={item.href}
                  className="block font-body text-lg font-bold text-white no-underline"
                  onClick={closeOverlays}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mobile nav drawer */}
      {isMenuOpen && (
        <div
          id="top-navigation-mobile-nav"
          className="border-t border-border-gray bg-bg-hero px-4 py-8 md:hidden"
        >
          <nav role="navigation" aria-label="Primary mobile">
            <NavList mobile />
          </nav>
        </div>
      )}

      {isEditing && !datasource && (
        <p className="is-empty-hint px-4 pb-3 font-body text-sm text-text-muted md:px-8">
          Top Navigation: configure logo, navigation links, language label, and search link in the
          datasource.
        </p>
      )}
    </div>
  );
};
