'use client';

import React, { useEffect, useState } from 'react';
import {
  NextImage as ContentSdkImage,
  Text,
  useSitecore,
  type Field,
  type ImageField,
  type LinkField,
} from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { resolvePublicAssetUrl } from 'lib/utils';
import { DEFAULT_INSPIRATION } from './LalandiaInspiration.defaults';
import type {
  LalandiaInspirationFields,
  LalandiaInspirationItemFields,
  LalandiaInspirationItemsField,
  LalandiaInspirationProps,
} from './lalandia-inspiration.props';

const EMPTY_TEXT: Field<string> = { value: '' };
const EMPTY_IMAGE: ImageField = { value: {} };
const EMPTY_LINK: LinkField = { value: { href: '' } };

type ResolvedTile = {
  key: string;
  titleField: Field<string>;
  textField: Field<string>;
  imageField: ImageField;
  ctaField?: LinkField;
  imageSrc?: string;
};

function parseBoolParam(value: unknown): boolean {
  if (typeof value === 'string') {
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
  }
  return Boolean(value);
}

function parseAutoRotateIntervalMs(value: unknown): number {
  const fallback = DEFAULT_INSPIRATION.autoRotateIntervalMs;
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const seconds = typeof value === 'number' ? value : Number.parseFloat(String(value).trim());
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return fallback;
  }
  return Math.round(seconds * 1000);
}

/** Normalize multilist GraphQL (`targetItems`) or a plain item array. */
function getMultilistItems(
  itemsField: LalandiaInspirationItemsField
): LalandiaInspirationItemFields[] {
  if (!itemsField) {
    return [];
  }
  if (Array.isArray(itemsField)) {
    return itemsField;
  }
  if (Array.isArray(itemsField.targetItems)) {
    return itemsField.targetItems;
  }
  return [];
}

/**
 * Layout Service multilist items nest content under `fields`.
 * GraphQL targetItems often put Title/Text/Image/Cta on the item root.
 */
function resolveTileFromItem(item: LalandiaInspirationItemFields, index: number): ResolvedTile {
  const content = item.fields ?? item;
  const titleField = getFieldValue(content.Title) ?? EMPTY_TEXT;
  const textField = getFieldValue(content.Text) ?? EMPTY_TEXT;
  const imageField = getFieldValue(content.Image) ?? EMPTY_IMAGE;
  const ctaField = getFieldValue(content.Cta);
  const imageSrc = typeof imageField.value?.src === 'string' ? imageField.value.src : undefined;
  const key = item.id || item.name || item.displayName || `inspiration-item-${index}`;

  return { key, titleField, textField, imageField, ctaField, imageSrc };
}

function resolveDefaultTiles(): ResolvedTile[] {
  return DEFAULT_INSPIRATION.items.map((item, index) => ({
    key: `default-inspiration-${index}`,
    titleField: { value: item.title },
    textField: { value: item.text },
    imageField: {
      value: {
        src: resolvePublicAssetUrl(item.imageSrc),
        alt: item.imageAlt,
      },
    },
    ctaField: {
      value: {
        href: item.ctaHref,
        text: item.ctaText,
        title: item.ctaText,
      },
    },
    imageSrc: resolvePublicAssetUrl(item.imageSrc),
  }));
}

/**
 * Inspiration spot-carousel (live: section.spot-carousel#inspiration).
 * See https://www.lalandia.dk/en/inspiration/waterpark near the end of the page.
 *
 * Datasource fields (Pages-editable):
 * - Title (Single-Line Text) — section heading
 * - Items (Multilist) — referenced Sitecore items with Title, Text, Image, Cta
 *
 * When the multilist is empty, only the heading is rendered.
 * With no datasource at all (local / Design Library), sample tiles are shown.
 *
 * Rendering parameters:
 * - AutoRotate (checkbox) — auto-advance when more than one tile (default on)
 * - AutoRotateSeconds (number) — seconds between tiles; default 6 when unset
 */
