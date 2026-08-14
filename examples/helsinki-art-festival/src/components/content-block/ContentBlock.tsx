'use client';

import { JSX } from 'react';
import { Text, RichText, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ContentBlockProps } from './content-block.props';

/**
 * A simple Content Block component, with a heading and rich text block.
 */
const ContentBlock = ({ fields }: ContentBlockProps): JSX.Element => (
  <section className="contentBlock mx-auto max-w-[720px] px-4 py-8 md:px-8">
    <Text
      tag="h2"
      className="contentTitle mb-4 font-heading text-[1.875rem] font-bold text-black"
      field={fields?.heading}
    />

    <RichText
      className="contentDescription font-body text-lg leading-relaxed text-black [&_a]:font-bold [&_a]:underline [&_a]:hover:text-accent-pink [&_*]:max-w-full"
      field={fields?.content}
    />
  </section>
);

export default withDatasourceCheck()<ContentBlockProps>(ContentBlock);
