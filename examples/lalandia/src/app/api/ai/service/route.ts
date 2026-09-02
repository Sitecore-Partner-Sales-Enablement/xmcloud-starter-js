import { aiJsonResponse } from '@/lib/ai-json-response';

export const revalidate = 3600;

interface Service {
  name: string;
  description: string;
  category: string;
}

interface ServiceResponse {
  services: Service[];
  lastModified: string;
}

const services: Service[] = [
  {
    name: 'Holiday home booking',
    description:
      'Book family holiday homes at Lalandia centres in Søndervig, Billund and Rødby with online offers and packages.',
    category: 'Booking',
  },
  {
    name: 'Aquadome water parks',
    description:
      'Tropical indoor water parks with slides, pools and watery experiences for all ages at every Lalandia centre.',
    category: 'Attractions',
  },
  {
    name: 'Family activities',
    description:
      'Monky Tonky Land, bowling, padel, fitness, outdoor play and seasonal attractions such as Adventure World and Winter World.',
    category: 'Attractions',
  },
  {
    name: 'Restaurants and shopping',
    description:
      'Child-friendly restaurants and shops across centres, from Italian and American classics to café and retail outlets.',
    category: 'Hospitality',
  },
  {
    name: 'Offers and school holidays',
    description:
      'Long weekend, one-night-free and multi-night packages plus dedicated autumn, Christmas, winter, Easter and summer holiday stays.',
    category: 'Offers',
  },
  {
    name: 'Multi-locale content delivery',
    description:
      'Deliver localized content for guests (including English and other Nordic languages) via Sitecore XM Cloud and the Content SDK.',
    category: 'Localization',
  },
];

export async function GET() {
  const payload: ServiceResponse = {
    services,
    lastModified: new Date().toISOString(),
  };

  return aiJsonResponse(payload);
}
