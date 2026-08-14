'use client';

import React, { useEffect, useState, JSX } from 'react';
import {
  NextImage as ContentSdkImage,
  RichText,
  Text,
  ImageField,
} from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { cn, componentShell } from 'lib/utils';
import { StandardPromoDatasource, StandardPromoProps } from './standard-promo.props';

const ROTATE_MS = 4000;

const FALLBACK = {
  title: 'Helsinki Festival\n18.8.–5.9.2026',
  body: `<p>The program for Helsinki Festival 2026 has now been released, and tickets are on sale!</p>
<p>Festival highlights include a performance of the opera Le Grand Macabre by the Finnish Radio Symphony Orchestra and international soloists, a concert by the Czech Philharmonic featuring star pianist Yunchan Lim, and the play The Silence by Berlin’s Schaubühne theatre. The Huvila stage will host performances by artists such as Katie Melua and Carminho. Night of the Arts will be celebrated with a magical parade of giant animals.</p>`,
  ctaText: 'Read more and buy tickets',
  ctaHref: '/programme',
};

const IMAGE_KEYS = ['image1', 'image2', 'image3', 'image4', 'image5'] as const;

const isTruthyFlag = (value: unknown): boolean => {
  if (value === true || value === 1) return true;
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'left' || normalized === 'yes';
};

const collectImages = (datasource?: StandardPromoDatasource): ImageField[] => {
  if (!datasource) return [];

  return IMAGE_KEYS.map((key) => getFieldValue(datasource[key]) as ImageField | undefined).filter(
    (field): field is ImageField => Boolean(field?.value?.src)
  );
};

export const Default = ({ params, fields, page }: StandardPromoProps): JSX.Element => {
  const isEditing = Boolean(page?.mode?.isEditing);
  const { styles, RenderingIdentifier: id } = params ?? {};
  const datasource = getDatasource(fields);

  const titleField = getFieldValue(datasource?.title);
  const bodyField = getFieldValue(datasource?.body);
  const ctaLinkField = getFieldValue(datasource?.ctaLink);
  const images = collectImages(datasource);

  const imageOnLeft = isTruthyFlag(
    params?.imageOnLeft ?? getFieldValue(datasource?.imageOnLeft)?.value
  );

  const hasDatasource = Boolean(datasource);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const onChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || images.length < 2 || isEditing) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [images.length, prefersReducedMotion, isEditing]);

  useEffect(() => {
    setActiveIndex(0);
  }, [images.length]);

  const titleValue =
    typeof titleField?.value === 'string'
      ? titleField.value
      : titleField?.value
        ? String(titleField.value)
        : '';
  const showTitle =
    Boolean(titleValue) || (!hasDatasource && !isEditing) || (isEditing && Boolean(titleField));
  const showBody =
    Boolean(bodyField?.value) || (!hasDatasource && !isEditing) || (isEditing && Boolean(bodyField));
  const showCta =
    Boolean(ctaLinkField?.value?.href) ||
    (!hasDatasource && !isEditing) ||
    (isEditing && Boolean(ctaLinkField));

  const titleIsRichText =
    typeof titleField?.value === 'string' && /<\/?[a-z][\s\S]*>/i.test(titleField.value);

  const mediaColumn = (
    <div className="standard-promo__media relative aspect-[4/3] w-full overflow-hidden bg-bg-hero md:aspect-auto md:min-h-[480px] lg:min-h-[560px]">
      {images.length > 0 ? (
        images.map((image, index) => {
          const alt =
            typeof image.value?.alt === 'string' && image.value.alt
              ? image.value.alt
              : `Promo image ${index + 1}`;
          return (
            <div
              key={`${image.value?.src}-${index}`}
              className={cn(
                'absolute inset-0 transition-opacity duration-700 ease-in-out',
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              )}
              aria-hidden={index !== activeIndex}
            >
              <ContentSdkImage field={image} className="h-full w-full object-cover" alt={alt} />
            </div>
          );
        })
      ) : isEditing ? (
        <div className="flex h-full min-h-[280px] items-center justify-center border border-dashed border-black/30 font-body text-sm text-black/60 md:min-h-[480px]">
          Standard Promo: add up to 5 images
        </div>
      ) : (
        <div className="h-full min-h-[280px] bg-bg-hero md:min-h-[480px]" aria-hidden />
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-6">
          {images.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={cn(
                'h-2.5 w-2.5 rounded-full border-0 p-0 transition-colors',
                index === activeIndex ? 'bg-white' : 'bg-white/50'
              )}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );

  const textColumn = (
    <div
      className={cn(
        'standard-promo__content flex h-full flex-col justify-center py-8 md:py-[10%]',
        imageOnLeft ? 'md:pl-8 lg:pl-12' : 'md:pr-8 lg:pr-12'
      )}
    >
      {showTitle && (
        <div className="mb-6 font-heading text-[clamp(2rem,4vw,50px)] font-bold leading-[1.1] text-black md:pr-10">
          {titleField && (titleValue || isEditing) ? (
            titleIsRichText ? (
              <RichText field={titleField} tag="h2" />
            ) : (
              <Text field={titleField} tag="h2" className="whitespace-pre-line" />
            )
          ) : (
            <h2 className="whitespace-pre-line">{FALLBACK.title}</h2>
          )}
        </div>
      )}

      {showBody && (
        <div
          className={cn(
            'standard-promo__body mb-8 font-body text-[18px] leading-[1.5] text-black md:text-[20px] md:leading-[1.5]',
            '[&_p]:mb-4 [&_p]:last:mb-0'
          )}
        >
          {bodyField?.value || isEditing ? (
            <RichText field={bodyField} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: FALLBACK.body }} />
          )}
        </div>
      )}

      {showCta &&
        (ctaLinkField?.value?.href || isEditing ? (
          <CompatibleLink field={ctaLinkField} editable={isEditing} className="standard-promo__cta" />
        ) : (
          <a href={FALLBACK.ctaHref} className="standard-promo__cta">
            {FALLBACK.ctaText}
          </a>
        ))}
    </div>
  );

  return (
    <section
      className={cn(
        componentShell,
        'standard-promo bg-white',
        imageOnLeft ? 'standard-promo--image-left' : 'standard-promo--image-right',
        styles
      )}
      id={id}
    >
      <div className="mx-auto w-full max-w-[1440px] px-[15px]">
        <div className="grid grid-cols-1 items-stretch md:-mx-[15px] md:grid-cols-2">
          <div className={cn('md:px-[15px]', imageOnLeft ? 'md:order-2' : 'md:order-1')}>
            {textColumn}
          </div>
          <div className={cn('md:px-[15px]', imageOnLeft ? 'md:order-1' : 'md:order-2')}>
            {mediaColumn}
          </div>
        </div>
      </div>

      {isEditing && !datasource && (
        <p className="is-empty-hint mx-auto mt-6 max-w-[1440px] px-[15px] font-body text-sm text-black/70">
          Standard Promo: configure title, body, CTA, images (1–5), and imageOnLeft in the
          datasource.
        </p>
      )}
    </section>
  );
};
