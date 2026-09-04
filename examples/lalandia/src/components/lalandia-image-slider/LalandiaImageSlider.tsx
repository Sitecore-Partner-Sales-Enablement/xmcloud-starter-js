'use client';

import React, { useEffect, useState } from 'react';
import {
  NextImage as ContentSdkImage,
  useSitecore,
  type ImageField,
} from '@sitecore-content-sdk/nextjs';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { resolvePublicAssetUrl } from 'lib/utils';
import { DEFAULT_IMAGE_SLIDER } from './LalandiaImageSlider.defaults';
import type {
  LalandiaImageSliderFields,
  LalandiaImageSliderProps,
} from './lalandia-image-slider.props';

const EMPTY_IMAGE: ImageField = { value: {} };

const SLIDE_KEYS = ['Slide1', 'Slide2', 'Slide3', 'Slide4', 'Slide5'] as const;

type SlideKey = (typeof SLIDE_KEYS)[number];

type ResolvedSlide = {
  key: SlideKey;
  field: ImageField;
  src?: string;
  alt: string;
};

function parseBoolParam(value: unknown): boolean {
  if (typeof value === 'string') {
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
  }
  return Boolean(value);
}

/** Seconds → ms; empty/invalid falls back to the default interval. */
function parseAutoRotateIntervalMs(value: unknown): number {
  const fallback = DEFAULT_IMAGE_SLIDER.autoRotateIntervalMs;
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const seconds = typeof value === 'number' ? value : Number.parseFloat(String(value).trim());
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return fallback;
  }
  return Math.round(seconds * 1000);
}

/**
 * Full-bleed article image slider (live: .slider-wrapper.slider-with-grey-arrows).
 * See https://www.lalandia.dk/en/inspiration/waterpark after the intro text.
 *
 * Datasource fields (Pages-editable):
 * - Slide1 … Slide5 (Image) — leave empty to skip a slot
 *
 * Rendering parameters:
 * - AutoRotate (checkbox) — auto-advance when more than one slide
 * - AutoRotateSeconds (number) — seconds between slides; default 6 when unset
 */
