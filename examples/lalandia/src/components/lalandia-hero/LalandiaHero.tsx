'use client';

import React from 'react';
import {
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Text,
  useSitecore,
  type Field,
  type ImageField,
  type RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { resolvePublicAssetUrl } from 'lib/utils';
import { DEFAULT_HERO } from './LalandiaHero.defaults';
import type { LalandiaHeroFields, LalandiaHeroProps } from './lalandia-hero.props';

const EMPTY_TEXT: Field<string> = { value: '' };
const EMPTY_RICH: RichTextField = { value: '' };
const EMPTY_IMAGE: ImageField = { value: {} };

/**
 * Lalandia page hero — full-bleed image with overlapping white title panel.
 * Matches https://www.lalandia.dk/en/inspiration/waterpark (hero + information-menu).
 *
 * Datasource fields (editable in Pages via Content SDK helpers):
 * - Image (Image)
 * - Title (Single-Line Text)
 * - Text (Rich Text)
 */
export const Default: React.FC<Partial<LalandiaHeroProps>> = (props) => {
  const { page: sitecorePage } = useSitecore();
  const isEditing = props.page?.mode?.isEditing ?? sitecorePage?.mode?.isEditing ?? false;

  const { params } = props;
  const styles = typeof params?.styles === 'string' ? params.styles : '';
  const id =
    typeof params?.RenderingIdentifier === 'string' ? params.RenderingIdentifier : undefined;

  const datasource = getDatasource<LalandiaHeroFields>(props.fields) ?? props.fields;
  const imageField = getFieldValue(datasource?.Image);
  const titleField = getFieldValue(datasource?.Title);
  const textField = getFieldValue(datasource?.Text);

  const imageSrc = resolvePublicAssetUrl(
    (typeof imageField?.value?.src === 'string' && imageField.value.src) ||
      (!isEditing ? DEFAULT_HERO.imageSrc : '') ||
      ''
  );

  const imageAlt =
    (typeof imageField?.value?.alt === 'string' && imageField.value.alt) || DEFAULT_HERO.imageAlt;

  const resolvedTitle: Field<string> = titleField?.value
    ? titleField
    : isEditing
      ? titleField ?? EMPTY_TEXT
      : { value: DEFAULT_HERO.title };

  const resolvedText: RichTextField | Field<string> =
    textField && textField.value
      ? textField
      : isEditing
        ? textField ?? EMPTY_RICH
        : { value: DEFAULT_HERO.textHtml };

  return (
    <section
      className={`component lalandia-hero ${styles}`.trim()}
      id={id}
      data-component="LalandiaHero"
    >
      <div
        className="lalandia-hero__media"
        style={imageSrc ? { backgroundImage: `url(${imageSrc})` } : undefined}
        role="img"
        aria-label={imageAlt}
      >
        {/* Content SDK Image keeps the field editable in Pages; visually hidden so
            Next/Image wrappers cannot leave a white box over the cover background. */}
        {(isEditing || imageField?.value?.src) && (
          <div className="lalandia-hero__media-edit">
            <ContentSdkImage field={imageField ?? EMPTY_IMAGE} />
          </div>
        )}
        {isEditing && !imageField?.value?.src && (
          <span className="lalandia-hero__img-hint is-empty-hint">Hero image</span>
        )}
      </div>

      <div className="lalandia-hero__panel">
        <div className="lalandia-hero__panel-inner">
          <div className="lalandia-hero__copy">
            <Text tag="h1" field={resolvedTitle} className="lalandia-hero__title" />
            <ContentSdkRichText field={resolvedText} className="lalandia-hero__text" />
          </div>
        </div>
      </div>
    </section>
  );
};
