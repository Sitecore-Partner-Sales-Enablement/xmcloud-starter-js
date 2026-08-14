import React from 'react';
import { Text, LinkField } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getDatasource } from 'lib/component-props';
import { cn, componentShell } from 'lib/utils';
import { LinkListItemProps, LinkListProps } from './link-list.props';

const LinkListItem = ({ index, total, field }: LinkListItemProps) => {
  const classNames = [
    `item${index}`,
    index % 2 === 0 ? 'odd' : 'even',
    index === 0 ? 'first' : '',
    index === total - 1 ? 'last' : '',
    'list-none',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classNames}>
      <div className="field-link">
        <CompatibleLink
          field={field}
          className="font-body text-base text-black no-underline hover:underline hover:underline-offset-4 md:text-lg"
        />
      </div>
    </li>
  );
};

export const Default = ({ params, fields }: LinkListProps) => {
  const datasource = getDatasource(fields);
  const styles = cn(componentShell, 'link-list bg-transparent', params.styles);
  const id = params.RenderingIdentifier;
  const isInFooter = params.styles?.includes('footer') || params.styles?.includes('contacts');

  const renderContent = () => {
    const results = datasource?.children?.results;

    if (!datasource || !Array.isArray(results)) {
      return (
        <h3 className="font-heading text-xl font-bold text-black md:text-[25px]">Link List</h3>
      );
    }

    const links = results
      .filter((element): element is typeof element & { field: { link: LinkField } } =>
        Boolean(element?.field?.link)
      )
      .map((element, index) => (
        <LinkListItem
          key={`${index}-${element.field.link.value?.href ?? index}`}
          index={index}
          total={results.length}
          field={element.field.link}
        />
      ));

    return (
      <>
        <Text
          tag="h3"
          className={cn(
            'mb-4 font-heading font-bold text-black',
            isInFooter ? 'text-[25px]' : 'text-xl border-b border-black pb-2'
          )}
          field={datasource.field?.title}
        />
        <ul
          className={cn(
            'm-0 flex list-none flex-col gap-2 p-0',
            isInFooter && 'gap-3 [&_a]:text-[16px] [&_a]:font-normal [&_a]:no-underline'
          )}
        >
          {links}
        </ul>
      </>
    );
  };

  return (
    <aside className={styles} id={id}>
      <div className="component-content">{renderContent()}</div>
    </aside>
  );
};
