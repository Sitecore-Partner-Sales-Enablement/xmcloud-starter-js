import React, { JSX } from 'react';
import {
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
} from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import StructuredData from 'components/structured-data/StructuredData';
import { getFieldValue } from 'lib/component-props';
import { cn, componentShell } from 'lib/utils';
import { buildProductJsonLd } from 'src/lib/structured-data/schema';
import { PromoContentProps, PromoFields as Fields, PromoProps } from './promo.props';

const PromoContent = (props: PromoContentProps): JSX.Element => {
  const { fields, params, renderText } = props;
  const { styles, RenderingIdentifier: id } = params;

  const Wrapper = ({ children }: { children: JSX.Element }): JSX.Element => (
    <article
      className={cn(
        componentShell,
        'promo group overflow-hidden bg-transparent p-0',
        styles
      )}
      id={id}
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="component-content flex h-full flex-col">{children}</div>
    </article>
  );

  if (!fields) {
    return (
      <Wrapper>
        <span className="is-empty-hint font-body text-lg">Promo</span>
      </Wrapper>
    );
  }

  const promoIconField = getFieldValue(fields.PromoIcon);
  const promoTextField = getFieldValue(fields.PromoText);
  const promoLinkField = getFieldValue(fields.PromoLink);

  return (
    <Wrapper>
      <>
        <figure
          className="field-promoicon mb-4 aspect-[16/10] w-full overflow-hidden bg-bg-hero [&_img]:h-full [&_img]:w-full [&_img]:object-cover"
          itemProp="image"
        >
          <ContentSdkImage field={promoIconField} />
        </figure>
        <div className="promo-text flex flex-1 flex-col gap-3" itemProp="description">
          {renderText(fields)}
        </div>
        <StructuredData
          id={`jsonld-product-${id ?? 'promo'}`}
          data={buildProductJsonLd({
            name:
              promoLinkField?.value?.title ||
              (promoTextField?.value ? String(promoTextField.value) : undefined),
            descriptionHtml: promoTextField?.value ? String(promoTextField.value) : undefined,
            url: promoLinkField?.value?.href,
            image: promoIconField?.value?.src,
          })}
        />
      </>
    </Wrapper>
  );
};

export const Default = (props: PromoProps): JSX.Element => {
  const renderText = (fields: Fields) => {
    const promoTextField = getFieldValue(fields.PromoText);
    const promoLinkField = getFieldValue(fields.PromoLink);

    return (
      <>
        <div className="field-promotext font-heading text-xl font-bold leading-snug text-black [&_a]:font-bold [&_a]:text-black [&_a]:no-underline [&_a]:hover:underline [&_h1]:text-xl [&_h2]:text-xl [&_h3]:text-xl [&_p]:my-1 [&_p]:font-body [&_p]:text-base [&_p]:font-normal">
          <ContentSdkRichText field={promoTextField} />
        </div>
        <div className="field-promolink mt-auto">
          {promoLinkField ? (
            <CompatibleLink
              field={promoLinkField}
              className="font-body text-base font-bold text-black underline underline-offset-4 hover:text-accent-pink"
            />
          ) : null}
        </div>
      </>
    );
  };

  return <PromoContent {...props} renderText={renderText} />;
};

export const WithText = (props: PromoProps): JSX.Element => {
  const renderText = (fields: Fields) => (
    <>
      <div className="field-promotext font-heading text-xl font-bold text-black">
        <ContentSdkRichText className="promo-text" field={getFieldValue(fields.PromoText)} />
      </div>
      <div className="field-promotext font-body text-base text-black">
        <ContentSdkRichText className="promo-text" field={getFieldValue(fields.PromoText2)} />
      </div>
    </>
  );

  return <PromoContent {...props} renderText={renderText} />;
};
