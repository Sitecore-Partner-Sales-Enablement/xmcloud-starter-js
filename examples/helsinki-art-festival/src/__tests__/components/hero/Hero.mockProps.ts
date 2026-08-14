import { mockPage } from '../../mocks/mockPage';
import { HeroProps } from '../../../components/hero/hero.props';

export const mockHeroProps: HeroProps = {
  rendering: {
    componentName: 'Hero',
    dataSource: 'hero-datasource',
    uid: 'hero-uid',
  },
  params: {
    styles: 'hero-styles',
    RenderingIdentifier: 'hero-test-id',
  },
  page: mockPage,
  fields: {
    data: {
      datasource: {
        title: { value: 'Night of the Arts' },
        image: {
          value: {
            src: '/hero-night-of-the-arts.jpg',
            alt: 'Night festival lights',
            width: '1410',
            height: '800',
          },
        },
        imageCaption: { value: 'Image: Pietari Purovaara' },
      },
    },
  },
};

export const mockHeroPropsCustomColors: HeroProps = {
  ...mockHeroProps,
  params: {
    ...mockHeroProps.params,
    topBackgroundColor: '#008676',
    bottomBackgroundColor: '#F5F5F5',
  },
};

export const mockHeroPropsEmpty: HeroProps = {
  rendering: {
    componentName: 'Hero',
    dataSource: '',
    uid: 'hero-empty-uid',
  },
  params: {
    styles: '',
    RenderingIdentifier: 'hero-empty-id',
  },
  page: mockPage,
  fields: undefined,
};

export const mockHeroPropsEditing: HeroProps = {
  ...mockHeroPropsEmpty,
  page: {
    ...mockPage,
    mode: {
      ...mockPage.mode,
      isEditing: true,
    },
  },
  params: {
    styles: 'editing-styles',
    RenderingIdentifier: 'hero-editing-id',
  },
};
