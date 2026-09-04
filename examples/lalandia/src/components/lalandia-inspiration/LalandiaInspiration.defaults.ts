/**
 * Preview defaults — mirrors the Inspiration spot-carousel on
 * https://www.lalandia.dk/en/inspiration/waterpark
 */
export const DEFAULT_INSPIRATION = {
  title: 'Inspiration',
  items: [
    {
      title: 'Waterpark for all the family',
      text: 'Splashing around in water, wellness and fantastically fun water slides',
      imageSrc: '/slider/slide1.jpg',
      imageAlt: 'Waterpark for all the family',
      ctaText: 'Read more here',
      ctaHref: '/en/inspiration/waterpark',
    },
    {
      title: 'Tropical holiday centre with everything under one roof',
      text: 'Go exploring together',
      imageSrc: '/slider/slide2.jpg',
      imageAlt: 'Tropical holiday centre',
      ctaText: 'Read more here',
      ctaHref: '/en/inspiration/tropical-holiday-centre',
    },
    {
      title: 'Family holiday',
      text: 'Time to spend together',
      imageSrc: '/slider/slide3.jpg',
      imageAlt: 'Family holiday',
      ctaText: 'Read more here',
      ctaHref: '/en/inspiration/family-holiday',
    },
    {
      title: 'A holiday with the grandchildren',
      text: 'A world of fun and time together',
      imageSrc: '/slider/slide1.jpg',
      imageAlt: 'A holiday with the grandchildren',
      ctaText: 'Read more here',
      ctaHref: '/en/inspiration/a-holiday-with-the-grandchildren',
    },
  ],
  /** Autoplay interval when more than one tile (ms). Live site uses timer. */
  autoRotateIntervalMs: 6000,
};
