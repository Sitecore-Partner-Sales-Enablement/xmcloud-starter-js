import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as TimePromo } from '../../../components/time-promo/TimePromo';
import {
  mockTimePromoProps,
  mockTimePromoPropsEmpty,
  mockTimePromoPropsEditing,
} from './TimePromo.mockProps';

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

const getRoot = () => document.querySelector('.time-promo');

describe('TimePromo Component should', () => {
  it('render without crashing', () => {
    render(<TimePromo {...mockTimePromoProps} />);
    expect(getRoot()).toBeInTheDocument();
  });

  it('apply correct CSS classes and id', () => {
    render(<TimePromo {...mockTimePromoProps} />);
    expect(getRoot()).toHaveClass('component', 'time-promo', 'timepromo-styles');
    expect(getRoot()).toHaveAttribute('id', 'time-promo-test-id');
  });

  it('render heading and body copy', () => {
    render(<TimePromo {...mockTimePromoProps} />);
    expect(
      screen.getByText(/Night of the Arts once again brings together hundreds of art events/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Every Night of the Arts is different/i)).toBeInTheDocument();
  });

  it('render the CTA link', () => {
    render(<TimePromo {...mockTimePromoProps} />);
    expect(
      screen.getByRole('link', { name: /Read more and submit your event/i })
    ).toHaveAttribute('href', '/taiteidenyo/en/');
  });

  it('render time and tickets details', () => {
    render(<TimePromo {...mockTimePromoProps} />);
    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(screen.getByText('20.8.2026')).toBeInTheDocument();
    expect(screen.getByText('Tickets:')).toBeInTheDocument();
    expect(screen.getByText('The event is free of charge')).toBeInTheDocument();
  });

  it('render hardcoded favourite button with white heart', () => {
    render(<TimePromo {...mockTimePromoProps} />);
    const button = screen.getByRole('button', { name: /Add as favourite/i });
    expect(button).toHaveClass('time-promo__favourite');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('fall back to Night of the Arts content when datasource is missing', () => {
    render(<TimePromo {...mockTimePromoPropsEmpty} />);
    expect(
      screen.getByText(/Night of the Arts once again brings together hundreds of art events/i)
    ).toBeInTheDocument();
    expect(screen.getByText('20.8.2026')).toBeInTheDocument();
    expect(screen.getByText('The event is free of charge')).toBeInTheDocument();
  });

  it('show authoring hint in editing mode without datasource', () => {
    render(<TimePromo {...mockTimePromoPropsEditing} />);
    expect(screen.getByText(/configure heading, body, CTA, time, and tickets/i)).toBeInTheDocument();
  });
});
