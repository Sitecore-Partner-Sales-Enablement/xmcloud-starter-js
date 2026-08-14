// Client-safe component map for App Router

import { BYOCClientWrapper, NextjsContentSdkComponent, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

import * as TopNavigation from 'src/components/top-navigation/TopNavigation';
import * as StandardPromo from 'src/components/standard-promo/StandardPromo';
import * as SiteFooter from 'src/components/site-footer/SiteFooter';
import * as Navigation from 'src/components/navigation/Navigation';
import * as ContentBlock from 'src/components/content-block/ContentBlock';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCClientWrapper],
  ['FEaaSWrapper', FEaaSClientWrapper],
  ['Form', Form],
  ['TopNavigation', { ...TopNavigation }],
  ['StandardPromo', { ...StandardPromo }],
  ['SiteFooter', { ...SiteFooter }],
  ['Navigation', { ...Navigation }],
  ['ContentBlock', { ...ContentBlock }],
]);

export default componentMap;
