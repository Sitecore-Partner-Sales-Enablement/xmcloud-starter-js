import {
  CompatibleDatasource,
  CompatibleField,
  ComponentProps,
} from 'lib/component-props';
import { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';

export type SiteFooterLinkItem = {
  id?: string;
  link?: CompatibleField<LinkField>;
  field?: {
    link?: CompatibleField<LinkField>;
  };
};

export type SiteFooterDatasource = {
  partnerLogo?: CompatibleField<ImageField>;
  partnerLogoLink?: CompatibleField<LinkField>;
  certificationLogo?: CompatibleField<ImageField>;
  certificationLogoLink?: CompatibleField<LinkField>;
  cookieLabel?: CompatibleField<TextField>;
  /** Primary column links (Info, Programme, …) */
  children?: {
    results?: SiteFooterLinkItem[];
  };
  /** Secondary column links */
  secondaryLinks?: {
    results?: SiteFooterLinkItem[];
  };
  /** Social links */
  socialLinks?: {
    results?: SiteFooterLinkItem[];
  };
};

export interface SiteFooterProps extends ComponentProps {
  fields?: CompatibleDatasource<SiteFooterDatasource>;
}

export type ResolvedFooterLink = {
  id: string;
  field: LinkField;
  text: string;
  href: string;
};
