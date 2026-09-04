import { CompatibleField, ComponentProps } from 'lib/component-props';
import { Field, ImageField, RichTextField } from '@sitecore-content-sdk/nextjs';

/**
 * Sitecore datasource fields for LalandiaBasicText.
 * Template: Title (Single-Line Text), Text (Rich Text).
 */
export interface LalandiaBasicTextFields {
  Title?: CompatibleField<Field<string>>;
  Text?: CompatibleField<RichTextField | Field<string>>;
  Image?: CompatibleField<ImageField>;
}

export type LalandiaBasicTextProps = ComponentProps & {
  fields?: LalandiaBasicTextFields;
};
