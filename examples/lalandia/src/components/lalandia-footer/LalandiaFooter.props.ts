import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { CompatibleField, CompatibleDatasource, ComponentProps } from 'lib/component-props';
import type { FooterModel } from './LalandiaFooter.defaults';

/**
 * Sitecore-ready field shape for the Lalandia footer.
 * Link groups / resorts can be authored as multilists later;
 * until then resolveFooterModel() falls back to LalandiaFooter.defaults.
 */
export type FooterDatasourceFields = {
  backgroundImage?: CompatibleField<ImageField>;
  palmImage?: CompatibleField<ImageField>;
  mapImage?: CompatibleField<ImageField>;
  newsletterTitle?: CompatibleField<Field<string>>;
  bookHeadline?: CompatibleField<Field<string>>;
  bookText?: CompatibleField<Field<string>>;
  bookCta?: CompatibleField<LinkField>;
  privacyLink?: CompatibleField<LinkField>;
  cookiesLink?: CompatibleField<LinkField>;
  /** Optional JSON overrides — leave empty to use defaults */
  linkGroupsJson?: CompatibleField<Field<string>>;
  resortsJson?: CompatibleField<Field<string>>;
  socialLinksJson?: CompatibleField<Field<string>>;
};

export type FooterProps = ComponentProps & {
  fields?: CompatibleDatasource<FooterDatasourceFields>;
};

export type ResolvedFooterFields = {
  model: FooterModel;
  backgroundImageField?: ImageField;
  palmImageField?: ImageField;
  mapImageField?: ImageField;
  newsletterTitleField?: Field<string>;
  bookHeadlineField?: Field<string>;
  bookTextField?: Field<string>;
  bookCtaField?: LinkField;
};

export type { FooterModel };
