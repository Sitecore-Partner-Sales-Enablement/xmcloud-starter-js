import {
  CompatibleDatasource,
  CompatibleField,
  ComponentProps,
} from 'lib/component-props';
import { ImageField, LinkField, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';

export type StandardPromoDatasource = {
  title?: CompatibleField<TextField | RichTextField>;
  body?: CompatibleField<RichTextField>;
  ctaLink?: CompatibleField<LinkField>;
  image1?: CompatibleField<ImageField>;
  image2?: CompatibleField<ImageField>;
  image3?: CompatibleField<ImageField>;
  image4?: CompatibleField<ImageField>;
  image5?: CompatibleField<ImageField>;
  /**
   * When true / "1" / "left", media column is on the left and text on the right.
   * Default: text left, images right (matches helsinkifestival.fi content-left).
   */
  imageOnLeft?: CompatibleField<TextField | { value?: boolean | string }>;
};

export type StandardPromoParams = ComponentProps['params'] & {
  /** "1" | "true" | "left" — overrides datasource when set */
  imageOnLeft?: string;
};

export interface StandardPromoProps extends ComponentProps {
  params: StandardPromoParams;
  fields?: CompatibleDatasource<StandardPromoDatasource>;
}
