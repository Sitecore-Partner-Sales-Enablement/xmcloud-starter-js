// Client-safe component map for App Router
import { NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';


import { BYOCClientWrapper, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in import section
import * as Navigation from 'src/components/navigation/Navigation';
import * as LalandiaInspiration from 'src/components/lalandia-inspiration/LalandiaInspiration';
import * as LalandiaImageSlider from 'src/components/lalandia-image-slider/LalandiaImageSlider';
import * as LalandiaHero from 'src/components/lalandia-hero/LalandiaHero';
import * as LalandiaHeader from 'src/components/lalandia-header/LalandiaHeader';
import * as LalandiaFooter from 'src/components/lalandia-footer/LalandiaFooter';
import * as LalandiaBasicText from 'src/components/lalandia-basic-text/LalandiaBasicText';
import * as ContentBlock from 'src/components/content-block/ContentBlock';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCClientWrapper],
  ['FEaaSWrapper', FEaaSClientWrapper],
  ['Form', Form],
  ['Navigation', { ...Navigation }],
  ['LalandiaInspiration', { ...LalandiaInspiration }],
  ['LalandiaImageSlider', { ...LalandiaImageSlider }],
  ['LalandiaHero', { ...LalandiaHero }],
  ['LalandiaHeader', { ...LalandiaHeader }],
  ['LalandiaFooter', { ...LalandiaFooter }],
  ['LalandiaBasicText', { ...LalandiaBasicText }],
  ['ContentBlock', { ...ContentBlock }],
]);

export default componentMap;
