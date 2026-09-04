/**
 * Hardcoded Lalandia footer content — mirrors https://www.lalandia.dk/en
 * Swap for Sitecore fields via resolveFooterModel() when content is authored.
 */

export type FooterLink = {
  id: string;
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  id: string;
  title: string;
  links: FooterLink[];
};

export type FooterResort = {
  id: string;
  name: string;
  addressLines: string[];
  cvr?: string;
  ean?: string;
  phoneDisplay: string;
  phoneTel: string;
  contactHref: string;
  contactLabel: string;
};

export type FooterSocialLink = {
  id: string;
  label: string;
  href: string;
  icon: 'facebook' | 'instagram' | 'youtube' | 'newsletter';
};

export type FooterModel = {
  backgroundImageSrc: string;
  palmImageSrc: string;
  mapImageSrc: string;
  newsletterTitle: string;
  newsletterForenamePlaceholder: string;
  newsletterSurnamePlaceholder: string;
  newsletterEmailPlaceholder: string;
  newsletterSubmitLabel: string;
  newsletterPrivacyPrefix: string;
  newsletterPrivacyLinkLabel: string;
  newsletterPrivacyHref: string;
  linkGroups: FooterLinkGroup[];
  resorts: FooterResort[];
  bookHeadline: string;
  bookText: string;
  bookPhoneDisplay: string;
  bookPhoneTel: string;
  bookCtaLabel: string;
  bookCtaHref: string;
  socialLinks: FooterSocialLink[];
  logoSrc: string;
  logoAlt: string;
  logoHref: string;
  legalCompany: string;
  privacyLabel: string;
  privacyHref: string;
  cookiesLabel: string;
  cookiesHref: string;
};

export const DEFAULT_FOOTER: FooterModel = {
  backgroundImageSrc: '/footer/bg_08.png',
  palmImageSrc: '/footer/footer_palme.png',
  mapImageSrc: '/footer/footer-kort.svg',
  newsletterTitle: 'Stay up to date',
  newsletterForenamePlaceholder: 'Forename',
  newsletterSurnamePlaceholder: 'Surname',
  newsletterEmailPlaceholder: 'E-mail',
  newsletterSubmitLabel: 'Register',
  newsletterPrivacyPrefix: 'Read about personal data',
  newsletterPrivacyLinkLabel: 'here',
  newsletterPrivacyHref: '/en/privacy/personal-data-policy',
  linkGroups: [
    {
      id: 'find-quickly',
      title: 'Find it quickly',
      links: [
        { id: 'home', label: 'Home page', href: '/en' },
        { id: 'parking', label: 'Parking', href: '/en/parking' },
        { id: 'late-departure', label: 'Late departure', href: '/en/late-departure' },
        { id: 'autumn', label: 'Autumn holiday', href: '/en/autumn-holiday' },
        { id: 'prices', label: 'Prices', href: '/en/prices' },
        { id: 'gift', label: 'Gift voucher', href: '/en/landingpage/gift-voucher' },
        { id: 'pay', label: 'Pay for your stay', href: '#/pay' },
        { id: 'linen', label: 'Order linen', href: '/en/landingpage/bestil-linned' },
        { id: 'lost', label: 'Lost property', href: '/en/landingpage/lost-property' },
      ],
    },
    {
      id: 'about',
      title: 'About Lalandia',
      links: [
        { id: 'news', label: 'News', href: '/en/about/news' },
        { id: 'care', label: 'Holiday with care', href: '/en/holiday-with-care' },
        { id: 'buy', label: 'Buy a holiday home', href: '/en/about/buy-a-holiday-home-at-lalandia' },
        { id: 'jobs', label: 'Jobs and HR', href: '/en/about/jobs-at-lalandia' },
        { id: 'fehmarnbelt', label: 'The Fehmarnbelt Fixed Link project', href: '/en/about/fehmarnbelt-fixed-link' },
        { id: 'press', label: 'Press', href: '/en/about/press' },
      ],
    },
    {
      id: 'groups-sondervig',
      title: 'Groups Søndervig',
      links: [
        {
          id: 'sv-parties',
          label: 'Private parties',
          href: '/en/sondervig/eat#events-and-private-dining',
        },
      ],
    },
    {
      id: 'groups-billund',
      title: 'Groups Billund',
      links: [
        { id: 'bi-companies', label: 'For companies', href: '/en/billund/groups-and-parties#for-companies' },
        {
          id: 'bi-parties',
          label: 'Private parties',
          href: '/en/billund/groups-and-parties#for-private-parties',
        },
        {
          id: 'bi-schools',
          label: 'Schools and sports',
          href: '/en/billund/groups-and-parties#schools-and-sports-clubs',
        },
      ],
    },
    {
      id: 'groups-rodby',
      title: 'Groups Rødby',
      links: [
        { id: 'ro-companies', label: 'For companies', href: '/en/rodby/grupper-og-selskaber#for-companies' },
        {
          id: 'ro-parties',
          label: 'Private parties',
          href: '/en/rodby/grupper-og-selskaber#for-private-parties',
        },
        { id: 'ro-schools', label: 'Schools and sports', href: '/en/rodby/grupper-og-selskaber#schools' },
      ],
    },
  ],
  resorts: [
    {
      id: 'sondervig',
      name: 'Lalandia in Søndervig',
      addressLines: ['Vestkystvej 2', 'DK-6950 Ringkøbing'],
      cvr: '4052 3219',
      ean: '5790002503481',
      phoneDisplay: '+45 5461 0500',
      phoneTel: '+4554610500',
      contactHref: '#contact',
      contactLabel: 'Contact Us',
    },
    {
      id: 'billund',
      name: 'Lalandia in Billund',
      addressLines: ['Ellehammers Allé 3', 'DK-7190 Billund'],
      cvr: '2810 8265',
      ean: '5790001865849',
      phoneDisplay: '+45 5461 0500',
      phoneTel: '+4554610500',
      contactHref: '#contact',
      contactLabel: 'Contact Us',
    },
    {
      id: 'rodby',
      name: 'Lalandia in Rødby',
      addressLines: ['Lalandia Centret 1', 'DK-4970 Rødby'],
      cvr: '2708 4303',
      ean: '5790001865832',
      phoneDisplay: '+45 5461 0500',
      phoneTel: '+4554610500',
      contactHref: '#contact',
      contactLabel: 'Contact Us',
    },
  ],
  bookHeadline: 'Book a holiday',
  bookText: 'Book online or call us on',
  bookPhoneDisplay: '+45 5461 0500',
  bookPhoneTel: '+4554610500',
  bookCtaLabel: 'Book online',
  bookCtaHref: '#book',
  socialLinks: [
    { id: 'fb', label: 'Facebook', href: 'https://www.facebook.com/Lalandia', icon: 'facebook' },
    { id: 'ig', label: 'Instagram', href: 'http://instagram.com/lalandia', icon: 'instagram' },
    { id: 'yt', label: 'YouTube', href: 'https://www.youtube.com/user/lalandiadk', icon: 'youtube' },
    { id: 'mail', label: 'Email', href: 'mailto:lalandia@lalandia.dk', icon: 'newsletter' },
  ],
  logoSrc: '/lalandia-logo.svg',
  logoAlt: 'Lalandia',
  logoHref: '/',
  legalCompany: 'Lalandia A/S',
  privacyLabel: 'Personal data policy at lalandia.dk',
  privacyHref: '/en/privacy/personal-data-policy',
  cookiesLabel: 'Cookies',
  cookiesHref: '/en/privacy/cookies',
};
