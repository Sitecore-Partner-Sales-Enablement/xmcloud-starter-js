import { mockPage } from '../../mocks/mockPage';
import { StandardPromoProps } from '../../../components/standard-promo/standard-promo.props';

export const mockStandardPromoProps: StandardPromoProps = {
  rendering: {
    componentName: 'StandardPromo',
    dataSource: 'standard-promo-datasource',
    uid: 'standard-promo-uid',
  },
  params: {
    styles: 'standardpromo-styles',
    RenderingIdentifier: 'standard-promo-test-id',
  },
  page: mockPage,
  fields: {
    data: {
      datasource: {
        title: { value: 'Helsinki Festival\n18.8.–5.9.2026' },
        body: {
          value:
            '<p>The program for Helsinki Festival 2026 has now been released, and tickets are on sale!</p>',
        },
        ctaLink: {
          value: { href: '/programme', text: 'Read more and buy tickets' },
        },
        image1: {
          value: { src: '/promo-1.jpg', alt: 'Promo one', width: '900', height: '900' },
        },
        image2: {
          value: { src: '/promo-2.jpg', alt: 'Promo two', width: '900', height: '900' },
        },
        imageOnLeft: { value: '' },
      },
    },
  },
};

export const mockStandardPromoPropsImageLeft: StandardPromoProps = {
  ...mockStandardPromoProps,
  params: {
    ...mockStandardPromoProps.params,
    imageOnLeft: 'true',
  },
};

export const mockStandardPromoPropsEmpty: StandardPromoProps = {
  rendering: {
    componentName: 'StandardPromo',
    dataSource: '',
    uid: 'standard-promo-empty-uid',
  },
  params: {
    styles: '',
    RenderingIdentifier: 'standard-promo-empty-id',
  },
  page: mockPage,
  fields: undefined,
};

export const mockStandardPromoPropsEditing: StandardPromoProps = {
  ...mockStandardPromoPropsEmpty,
  page: {
    ...mockPage,
    mode: {
      ...mockPage.mode,
      isEditing: true,
    },
  },
  params: {
    styles: 'editing-styles',
    RenderingIdentifier: 'standard-promo-editing-id',
  },
};
