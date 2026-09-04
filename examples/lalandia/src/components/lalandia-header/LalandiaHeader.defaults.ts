/**
 * Hardcoded Lalandia header navigation — mirrors https://www.lalandia.dk/en
 * Swap for Sitecore fields via resolveHeaderModel() when content is authored.
 */

export type HeaderNavLink = {
  id: string;
  label: string;
  href: string;
  children?: HeaderNavLink[];
};

export type HeaderLanguage = {
  id: string;
  label: string;
  href: string;
  code: string;
};

export type HeaderModel = {
  logoSrc: string;
  logoAlt: string;
  logoHref: string;
  menuLabel: string;
  bookLabel: string;
  bookHref: string;
  currentLanguageCode: string;
  languages: HeaderLanguage[];
  items: HeaderNavLink[];
};

const centre = (id: string, label: string, href: string, exploring: HeaderNavLink[], rest: HeaderNavLink[]): HeaderNavLink => ({
  id,
  label,
  href,
  children: [
    {
      id: `${id}-exploring`,
      label: 'Go exploring',
      href: '#',
      children: exploring,
    },
    ...rest,
  ],
});

export const DEFAULT_HEADER: HeaderModel = {
  logoSrc: '/lalandia-logo.svg',
  logoAlt: 'Lalandia',
  logoHref: '/',
  menuLabel: 'Select centre',
  bookLabel: 'Book',
  bookHref: '#book',
  currentLanguageCode: 'en',
  languages: [
    { id: 'da', label: 'Dansk', href: '/da-dk', code: 'da' },
    { id: 'de', label: 'Deutsch', href: '/de-de', code: 'de' },
    { id: 'en', label: 'English', href: '/en', code: 'en' },
    { id: 'nb', label: 'Norsk', href: '/nb-no', code: 'nb' },
    { id: 'sv', label: 'Svenska', href: '/sv-se', code: 'sv' },
  ],
  items: [
    centre(
      'sondervig',
      'Søndervig',
      '/en/sondervig',
      [
        { id: 'sv-aquadome', label: 'The Aquadome™', href: '/en/sondervig/go-exploring/aquadome' },
        { id: 'sv-bowling', label: 'Bowling', href: '/en/sondervig/go-exploring/bowling' },
        { id: 'sv-padel', label: 'Padel', href: '/en/sondervig/go-exploring/padel' },
        { id: 'sv-minigolf', label: 'Mini-golf', href: '/en/sondervig/go-exploring/minigolf' },
        { id: 'sv-fitness', label: 'Fitness centre', href: '/en/sondervig/go-exploring/fitness-centre' },
        { id: 'sv-activities', label: 'Activities', href: '/en/sondervig/go-exploring/activities' },
        { id: 'sv-monky', label: 'Monky Tonky Land', href: '/en/sondervig/go-exploring/monky-tonky-land' },
        { id: 'sv-workshop', label: "Monky Tonky's Workshop", href: '/en/sondervig/go-exploring/monky-tonkys-workshop' },
        { id: 'sv-outdoors', label: 'Outdoors', href: '/en/sondervig/go-exploring/outdoors' },
        { id: 'sv-northsea', label: 'The North Sea', href: '/en/sondervig/go-exploring/the-north-sea' },
        { id: 'sv-trip', label: 'Take a trip', href: '/en/sondervig/go-exploring/take-a-trip' },
      ],
      [
        { id: 'sv-whats-on', label: "What's on", href: '/en/sondervig/whats-on' },
        { id: 'sv-homes', label: 'Holiday homes', href: '/en/sondervig/holiday-homes' },
        { id: 'sv-eat', label: 'Eat', href: '/en/sondervig/eat' },
        { id: 'sv-shop', label: 'Shopping', href: '/en/sondervig/shopping' },
        { id: 'sv-practical', label: 'Practical information', href: '/en/sondervig/practical-information' },
      ]
    ),
    centre(
      'billund',
      'Billund',
      '/en/billund',
      [
        { id: 'bi-aquadome', label: 'The Aquadome™', href: '/en/billund/go-exploring/the-aquadome' },
        { id: 'bi-winter', label: 'Winter World', href: '/en/billund/go-exploring/winter-world' },
        { id: 'bi-monky', label: 'Monky Tonky Land', href: '/en/billund/go-exploring/monky-tonky-land' },
        { id: 'bi-workshop', label: "Monky Tonky's Workshop", href: '/en/billund/go-exploring/monky-tonkys-workshop' },
        { id: 'bi-padel', label: 'Padel', href: '/en/billund/go-exploring/padel' },
        { id: 'bi-sport', label: 'Sport and fitness', href: '/en/billund/go-exploring/sport-and-fitness' },
        { id: 'bi-games', label: 'Games and bowling', href: '/en/billund/go-exploring/games-and-bowling' },
        { id: 'bi-entertainment', label: 'Entertainment', href: '/en/billund/go-exploring/entertainment' },
        { id: 'bi-adventure', label: 'Adventure Park', href: '/en/billund/go-exploring/adventure-park' },
        { id: 'bi-outdoors', label: 'Outdoors', href: '/en/billund/go-exploring/outdoors' },
        { id: 'bi-wellness', label: 'Wellness', href: '/en/billund/go-exploring/wellness' },
        { id: 'bi-legoland', label: 'LEGOLAND®', href: '/en/billund/go-exploring/legoland' },
      ],
      [
        { id: 'bi-whats-on', label: "What's on", href: '/en/billund/whats-on' },
        { id: 'bi-eat', label: 'Eat', href: '/en/billund/eat' },
        { id: 'bi-shop', label: 'Shopping', href: '/en/billund/shopping' },
        { id: 'bi-homes', label: 'Holiday homes', href: '/en/billund/holiday-homes' },
        { id: 'bi-practical', label: 'Practical information', href: '/en/billund/practical-information' },
      ]
    ),
    centre(
      'rodby',
      'Rødby',
      '/en/rodby',
      [
        { id: 'ro-aquadome', label: 'The Aquadome™', href: '/en/rodby/go-exploring/aquadome' },
        { id: 'ro-adventure', label: 'Adventure World', href: '/en/rodby/go-exploring/adventure-world' },
        { id: 'ro-monky', label: 'Monky Tonky Land', href: '/en/rodby/go-exploring/monky-tonky-land' },
        { id: 'ro-workshop', label: "Monky Tonky's Workshop", href: '/en/rodby/go-exploring/monky-tonkys-workshop' },
        { id: 'ro-padel', label: 'Padel', href: '/en/rodby/go-exploring/padel' },
        { id: 'ro-activities', label: 'Activities', href: '/en/rodby/go-exploring/activities' },
        { id: 'ro-fitness', label: 'Fitness centre', href: '/en/rodby/go-exploring/fitness-centre' },
        { id: 'ro-cinema', label: 'Cinema and entertainment', href: '/en/rodby/go-exploring/cinema-and-entertainment' },
        { id: 'ro-outdoors', label: 'Outdoors', href: '/en/rodby/go-exploring/outdoors' },
        { id: 'ro-beaches', label: 'Beaches', href: '/en/rodby/go-exploring/beaches' },
        { id: 'ro-trip', label: 'Take a trip', href: '/en/rodby/go-exploring/take-a-trip' },
      ],
      [
        { id: 'ro-whats-on', label: "What's on", href: '/en/rodby/whats-on' },
        { id: 'ro-eat', label: 'Eat', href: '/en/rodby/eat' },
        { id: 'ro-shop', label: 'Shopping', href: '/en/rodby/shopping' },
        { id: 'ro-homes', label: 'Holiday homes', href: '/en/rodby/holiday-homes' },
        { id: 'ro-practical', label: 'Practical information', href: '/en/rodby/practical-information' },
      ]
    ),
    {
      id: 'inspiration',
      label: 'Inspiration',
      href: '#',
      children: [
        { id: 'insp-waterpark', label: 'Waterpark', href: '/en/inspiration/waterpark' },
        { id: 'insp-tropical', label: 'Tropical holiday centre', href: '/en/inspiration/tropical-holiday-centre' },
        { id: 'insp-family', label: 'Family holiday', href: '/en/inspiration/family-holiday' },
        { id: 'insp-grandchildren', label: 'A holiday with the grandchildren', href: '/en/inspiration/a-holiday-with-the-grandchildren' },
        { id: 'insp-fun', label: 'Fun with Lalandia', href: '/en/inspiration/funwithlalandia' },
      ],
    },
    {
      id: 'offers',
      label: 'Offers',
      href: '#',
      children: [
        { id: 'off-prices', label: 'Prices and offers', href: '/en/prices' },
        { id: 'off-weekend', label: 'Long weekend offer', href: '/en/a-long-weekend-stay' },
        { id: 'off-mini', label: 'Mini-break', href: '/en/mini-break' },
        { id: 'off-one-free', label: 'Get one night free', href: '/en/get-one-night-free' },
        { id: 'off-5for3', label: '5 for 3', href: '/en/5-for-3' },
        { id: 'off-7for5', label: '7 for 5', href: '/en/7-for-5' },
        { id: 'off-combi', label: 'Combi-stay', href: '/en/combi-stay' },
      ],
    },
    {
      id: 'school-holidays',
      label: 'School holidays',
      href: '#',
      children: [
        { id: 'hol-autumn', label: 'Autumn holiday', href: '/en/autumn-holiday' },
        { id: 'hol-christmas', label: 'Christmas holiday', href: '/en/christmas-holiday' },
        { id: 'hol-newyear', label: 'New Year holiday', href: '/en/new-year-holiday' },
        { id: 'hol-winter', label: 'Winter holiday', href: '/en/winter-holiday' },
        { id: 'hol-easter', label: 'Easter holiday', href: '/en/easter-holiday' },
        { id: 'hol-ascension', label: 'Ascension Day', href: '/en/ascension-day' },
        { id: 'hol-whitsun', label: 'Whitsun holiday', href: '/en/whitsun-holiday' },
        { id: 'hol-summer', label: 'Summer holiday', href: '/en/summer-holiday' },
      ],
    },
  ],
};
