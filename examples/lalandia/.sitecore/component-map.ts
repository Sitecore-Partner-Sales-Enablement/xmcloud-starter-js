// Below are built-in components that are available in the app, it's recommended to keep them as is
import { NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';


import { BYOCServerWrapper, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in import section
import * as Title from 'src/components/title/Title';
import * as StructuredData from 'src/components/structured-data/StructuredData';
import * as RowSplitter from 'src/components/row-splitter/RowSplitter';
import * as RichText from 'src/components/rich-text/RichText';
import * as Promo from 'src/components/promo/Promo';
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as PageContent from 'src/components/page-content/PageContent';
import * as Navigation from 'src/components/navigation/Navigation';
import * as LinkList from 'src/components/link-list/LinkList';
import * as LalandiaInspiration from 'src/components/lalandia-inspiration/LalandiaInspiration';
import * as LalandiaImageSlider from 'src/components/lalandia-image-slider/LalandiaImageSlider';
import * as LalandiaHero from 'src/components/lalandia-hero/LalandiaHero';
import * as LalandiaHeader from 'src/components/lalandia-header/LalandiaHeader';
import * as LalandiaFooter from 'src/components/lalandia-footer/LalandiaFooter';
import * as LalandiaBasicText from 'src/components/lalandia-basic-text/LalandiaBasicText';
import * as Image from 'src/components/image/Image';
import * as ContentBlock from 'src/components/content-block/ContentBlock';
import * as Container from 'src/components/container/Container';
import * as ColumnSplitter from 'src/components/column-splitter/ColumnSplitter';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCServerWrapper],
  ['FEaaSWrapper', FEaaSServerWrapper],
  ['Form', { ...Form, componentType: 'client' }],
  ['Title', { ...Title }],
  ['StructuredData', { ...StructuredData }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichText', { ...RichText }],
  ['Promo', { ...Promo }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['PageContent', { ...PageContent }],
  ['Navigation', { ...Navigation, componentType: 'client' }],
  ['LinkList', { ...LinkList }],
  ['LalandiaInspiration', { ...LalandiaInspiration, componentType: 'client' }],
  ['LalandiaImageSlider', { ...LalandiaImageSlider, componentType: 'client' }],
  ['LalandiaHero', { ...LalandiaHero, componentType: 'client' }],
  ['LalandiaHeader', { ...LalandiaHeader, componentType: 'client' }],
  ['LalandiaFooter', { ...LalandiaFooter, componentType: 'client' }],
  ['LalandiaBasicText', { ...LalandiaBasicText, componentType: 'client' }],
  ['Image', { ...Image }],
  ['ContentBlock', { ...ContentBlock, componentType: 'client' }],
  ['Container', { ...Container }],
  ['ColumnSplitter', { ...ColumnSplitter }],
]);

export default componentMap;
