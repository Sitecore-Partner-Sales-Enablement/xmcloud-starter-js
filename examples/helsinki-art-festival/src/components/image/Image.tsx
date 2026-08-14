import {
  NextImage as ContentSdkImage,
  Text,
} from '@sitecore-content-sdk/nextjs';
import React from 'react';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getFieldValue } from 'lib/component-props';
import { cn, componentShell } from 'lib/utils';
import { ImageProps, ImageWrapperProps } from './image.props';

const ImageWrapper: React.FC<ImageWrapperProps> = ({ className, id, children }) => (
  <figure className={className.trim()} id={id}>
    <div className="component-content">{children}</div>
  </figure>
);

const imageBaseClasses = cn(
  componentShell,
  'image mx-auto max-w-[1410px] px-4 md:px-8',
  '[&_img]:h-auto [&_img]:w-full',
  '[&_a]:inline-block [&_a]:max-w-full',
  '[&_span]:mt-2 [&_span]:block [&_span]:font-body [&_span]:text-sm [&_span]:text-text-muted'
);

const ImageDefault: React.FC<ImageProps> = ({ params }) => (
  <ImageWrapper className={cn(imageBaseClasses, params.styles)}>
    <span className="is-empty-hint">Image</span>
  </ImageWrapper>
);

export const Banner: React.FC<ImageProps> = ({ params, fields }) => {
  const { styles, RenderingIdentifier: id } = params;
  const baseImageField = getFieldValue(fields?.Image);
  const imageField = baseImageField && {
    ...baseImageField,
    value: {
      ...baseImageField.value,
      style: { objectFit: 'cover', width: '100%', height: '100%' },
    },
  };

  const altText =
    typeof baseImageField?.value?.alt === 'string' ? baseImageField.value.alt : 'Hero banner';

  const bannerSizes =
    '(max-width: 640px) 100vw, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1280px, 1920px';

  return (
    <figure
      className={cn(componentShell, 'hero-banner bg-bg-hero px-4 pb-10 md:px-8 md:pb-16', styles)}
      id={typeof id === 'string' ? id : undefined}
    >
      <div className="component-content sc-sxa-image-hero-banner mx-auto max-w-[1410px] overflow-hidden [&_img]:h-auto [&_img]:w-full [&_img]:object-cover">
        <ContentSdkImage
          field={imageField}
          loading="eager"
          fetchPriority="high"
          sizes={bannerSizes}
          alt={altText}
        />
      </div>
    </figure>
  );
};

export const Default: React.FC<ImageProps> = (props) => {
  const { fields, params, page } = props;
  const { styles, RenderingIdentifier: id } = params;
  const imageField = getFieldValue(fields?.Image);
  const imageCaptionField = getFieldValue(fields?.ImageCaption);
  const targetUrlField = getFieldValue(fields?.TargetUrl);

  if (!fields) {
    return <ImageDefault {...props} />;
  }

  const Image = () => (
    <ContentSdkImage
      field={imageField}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
      alt={typeof imageField?.value?.alt === 'string' ? imageField.value.alt : ''}
    />
  );
  const shouldWrapWithLink = !page?.mode?.isEditing && targetUrlField?.value?.href;

  return (
    <ImageWrapper
      className={cn(imageBaseClasses, styles)}
      id={typeof id === 'string' ? id : undefined}
    >
      {shouldWrapWithLink ? (
        <CompatibleLink field={targetUrlField}>
          <Image />
        </CompatibleLink>
      ) : (
        <Image />
      )}
      <figcaption className="image-caption field-imagecaption">
        <Text tag="span" field={imageCaptionField} />
      </figcaption>
    </ImageWrapper>
  );
};
