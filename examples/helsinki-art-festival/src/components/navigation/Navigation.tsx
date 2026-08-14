'use client';
import React, { useState, JSX } from 'react';
import { LinkField, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from 'components/content-sdk/CompatibleLink';
import { getFieldValue } from 'lib/component-props';
import { cn, componentShell } from 'lib/utils';
import {
  NavigationFields as Fields,
  NavigationListItemProps,
  NavigationProps,
} from './navigation.props';

const getTextContent = (fields?: Fields): JSX.Element | string => {
  if (!fields) {
    return '';
  }

  const navigationTitle = getFieldValue(fields.NavigationTitle);
  const title = getFieldValue(fields.Title);

  if (navigationTitle) return <Text field={navigationTitle} />;
  if (title) return <Text field={title} />;
  return fields.DisplayName;
};

const getLinkField = (fields?: Fields): LinkField => ({
  value: {
    href: fields?.Href ?? '',
    title:
      getFieldValue(fields?.NavigationTitle)?.value?.toString() ??
      getFieldValue(fields?.Title)?.value?.toString() ??
      fields?.DisplayName,
    querystring: fields?.Querystring ?? '',
  },
});

const NavigationListItem: React.FC<NavigationListItemProps> = ({
  fields,
  handleClick,
  relativeLevel,
}) => {
  if (!fields) {
    return null;
  }

  const [isActive, setIsActive] = useState(false);
  const { page } = useSitecore();

  const classNames = [...fields.Styles, `rel-level${relativeLevel}`, isActive ? 'active' : ''].join(
    ' '
  );

  const hasChildren = fields.Children?.length > 0;
  const children = hasChildren
    ? fields.Children.map((fields, index) => (
        <NavigationListItem
          key={`${index}-${fields.Id}`}
          fields={fields}
          handleClick={handleClick}
          relativeLevel={relativeLevel + 1}
        />
      ))
    : null;

  return (
    <li className={cn(classNames, 'list-none')} key={fields.Id} tabIndex={0}>
      <div
        className={cn('navigation-title', hasChildren && 'child')}
        onClick={() => setIsActive(!isActive)}
      >
        <CompatibleLink
          field={getLinkField(fields)}
          editable={page.mode.isEditing}
          onClick={handleClick}
          className={cn(
            'font-body text-[18px] font-normal text-black no-underline underline-offset-4',
            'hover:text-black hover:underline focus:text-black',
            relativeLevel > 1 && 'text-base'
          )}
        >
          {getTextContent(fields)}
        </CompatibleLink>
      </div>
      {hasChildren && (
        <ul className="clearfix tww-clearfix mt-2 space-y-1 pl-4 md:pl-0">{children}</ul>
      )}
    </li>
  );
};

export const Default = ({ params, fields }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;

  if (!fields || !Object.values(fields).length) {
    return (
      <div className={cn(componentShell, 'navigation bg-transparent', styles)} id={id}>
        <div className="component-content font-body text-lg">[Navigation]</div>
      </div>
    );
  }

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, forceState?: boolean) => {
    if (event && page.mode.isEditing) {
      event.preventDefault();
    }

    setIsMenuOpen(forceState ?? !isMenuOpen);
  };

  const navigationItems = Object.values(fields)
    .filter(Boolean)
    .map((item: Fields, index) => (
      <NavigationListItem
        key={`${index}-${item.Id}`}
        fields={item}
        handleClick={(event) => handleToggleMenu(event, false)}
        relativeLevel={1}
      />
    ));

  return (
    <div
      className={cn(componentShell, 'navigation grow bg-transparent', styles)}
      id={id}
    >
      <label className="menu-mobile-navigate-wrapper relative flex w-full items-center justify-end md:justify-center">
        <input
          type="checkbox"
          className="menu-mobile-navigate absolute top-0 right-0 z-[2] h-10 w-10 cursor-pointer opacity-0 md:hidden"
          checked={isMenuOpen}
          onChange={() => handleToggleMenu()}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        />
        <div
          className={cn(
            'menu-humburger md:hidden',
            'flex h-10 w-10 flex-col items-center justify-center gap-1.5',
            isMenuOpen && 'fixed top-5 right-5 z-50'
          )}
          aria-hidden
        >
          <span
            className={cn(
              'block h-0.5 w-6 bg-black transition',
              isMenuOpen && 'translate-y-2 rotate-45'
            )}
          />
          <span className={cn('block h-0.5 w-6 bg-black transition', isMenuOpen && 'opacity-0')} />
          <span
            className={cn(
              'block h-0.5 w-6 bg-black transition',
              isMenuOpen && '-translate-y-2 -rotate-45'
            )}
          />
        </div>
        <div
          className={cn(
            'component-content w-full',
            'max-md:fixed max-md:inset-0 max-md:z-40 max-md:bg-bg-hero max-md:pt-24',
            !isMenuOpen && 'max-md:hidden',
            'md:static md:block md:bg-transparent md:pt-0'
          )}
        >
          <nav className="w-full">
            <ul
              className={cn(
                'clearfix tww-clearfix flex list-none flex-col items-center gap-6 p-0 m-0',
                'md:flex-row md:flex-wrap md:justify-center md:gap-x-8 md:gap-y-2'
              )}
            >
              {navigationItems}
            </ul>
          </nav>
        </div>
      </label>
    </div>
  );
};
