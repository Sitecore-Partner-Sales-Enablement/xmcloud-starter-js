import { mockPage } from '../../mocks/mockPage';
import { TopNavigationProps } from '../../../components/top-navigation/top-navigation.props';

export const mockTopNavigationProps: TopNavigationProps = {
  rendering: {
    componentName: 'TopNavigation',
    dataSource: 'top-nav-datasource',
    uid: 'top-navigation-uid',
  },
  params: {
    styles: 'topnav-styles',
    RenderingIdentifier: 'top-navigation-test-id',
  },
  page: mockPage,
  fields: {
    data: {
      datasource: {
        logo: {
          value: {
            src: '/logo.png',
            alt: 'Helsinki Art Festival',
            width: '60',
            height: '60',
          },
        },
        homeLink: {
          value: {
            href: '/',
            text: 'Home',
            title: 'Helsinki Art Festival',
          },
        },
        languageLabel: {
          value: 'EN',
        },
        searchLink: {
          value: {
            href: '/search',
            text: 'Search',
          },
        },
        children: {
          results: [
            {
              id: 'info',
              link: { value: { href: '/info', text: 'Info' } },
            },
            {
              id: 'programme',
              link: { value: { href: '/programme', text: 'Programme' } },
            },
            {
              id: 'tickets',
              link: { value: { href: '/tickets', text: 'Tickets' } },
            },
            {
              id: 'huvila',
              link: { value: { href: '/huvila', text: 'Huvila' } },
            },
            {
              id: 'responsibility',
              link: { value: { href: '/responsibility', text: 'Responsibility' } },
            },
            {
              id: 'media',
              link: { value: { href: '/media', text: 'Media' } },
            },
          ],
        },
        languages: {
          results: [
            { id: 'fi', link: { value: { href: '/', text: 'Suomi' } } },
            { id: 'en', link: { value: { href: '/en', text: 'English' } } },
          ],
        },
      },
    },
  },
};

export const mockTopNavigationPropsEmpty: TopNavigationProps = {
  rendering: {
    componentName: 'TopNavigation',
    dataSource: '',
    uid: 'top-navigation-empty-uid',
  },
  params: {
    styles: '',
    RenderingIdentifier: 'top-navigation-empty-id',
  },
  page: mockPage,
  fields: undefined,
};

export const mockTopNavigationPropsEditing: TopNavigationProps = {
  ...mockTopNavigationPropsEmpty,
  page: {
    ...mockPage,
    mode: {
      ...mockPage.mode,
      isEditing: true,
    },
  },
};
