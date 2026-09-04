import { CompatibleField, ComponentProps } from 'lib/component-props';
import { ImageField } from '@sitecore-content-sdk/nextjs';

/**
 * Sitecore datasource fields for LalandiaImageSlider.
 * Template: Slide1–Slide5 (Image).
 *
 * Rendering parameters (property template):
 * - AutoRotate (checkbox)
 * - AutoRotateSeconds (number / single-line) — seconds between slides; default 6
 */
export interface LalandiaImageSliderFields {
  Slide1?: CompatibleField<ImageField>;
  Slide2?: CompatibleField<ImageField>;
  Slide3?: CompatibleField<ImageField>;
  Slide4?: CompatibleField<ImageField>;
  Slide5?: CompatibleField<ImageField>;
}

export type LalandiaImageSliderProps = ComponentProps & {
  fields?: LalandiaImageSliderFields;
};
