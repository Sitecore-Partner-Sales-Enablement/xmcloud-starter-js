import React, { JSX } from 'react';
import {
  RichText as ContentSdkRichText,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';
import StructuredData from 'components/structured-data/StructuredData';
import { cn, componentShell } from 'lib/utils';
import { buildArticleJsonLd } from 'src/lib/structured-data/schema';
import { PageContentProps } from './page-content.props';

export const Default = ({ params, fields, page }: PageContentProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = params;

  const field = fields?.Content ?? (page.layout.sitecore.route?.fields?.Content as RichTextField);
  const titleField = page.layout.sitecore.route?.fields?.Title as { value?: unknown } | undefined;
  const headline = titleField?.value ? String(titleField.value) : undefined;
  const articleBodyHtml = field?.value ? String(field.value) : undefined;

  return (
    <article
      className={cn(
        componentShell,
        'content mx-auto max-w-[1100px] px-4 py-10 md:px-8 md:py-14',
        styles
      )}
      id={id}
      itemScope
      itemType="https://schema.org/Article"
    >
      <div className="component-content">
        <div
          className={cn(
            'field-content font-body text-lg leading-relaxed text-black',
            '[&_a]:font-bold [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-accent-pink',
            '[&_h2]:mb-4 [&_h2]:font-heading [&_h2]:text-[1.875rem] [&_h2]:font-bold',
            '[&_h3]:mb-3 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-bold',
            '[&_p]:my-3 [&_*]:max-w-full'
          )}
          itemProp="articleBody"
        >
          {field ? <ContentSdkRichText field={field} /> : '[Content]'}
        </div>
      </div>
      {(headline || articleBodyHtml) && (
        <StructuredData
          id={`jsonld-article-${id ?? 'page-content'}`}
          data={buildArticleJsonLd({
            headline,
            articleBodyHtml,
            inLanguage: page?.locale,
          })}
        />
      )}
    </article>
  );
};
