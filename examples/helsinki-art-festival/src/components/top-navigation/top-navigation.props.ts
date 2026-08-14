import {
  CompatibleDatasource,
  CompatibleField,
  ComponentProps,
} from 'lib/component-props';
import { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';

export type TopNavigationLinkItem = {
  id?: string;
  link?: CompatibleField<LinkField>;
  field?: {
    link?: CompatibleField<LinkField>;
  };
};

export type TopNavigationDatasource = {
  logo?: CompatibleField<ImageField>;
  homeLink?: CompatibleField<LinkField>;
  languageLabel?: CompatibleField<TextField>;
  searchLink?: CompatibleField<LinkField>;
  children?: {
    results?: TopNavigationLinkItem[];
  };
  /** Optional alternate language links */
  languages?: {
    results?: TopNavigationLinkItem[];
  };
};

export interface TopNavigationProps extends ComponentProps {
  fields?: CompatibleDatasource<TopNavigationDatasource>;
}

export type ResolvedNavLink = {
  id: string;
  field: LinkField;
  text: string;
  href: string;
};
