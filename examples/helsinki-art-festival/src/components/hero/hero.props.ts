import {
  CompatibleDatasource,
  CompatibleField,
  ComponentProps,
} from 'lib/component-props';
import { ImageField, TextField } from '@sitecore-content-sdk/nextjs';

export type HeroDatasource = {
  title?: CompatibleField<TextField>;
  image?: CompatibleField<ImageField>;
  imageCaption?: CompatibleField<TextField>;
  /** CSS color for the upper title band (default #E4E4E3) */
  topBackgroundColor?: CompatibleField<TextField>;
  /** CSS color for the lower area behind the image (default #FFFFFF) */
  bottomBackgroundColor?: CompatibleField<TextField>;
};

export type HeroParams = ComponentProps['params'] & {
  /** CSS color for the upper title band — overrides datasource when set */
  topBackgroundColor?: string;
  /** CSS color for the lower area behind the image — overrides datasource when set */
  bottomBackgroundColor?: string;
};

export interface HeroProps extends ComponentProps {
  params: HeroParams;
  fields?: CompatibleDatasource<HeroDatasource>;
}
