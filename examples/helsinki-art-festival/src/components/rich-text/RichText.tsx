import React, { JSX } from 'react';
import { RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { cn, componentShell } from 'lib/utils';
import { RichTextProps } from './rich-text.props';

export const Default = ({ params, fields }: RichTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  return (
    <div
      className={cn(
        componentShell,
        'rich-text mx-auto max-w-[720px] px-4 py-6 font-body text-lg leading-relaxed text-black md:px-8',
        '[&_a]:font-bold [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-accent-pink',
        '[&_h2]:font-heading [&_h2]:text-[1.875rem] [&_h2]:font-bold',
        '[&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-bold',
        '[&_*]:max-w-full',
        styles
      )}
      id={RenderingIdentifier}
    >
      <div className="component-content">
        {fields ? (
          <ContentSdkRichText field={fields?.Text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}
      </div>
    </div>
  );
};
