import { mockPage } from '../../mocks/mockPage';
import { SiteFooterProps } from '../../../components/site-footer/site-footer.props';

export const mockSiteFooterProps: SiteFooterProps = {
  rendering: {
    componentName: 'SiteFooter',
    dataSource: 'site-footer-datasource',
    uid: 'site-footer-uid',
  },
  params: {
    styles: 'sitefooter-styles',
    RenderingIdentifier: 'site-footer-test-id',
  },
  page: mockPage,
  fields: {
    data: {
      datasource: {
        cookieLabel: { value: 'Cookie settings' },
        children: {
          results: [
            { id: 'info', link: { value: { href: '/info', text: 'Info' } } },
            { id: 'programme', link: { value: { href: '/programme', text: 'Programme' } } },
            { id: 'tickets', link: { value: { href: '/tickets', text: 'Tickets' } } },
            { id: 'huvila', link: { value: { href: '/huvila', text: 'Huvila' } } },
            {
              id: 'responsibility',
              link: { value: { href: '/responsibility', text: 'Responsibility' } },
            },
            { id: 'media', link: { value: { href: '/media', text: 'Media' } } },
          ],
        },
        secondaryLinks: {
          results: [
            { id: 'info-2', link: { value: { href: '/info', text: 'Info' } } },
            {
              id: 'contact',
              link: { value: { href: '/contact', text: 'Contact information' } },
            },
            {
              id: 'accreditation',
              link: { value: { href: '/accreditation', text: 'Industry Accreditation' } },
            },
            {
              id: 'gifts',
              link: { value: { href: '/art-gifts', text: 'Art Gifts: Open Source' } },
            },
          ],
        },
        socialLinks: {
          results: [
            {
              id: 'fb',
              link: {
                value: {
                  href: 'https://www.facebook.com/helsinkifestival/',
                  text: 'Facebook',
                },
              },
            },
            {
              id: 'ig',
              link: {
                value: { href: 'https://instagram.com/helsinkifestival', text: 'Instagram' },
              },
            },
            {
              id: 'yt',
              link: { value: { href: 'https://www.youtube.com/', text: 'YouTube' } },
            },
            {
              id: 'tt',
              link: {
                value: { href: 'https://www.tiktok.com/@helsinkifestival', text: 'TikTok' },
              },
            },
          ],
        },
      },
    },
  },
};

export const mockSiteFooterPropsEmpty: SiteFooterProps = {
  rendering: {
    componentName: 'SiteFooter',
    dataSource: '',
    uid: 'site-footer-empty-uid',
  },
  params: {
    styles: '',
    RenderingIdentifier: 'site-footer-empty-id',
  },
  page: mockPage,
  fields: undefined,
};

export const mockSiteFooterPropsEditing: SiteFooterProps = {
  ...mockSiteFooterPropsEmpty,
  page: {
    ...mockPage,
    mode: {
      ...mockPage.mode,
      isEditing: true,
    },
  },
};
