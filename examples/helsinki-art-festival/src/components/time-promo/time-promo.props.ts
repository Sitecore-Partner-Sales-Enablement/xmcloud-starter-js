import {
  CompatibleDatasource,
  CompatibleField,
  ComponentProps,
} from 'lib/component-props';
import { LinkField, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';

export type TimePromoDatasource = {
  /** Bold lead line above the body copy */
  heading?: CompatibleField<TextField>;
  /** Main description (supports multiple paragraphs) */
  body?: CompatibleField<RichTextField>;
  /** CTA under the body, e.g. “Read more and submit your event »” */
  ctaLink?: CompatibleField<LinkField>;
  timeLabel?: CompatibleField<TextField>;
  timeValue?: CompatibleField<TextField>;
  ticketsLabel?: CompatibleField<TextField>;
  ticketsValue?: CompatibleField<TextField>;
};

export interface TimePromoProps extends ComponentProps {
  fields?: CompatibleDatasource<TimePromoDatasource>;
}
