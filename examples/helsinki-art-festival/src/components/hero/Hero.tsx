import React, { JSX } from 'react';
import {
  NextImage as ContentSdkImage,
  Text,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { cn, componentShell } from 'lib/utils';
import { HeroProps } from './hero.props';

const DEFAULT_TOP_BACKGROUND = '#E4E4E3';
const DEFAULT_BOTTOM_BACKGROUND = '#FFFFFF';
const FALLBACK_IMAGE_SRC = '/hero/night-of-the-arts.png';
const FALLBACK_IMAGE_ALT = 'Night of the Arts';

const readColor = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

export const Default = ({ params, fields, page }: HeroProps): JSX.Element => {
  const isEditing = Boolean(page?.mode?.isEditing);
  const { styles, RenderingIdentifier: id } = params ?? {};
  const datasource = getDatasource(fields);

  const titleFromDatasource = getFieldValue(datasource?.title) as TextField | undefined;
  const contextTitle = page?.layout?.sitecore?.route?.fields?.Title as TextField | undefined;
  const titleField = titleFromDatasource || contextTitle;

  const imageField = getFieldValue(datasource?.image);
  const imageCaptionField = getFieldValue(datasource?.imageCaption);

  const topBackground = readColor(
    params?.topBackgroundColor ?? getFieldValue(datasource?.topBackgroundColor)?.value,
    DEFAULT_TOP_BACKGROUND
  );
  const bottomBackground = readColor(
    params?.bottomBackgroundColor ?? getFieldValue(datasource?.bottomBackgroundColor)?.value,
    DEFAULT_BOTTOM_BACKGROUND
  );

  const hasSitecoreImage = Boolean(imageField?.value?.src);
  const altText =
    typeof imageField?.value?.alt === 'string' && imageField.value.alt
      ? imageField.value.alt
      : typeof titleField?.value === 'string' && titleField.value
        ? String(titleField.value)
        : FALLBACK_IMAGE_ALT;

  const titleValue = titleField?.value ? String(titleField.value) : '';
  const showTitle = Boolean(titleValue) || (isEditing && Boolean(titleField));
  const showCaption =
    Boolean(imageCaptionField?.value) || (isEditing && Boolean(imageCaptionField));

  return (
    <section
      className={cn(componentShell, 'hero event-hero', styles)}
      id={id}
      style={{ backgroundColor: bottomBackground }}
    >
      {/* Upper band — grey on Night of the Arts; color via props */}
      <header
        className="event-hero__header relative z-0 w-full px-4 pt-[140px] pb-[100px] text-center md:px-8"
        style={{ backgroundColor: topBackground }}
      >
        <div className="mx-auto w-full max-w-[1440px]">
          {showTitle ? (
            <Text
              field={titleField}
              tag="h1"
              className="event-hero__title mx-auto mb-[210px] max-w-[730px] font-heading text-[clamp(2.8rem,5vw,50px)] font-bold leading-[1.1] text-black"
            />
          ) : (
            isEditing && (
              <p className="is-empty-hint mx-auto mb-[210px] max-w-[730px] font-body text-base text-black/60">
                Hero: add a title
              </p>
            )
          )}
        </div>
      </header>

      {/* Image overlaps the grey→white transition (HF has-image pattern).
          Width matches event container content: max 1440px with 15px side padding → 1410px image. */}
      <figure className="event-hero__image relative z-10 mx-auto mb-[60px] -mt-[210px] w-full max-w-[1440px] px-[15px]">
        <div className="overflow-hidden [&_img]:h-auto [&_img]:w-full [&_img]:object-cover">
          {hasSitecoreImage ? (
            <ContentSdkImage
              field={imageField}
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 1410px, 1410px"
              alt={altText}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={FALLBACK_IMAGE_SRC}
              alt={altText}
              width={1410}
              height={800}
              className="h-auto w-full object-cover"
            />
          )}
        </div>
        {showCaption && (
          <figcaption className="mt-3 font-body text-sm text-black/70">
            <Text field={imageCaptionField} tag="span" />
          </figcaption>
        )}
      </figure>
    </section>
  );
};
