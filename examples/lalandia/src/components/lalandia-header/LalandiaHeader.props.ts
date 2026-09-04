import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { CompatibleField, CompatibleDatasource, ComponentProps } from 'lib/component-props';
import type { HeaderModel, HeaderNavLink, HeaderLanguage } from './LalandiaHeader.defaults';

/**
 * Sitecore-ready field shape for the Lalandia header.
 * Nested navigation can be authored as multilist / children later;
 * until then resolveHeaderModel() falls back to LalandiaHeader.defaults.
 */
export type HeaderDatasourceFields = {
  logo?: CompatibleField<ImageField>;
  logoLink?: CompatibleField<LinkField>;
  menuLabel?: CompatibleField<Field<string>>;
  bookCta?: CompatibleField<LinkField>;
  currentLanguageCode?: CompatibleField<Field<string>>;
  /** Optional override for primary nav — leave empty to use defaults */
  navigationJson?: CompatibleField<Field<string>>;
  languagesJson?: CompatibleField<Field<string>>;
};

export type HeaderProps = ComponentProps & {
  fields?: CompatibleDatasource<HeaderDatasourceFields>;
};

export type ResolvedHeaderFields = {
  model: HeaderModel;
  logoField?: ImageField;
  logoLinkField?: LinkField;
  menuLabelField?: Field<string>;
  bookCtaField?: LinkField;
};

export type { HeaderModel, HeaderNavLink, HeaderLanguage };
