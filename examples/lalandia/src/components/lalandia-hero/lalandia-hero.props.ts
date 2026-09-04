import { CompatibleField, ComponentProps } from 'lib/component-props';
import { Field, ImageField, RichTextField } from '@sitecore-content-sdk/nextjs';

/**
 * Sitecore datasource fields for LalandiaHero.
 * Create a matching template with Image, Title (Single-Line), Text (Rich Text).
 */
export interface LalandiaHeroFields {
  Image?: CompatibleField<ImageField>;
  Title?: CompatibleField<Field<string>>;
  Text?: CompatibleField<RichTextField | Field<string>>;
}

export type LalandiaHeroProps = ComponentProps & {
  fields?: LalandiaHeroFields;
};
