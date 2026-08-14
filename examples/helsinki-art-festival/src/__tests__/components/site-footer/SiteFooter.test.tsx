import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as SiteFooter } from '../../../components/site-footer/SiteFooter';
import {
  mockSiteFooterProps,
  mockSiteFooterPropsEmpty,
  mockSiteFooterPropsEditing,
} from './SiteFooter.mockProps';

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

const getRoot = () => document.querySelector('.site-footer');

describe('SiteFooter Component should', () => {
  it('render without crashing', () => {
    render(<SiteFooter {...mockSiteFooterProps} />);
    expect(getRoot()).toBeInTheDocument();
  });

  it('apply correct CSS classes and id', () => {
    render(<SiteFooter {...mockSiteFooterProps} />);
    expect(getRoot()).toHaveClass('component', 'site-footer', 'sitefooter-styles');
    expect(getRoot()).toHaveAttribute('id', 'site-footer-test-id');
  });

  it('render primary navigation links', () => {
    render(<SiteFooter {...mockSiteFooterProps} />);
    expect(screen.getAllByText('Programme').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tickets').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Huvila').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Media').length).toBeGreaterThan(0);
  });

  it('render secondary navigation links', () => {
    render(<SiteFooter {...mockSiteFooterProps} />);
    expect(screen.getByText('Contact information')).toBeInTheDocument();
    expect(screen.getByText('Industry Accreditation')).toBeInTheDocument();
    expect(screen.getByText('Art Gifts: Open Source')).toBeInTheDocument();
  });

  it('render social links', () => {
    render(<SiteFooter {...mockSiteFooterProps} />);
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
    expect(screen.getByText('TikTok')).toBeInTheDocument();
  });

  it('render cookie settings control', () => {
    render(<SiteFooter {...mockSiteFooterProps} />);
    expect(screen.getByRole('button', { name: 'Cookie settings' })).toBeInTheDocument();
  });

  it('use mint footer background class', () => {
    render(<SiteFooter {...mockSiteFooterProps} />);
    expect(getRoot()).toHaveClass('bg-bg-footer');
  });

  it('fall back to festival links when datasource is missing', () => {
    render(<SiteFooter {...mockSiteFooterPropsEmpty} />);
    expect(screen.getAllByText('Info').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Programme').length).toBeGreaterThan(0);
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });

  it('render default Helsinki and Sustainable Travel Finland logos', () => {
    render(<SiteFooter {...mockSiteFooterPropsEmpty} />);
    expect(screen.getByAltText('Helsinki')).toHaveAttribute('src', '/logos/helsinki.svg');
    expect(screen.getByAltText('Sustainable Travel Finland')).toHaveAttribute(
      'src',
      '/logos/sustainable-travel-finland.png'
    );
  });

  it('show authoring hint in editing mode without datasource', () => {
    render(<SiteFooter {...mockSiteFooterPropsEditing} />);
    expect(screen.getByText(/configure primary links/i)).toBeInTheDocument();
  });
});
