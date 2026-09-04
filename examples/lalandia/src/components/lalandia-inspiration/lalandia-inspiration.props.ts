import { CompatibleField, ComponentProps } from 'lib/component-props';
import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

/** Field bag on a referenced inspiration card item. */
export interface LalandiaInspirationItemContentFields {
  Title?: CompatibleField<Field<string>>;
  Text?: CompatibleField<Field<string>>;
  Image?: CompatibleField<ImageField>;
  Cta?: CompatibleField<LinkField>;
}

/**
 * Sitecore item referenced from the Items multilist.
 * Layout Service expands multilist entries as `{ id, fields: { Title, Text, Image, Cta } }`.
 * GraphQL `targetItems` may expose the same fields at the item root (often via `jsonValue`).
 */
export interface LalandiaInspirationItemFields extends LalandiaInspirationItemContentFields {
  id?: string;
  name?: string;
  displayName?: string;
  url?: string;
  fields?: LalandiaInspirationItemContentFields;
}

/**
 * Multilist field shape from Content SDK GraphQL (`targetItems`).
 * Also accepts a plain array when layout data already expanded the list.
 */
export type LalandiaInspirationItemsField =
  | {
      targetItems?: LalandiaInspirationItemFields[] | null;
    }
  | LalandiaInspirationItemFields[]
  | null
  | undefined;

/**
 * Sitecore datasource fields for LalandiaInspiration.
 * Template:
 * - Title (Single-Line Text) — section heading, e.g. "Inspiration"
 * - Items (Multilist) — references to inspiration tile items
 */
export interface LalandiaInspirationFields {
  Title?: CompatibleField<Field<string>>;
  Items?: LalandiaInspirationItemsField;
}

export type LalandiaInspirationProps = ComponentProps & {
  fields?: LalandiaInspirationFields;
};
