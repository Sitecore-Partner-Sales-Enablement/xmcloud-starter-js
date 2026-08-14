import { mockPage } from '../../mocks/mockPage';
import { TimePromoProps } from '../../../components/time-promo/time-promo.props';

export const mockTimePromoProps: TimePromoProps = {
  rendering: {
    componentName: 'TimePromo',
    dataSource: 'time-promo-datasource',
    uid: 'time-promo-uid',
  },
  params: {
    styles: 'timepromo-styles',
    RenderingIdentifier: 'time-promo-test-id',
  },
  page: mockPage,
  fields: {
    data: {
      datasource: {
        heading: {
          value: 'Night of the Arts once again brings together hundreds of art events.',
        },
        body: {
          value:
            '<p>Every Night of the Arts is different, and the Night of the Arts is different for everyone.</p><p>The next Night of the Arts will be celebrated on August 20, 2026.</p>',
        },
        ctaLink: {
          value: {
            href: '/taiteidenyo/en/',
            text: 'Read more and submit your event »',
          },
        },
        timeLabel: { value: 'Time:' },
        timeValue: { value: '20.8.2026' },
        ticketsLabel: { value: 'Tickets:' },
        ticketsValue: { value: 'The event is free of charge' },
      },
    },
  },
};

export const mockTimePromoPropsEmpty: TimePromoProps = {
  rendering: {
    componentName: 'TimePromo',
    dataSource: '',
    uid: 'time-promo-empty-uid',
  },
  params: {
    styles: '',
    RenderingIdentifier: 'time-promo-empty-id',
  },
  page: mockPage,
  fields: undefined,
};

export const mockTimePromoPropsEditing: TimePromoProps = {
  ...mockTimePromoPropsEmpty,
  page: {
    ...mockPage,
    mode: {
      ...mockPage.mode,
      isEditing: true,
    },
  },
  params: {
    styles: 'editing-styles',
    RenderingIdentifier: 'time-promo-editing-id',
  },
};
