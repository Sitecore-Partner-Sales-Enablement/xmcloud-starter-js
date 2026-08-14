import React, { JSX } from 'react';
import { LinkField, Text, TextField } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { cn, componentShell } from 'lib/utils';
import { TitleComponentContentProps, TitleProps } from './title.props';

const ComponentContent = ({ id, styles = '', children }: TitleComponentContentProps): JSX.Element => (
  <div className={cn(componentShell, 'title', styles)} id={id}>
    <div className="component-content">
      <div
        className={cn(
          'field-title font-heading font-bold text-black',
          '[&_a]:text-inherit [&_a]:no-underline [&_a]:hover:text-accent-pink',
          '[&_span]:text-inherit'
        )}
      >
        {children}
      </div>
    </div>
  </div>
);

export const Default = ({ params, fields, page }: TitleProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = params;
  const datasource = getDatasource(fields);
  const datasourceField = getFieldValue(datasource?.field) as TextField | undefined;
  const contextField: TextField = page?.layout?.sitecore?.route?.fields?.Title as TextField;
  const titleField: TextField = datasourceField || contextField;

  const link: LinkField = {
    value: {
      href: datasource?.url?.path,
      title:
        (titleField?.value ? String(titleField.value) : undefined) ||
        datasourceField?.value?.toString(),
    },
  };

  return (
    <ComponentContent styles={styles} id={id}>
      {page?.mode?.isEditing ? (
        <Text field={titleField} tag="h1" />
      ) : (
        <CompatibleLink field={link}>
          <Text field={titleField} tag="h1" />
        </CompatibleLink>
      )}
    </ComponentContent>
  );
};