export const Default: React.FC<Partial<LalandiaInspirationProps>> = (props) => {
  const { page: sitecorePage } = useSitecore();
  const isEditing = props.page?.mode?.isEditing ?? sitecorePage?.mode?.isEditing ?? false;

  const { params } = props;
  const styles = typeof params?.styles === 'string' ? params.styles : '';
  const autoRotateParam = params?.AutoRotate ?? params?.autoRotate ?? params?.['Auto rotate'];
  // Live site always timers; treat missing param as enabled.
  const isAutoRotate =
    autoRotateParam === undefined || autoRotateParam === null || autoRotateParam === ''
      ? true
      : parseBoolParam(autoRotateParam);
  const autoRotateSecondsParam =
    params?.AutoRotateSeconds ??
    params?.autoRotateSeconds ??
    params?.['Auto rotate seconds'] ??
    params?.RotateInterval;
  const autoRotateIntervalMs = parseAutoRotateIntervalMs(autoRotateSecondsParam);
  const id =
    typeof params?.RenderingIdentifier === 'string' ? params.RenderingIdentifier : 'inspiration';

  const datasource = getDatasource<LalandiaInspirationFields>(props.fields) ?? props.fields;
  const hasDatasource = Boolean(datasource);
  const titleField = getFieldValue(datasource?.Title);
  const multilistRaw = datasource?.Items;
  const hasItemsField = hasDatasource && multilistRaw !== undefined;
  const fieldTiles = getMultilistItems(multilistRaw).map(resolveTileFromItem);

  const resolvedTitle: Field<string> = titleField?.value
    ? titleField
    : isEditing
      ? titleField ?? EMPTY_TEXT
      : { value: DEFAULT_INSPIRATION.title };

  /**
   * CMS with an Items field (even empty) → honor multilist (title-only when empty).
   * No datasource → preview defaults with sample tiles.
   */
  const tiles: ResolvedTile[] = (() => {
    if (hasItemsField || fieldTiles.length > 0) {
      return fieldTiles;
    }
    if (isEditing && hasDatasource) {
      return [];
    }
    if (!hasDatasource) {
      return resolveDefaultTiles();
    }
    // Datasource present but no Items field yet — title only (authoring in progress).
    return [];
  })();

  const tileCount = tiles.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setActiveIndex((current) => (tileCount === 0 ? 0 : Math.min(current, tileCount - 1)));
  }, [tileCount]);

  const goTo = (index: number) => {
    if (tileCount === 0) return;
    setActiveIndex(((index % tileCount) + tileCount) % tileCount);
  };

  useEffect(() => {
    if (!isAutoRotate || isEditing || isPaused || tileCount < 2) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % tileCount);
    }, autoRotateIntervalMs);
    return () => window.clearInterval(timer);
  }, [isAutoRotate, isEditing, isPaused, tileCount, autoRotateIntervalMs]);

  const showCarousel = tileCount > 0;
  const showIndicators = tileCount > 1;

  return (
    <section
      className={`component lalandia-inspiration ${styles}`.trim()}
      id={id}
      data-component="LalandiaInspiration"
      data-auto-rotate={isAutoRotate ? 'true' : 'false'}
      data-tile-count={String(tileCount)}
    >
      <div className="lalandia-inspiration__header">
        <Text tag="h4" field={resolvedTitle} className="lalandia-inspiration__heading" />
      </div>

      {showCarousel && (
        <div
          className="lalandia-inspiration__carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <div
            className="lalandia-inspiration__viewport"
            role="region"
            aria-roledescription="carousel"
            aria-label={
              typeof resolvedTitle.value === 'string' ? resolvedTitle.value : 'Inspiration'
            }
          >
            <ul
              className="lalandia-inspiration__track"
              style={
                {
                  ['--active-index' as string]: String(activeIndex),
                } as React.CSSProperties
              }
            >
              {tiles.map((tile, index) => {
                const isActive = index === activeIndex;
                const ctaField = tile.ctaField;
                const hasCtaHref = Boolean(ctaField?.value?.href);
                const showCta = hasCtaHref || (isEditing && Boolean(ctaField));

                return (
                  <li
                    key={tile.key}
                    className={`lalandia-inspiration__slide${isActive ? ' is-active' : ''}`}
                    aria-hidden={!isActive}
                  >
                    <article
                      className="lalandia-inspiration__item"
                      onClick={!isActive ? () => goTo(index) : undefined}
                      onKeyDown={
                        !isActive
                          ? (event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                goTo(index);
                              }
                            }
                          : undefined
                      }
                      role={!isActive ? 'button' : undefined}
                      tabIndex={!isActive ? 0 : undefined}
                    >
                      <div className="lalandia-inspiration__image">
                        {tile.imageSrc || isEditing ? (
                          <ContentSdkImage
                            field={tile.imageField}
                            sizes="(max-width: 689px) 90vw, (max-width: 1200px) 75vw, 1025px"
                            alt={
                              typeof tile.imageField.value?.alt === 'string'
                                ? tile.imageField.value.alt
                                : typeof tile.titleField.value === 'string'
                                  ? tile.titleField.value
                                  : ''
                            }
                          />
                        ) : null}
                      </div>
                      <div className="lalandia-inspiration__panel">
                        <div className="lalandia-inspiration__panel-content">
                          <div className="lalandia-inspiration__copy">
                            <Text
                              tag="h3"
                              field={tile.titleField}
                              className="lalandia-inspiration__title"
                            />
                            {(tile.textField.value || isEditing) && (
                              <Text
                                tag="p"
                                field={tile.textField}
                                className="lalandia-inspiration__text"
                              />
                            )}
                          </div>
                          {showCta && (
                            <div
                              className="lalandia-inspiration__cta"
                              onClick={(event) => event.stopPropagation()}
                              onKeyDown={(event) => event.stopPropagation()}
                            >
                              <CompatibleLink
                                field={ctaField ?? EMPTY_LINK}
                                editable={isEditing}
                                className="lalandia-inspiration__button"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>

          {showIndicators && (
            <ul className="lalandia-inspiration__indicators" aria-label="Inspiration slides">
              {tiles.map((tile, index) => (
                <li
                  key={tile.key}
                  className={`lalandia-inspiration__indicator${
                    index === activeIndex ? ' is-active' : ''
                  }`}
                  onClick={() => goTo(index)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      goTo(index);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                >
                  {index + 1}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isEditing && hasItemsField && tileCount === 0 && (
        <p className="lalandia-inspiration__edit-hint">
          Add items to the Items multilist to show inspiration tiles. With an empty multilist,
          only the heading is shown on the live site.
        </p>
      )}
    </section>
  );
};
