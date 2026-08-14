import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { Default as StandardPromo } from '../../../components/standard-promo/StandardPromo';
import {
  mockStandardPromoProps,
  mockStandardPromoPropsEmpty,
  mockStandardPromoPropsEditing,
  mockStandardPromoPropsImageLeft,
} from './StandardPromo.mockProps';

jest.mock('next/link', () => {
  return ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

jest.mock('components/content-sdk/CompatibleLink', () => ({
  CompatibleLink: ({
    field,
    children,
    ...props
  }: {
    field?: { value?: { href?: string; text?: string } };
    children?: React.ReactNode;
  }) => (
    <a href={field?.value?.href || '#'} {...props}>
      {children || field?.value?.text || ''}
    </a>
  ),
}));

const getRoot = () => document.querySelector('.standard-promo');

describe('StandardPromo Component should', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('render without crashing', () => {
    render(<StandardPromo {...mockStandardPromoProps} />);
    expect(getRoot()).toBeInTheDocument();
  });

  it('apply correct CSS classes and id', () => {
    render(<StandardPromo {...mockStandardPromoProps} />);
    expect(getRoot()).toHaveClass('component', 'standard-promo', 'standardpromo-styles');
    expect(getRoot()).toHaveAttribute('id', 'standard-promo-test-id');
  });

  it('render title, body, and CTA', () => {
    render(<StandardPromo {...mockStandardPromoProps} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Helsinki Festival/i);
    expect(screen.getByText(/tickets are on sale/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Read more and buy tickets/i })).toHaveAttribute(
      'href',
      '/programme'
    );
  });

  it('render carousel images and rotation controls', () => {
    render(<StandardPromo {...mockStandardPromoProps} />);
    expect(screen.getByAltText('Promo one')).toBeInTheDocument();
    expect(screen.getByAltText('Promo two')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show image 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show image 2' })).toBeInTheDocument();
  });

  it('auto-rotate images over time', () => {
    render(<StandardPromo {...mockStandardPromoProps} />);
    const firstSlide = screen.getByAltText('Promo one').parentElement;
    const secondSlide = screen.getByAltText('Promo two').parentElement;
    expect(firstSlide).toHaveClass('opacity-100');
    expect(secondSlide).toHaveClass('opacity-0');

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(firstSlide).toHaveClass('opacity-0');
    expect(secondSlide).toHaveClass('opacity-100');
  });

  it('place media on the left when imageOnLeft is set', () => {
    render(<StandardPromo {...mockStandardPromoPropsImageLeft} />);
    expect(getRoot()).toHaveClass('standard-promo--image-left');
    const columns = getRoot()?.querySelectorAll(':scope > div > div > div');
    expect(columns?.[0]).toHaveClass('md:order-2');
    expect(columns?.[1]).toHaveClass('md:order-1');
  });

  it('fall back to festival copy when datasource is missing', () => {
    render(<StandardPromo {...mockStandardPromoPropsEmpty} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Helsinki Festival/i);
    expect(screen.getByRole('link', { name: /Read more and buy tickets/i })).toBeInTheDocument();
  });

  it('show authoring hint in editing mode without datasource', () => {
    render(<StandardPromo {...mockStandardPromoPropsEditing} />);
    expect(screen.getByText(/configure title, body, CTA, images/i)).toBeInTheDocument();
  });
});
