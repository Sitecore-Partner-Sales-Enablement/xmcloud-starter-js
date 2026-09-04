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
import { DEFAULT_BASIC_TEXT } from './LalandiaBasicText.defaults';
import type { LalandiaBasicTextFields, LalandiaBasicTextProps } from './lalandia-basic-text.props';

const EMPTY_TEXT: Field<string> = { value: '' };
const EMPTY_RICH: RichTextField = { value: '' };
const EMPTY_IMAGE: ImageField = { value: {} };

/**
 * Simple title + rich text block (live: .info-list / .article__item-header + .article__item-text).
 * See https://www.lalandia.dk/en/inspiration/waterpark after the hero.
 *
 * Datasource fields (Pages-editable):
 * - Title (Single-Line Text)
 * - Text (Rich Text)
 */
export const Default: React.FC<Partial<LalandiaBasicTextProps>> = (props) => {
  const { page: sitecorePage } = useSitecore();
  const isEditing = props.page?.mode?.isEditing ?? sitecorePage?.mode?.isEditing ?? false;

  const { params } = props;
  const styles = typeof params?.styles === 'string' ? params.styles : '';
  const imageLeftParam = params?.ImageLeft ?? params?.imageLeft ?? params?.['Image left'];
  const isImageLeft =
    typeof imageLeftParam === 'string'
      ? ['1', 'true', 'yes', 'on'].includes(imageLeftParam.toLowerCase())
      : Boolean(imageLeftParam);
  const id =
    typeof params?.RenderingIdentifier === 'string' ? params.RenderingIdentifier : undefined;

  const datasource = getDatasource<LalandiaBasicTextFields>(props.fields) ?? props.fields;
  const titleField = getFieldValue(datasource?.Title);
  const textField = getFieldValue(datasource?.Text);
  const imageField = getFieldValue(datasource?.Image);
  const hasImage = Boolean(imageField?.value?.src);

  const resolvedTitle: Field<string> = titleField?.value
    ? titleField
    : isEditing
      ? titleField ?? EMPTY_TEXT
      : { value: DEFAULT_BASIC_TEXT.title };

  const resolvedText: RichTextField | Field<string> =
    textField && textField.value
      ? textField
      : isEditing
        ? textField ?? EMPTY_RICH
        : { value: DEFAULT_BASIC_TEXT.textHtml };

  const resolvedImage: ImageField | undefined = hasImage
    ? imageField
    : isEditing
      ? imageField ?? EMPTY_IMAGE
      : undefined;

  return (
    <section
      className={`component lalandia-basic-text ${hasImage ? 'has-image' : ''} ${
        hasImage && isImageLeft ? 'image-left' : ''
      } ${styles}`.trim()}
      id={id}
      data-component="LalandiaBasicText"
    >
      <div className="lalandia-basic-text__inner">
        {/* Default layout: title stays full-width above the text/image row */}
        {!(hasImage && isImageLeft) && (
          <Text tag="h3" field={resolvedTitle} className="lalandia-basic-text__title" />
        )}
        <div className="lalandia-basic-text__body">
          <div className="lalandia-basic-text__copy">
            {/* ImageLeft layout: title moves into the right-hand copy column */}
            {hasImage && isImageLeft && (
              <Text tag="h3" field={resolvedTitle} className="lalandia-basic-text__title" />
            )}
            <ContentSdkRichText field={resolvedText} className="lalandia-basic-text__text" />
          </div>
          {resolvedImage && (
            <figure className="lalandia-basic-text__image">
              <ContentSdkImage
                field={resolvedImage}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                alt={typeof resolvedImage.value?.alt === 'string' ? resolvedImage.value.alt : ''}
              />
            </figure>
          )}
        </div>
      </div>
    </section>
  );
};