export const Default: React.FC<Partial<LalandiaImageSliderProps>> = (props) => {
  const { page: sitecorePage } = useSitecore();
  const isEditing = props.page?.mode?.isEditing ?? sitecorePage?.mode?.isEditing ?? false;

  const { params } = props;
  const styles = typeof params?.styles === 'string' ? params.styles : '';
  const autoRotateParam = params?.AutoRotate ?? params?.autoRotate ?? params?.['Auto rotate'];
  const isAutoRotate = parseBoolParam(autoRotateParam);
  const autoRotateSecondsParam =
    params?.AutoRotateSeconds ??
    params?.autoRotateSeconds ??
    params?.['Auto rotate seconds'] ??
    params?.RotateInterval;
  const autoRotateIntervalMs = parseAutoRotateIntervalMs(autoRotateSecondsParam);
  const id =
    typeof params?.RenderingIdentifier === 'string' ? params.RenderingIdentifier : undefined;

  const datasource = getDatasource<LalandiaImageSliderFields>(props.fields) ?? props.fields;

  const fieldSlides: ResolvedSlide[] = SLIDE_KEYS.map((key) => {
    const field = getFieldValue(datasource?.[key]) ?? EMPTY_IMAGE;
    const src = typeof field.value?.src === 'string' ? field.value.src : undefined;
    const alt = typeof field.value?.alt === 'string' ? field.value.alt : '';
    return { key, field, src, alt };
  });

  const hasAnyFieldImage = fieldSlides.some((slide) => Boolean(slide.src));

  const slides: ResolvedSlide[] = (() => {
    if (isEditing) {
      return fieldSlides;
    }
    if (hasAnyFieldImage) {
      return fieldSlides.filter((slide) => Boolean(slide.src));
    }
    return DEFAULT_IMAGE_SLIDER.slides.map((slide, index) => ({
      key: SLIDE_KEYS[index],
      field: { value: { src: resolvePublicAssetUrl(slide.src), alt: slide.alt } },
      src: resolvePublicAssetUrl(slide.src),
      alt: slide.alt,
    }));
  })();

  const slideCount = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setActiveIndex((current) => (slideCount === 0 ? 0 : Math.min(current, slideCount - 1)));
  }, [slideCount]);

  const goTo = (index: number) => {
    if (slideCount === 0) return;
    setActiveIndex(((index % slideCount) + slideCount) % slideCount);
  };

  useEffect(() => {
    if (!isAutoRotate || isEditing || isPaused || slideCount < 2) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, autoRotateIntervalMs);
    return () => window.clearInterval(timer);
  }, [isAutoRotate, isEditing, isPaused, slideCount, autoRotateIntervalMs]);

  const showNav = slideCount > 1;

  return (
    <section
      className={`component lalandia-image-slider ${isAutoRotate ? 'auto-rotate' : ''} ${styles}`.trim()}
      id={id}
      data-component="LalandiaImageSlider"
      data-auto-rotate={isAutoRotate ? 'true' : 'false'}
      data-auto-rotate-seconds={String(autoRotateIntervalMs / 1000)}
    >
      <div className="lalandia-image-slider__inner">
        <div
          className="lalandia-image-slider__frame"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <div
            className="lalandia-image-slider__viewport"
            role="region"
            aria-roledescription="carousel"
            aria-label="Image slider"
          >
            <ul
              className="lalandia-image-slider__track"
              style={
                slideCount > 0
                  ? {
                      width: `${slideCount * 100}%`,
                      transform: `translateX(-${(activeIndex / slideCount) * 100}%)`,
                    }
                  : undefined
              }
            >
              {slides.map((slide, index) => {
                const isActive = index === activeIndex;
                return (
                  <li
                    key={slide.key}
                    className={`lalandia-image-slider__slide${isActive ? ' is-active' : ''}`}
                    style={slideCount > 0 ? { width: `${100 / slideCount}%` } : undefined}
                    aria-hidden={!isActive}
                  >
                    {slide.src || isEditing ? (
                      <ContentSdkImage
                        field={slide.field}
                        sizes="(max-width: 690px) 100vw, (max-width: 1200px) 90vw, 1360px"
                        alt={slide.alt}
                      />
                    ) : null}
                    {isEditing && !slide.src && (
                      <span className="lalandia-image-slider__empty">{slide.key}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {showNav && (
            <>
              <button
                type="button"
                className="lalandia-image-slider__nav lalandia-image-slider__nav--prev"
                onClick={() => goTo(activeIndex - 1)}
                aria-label="Previous slide"
              >
                <i
                  className="lalandia-image-slider__icon-link lalandia-image-slider__icon-link--left"
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                className="lalandia-image-slider__nav lalandia-image-slider__nav--next"
                onClick={() => goTo(activeIndex + 1)}
                aria-label="Next slide"
              >
                <i
                  className="lalandia-image-slider__icon-link lalandia-image-slider__icon-link--right"
                  aria-hidden="true"
                />
              </button>
            </>
          )}
        </div>

        {isEditing && (
          <div className="lalandia-image-slider__edit-slots" aria-label="Edit slides">
            {fieldSlides.map((slide) => (
              <div key={slide.key} className="lalandia-image-slider__edit-slot">
                <span className="lalandia-image-slider__edit-label">{slide.key}</span>
                <div className="lalandia-image-slider__edit-media">
                  <ContentSdkImage field={slide.field} alt={slide.alt || slide.key} />
                  {!slide.src && (
                    <span className="lalandia-image-slider__empty">{slide.key}</span>
                  )}
                </div>
              </div>
            ))}
            <p className="lalandia-image-slider__edit-hint">
              Leave a slot empty to hide it on the live site. AutoRotate and
              AutoRotateSeconds are rendering parameters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
