import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as TopNavigation } from '../../../components/top-navigation/TopNavigation';
import {
  mockTopNavigationProps,
  mockTopNavigationPropsEmpty,
  mockTopNavigationPropsEditing,
} from './TopNavigation.mockProps';

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

const getRoot = () => document.querySelector('.top-navigation');

describe('TopNavigation Component should', () => {
  it('render without crashing', () => {
    render(<TopNavigation {...mockTopNavigationProps} />);
    expect(getRoot()).toBeInTheDocument();
  });

  it('apply correct CSS classes and id', () => {
    render(<TopNavigation {...mockTopNavigationProps} />);
    expect(getRoot()).toHaveClass('component', 'top-navigation', 'topnav-styles');
    expect(getRoot()).toHaveAttribute('id', 'top-navigation-test-id');
  });

  it('render primary navigation links from datasource', () => {
    render(<TopNavigation {...mockTopNavigationProps} />);
    expect(screen.getAllByText('Info').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Programme').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tickets').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Huvila').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Responsibility').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Media').length).toBeGreaterThan(0);
  });

  it('render brand/home link', () => {
    render(<TopNavigation {...mockTopNavigationProps} />);
    expect(screen.getByLabelText('Helsinki Art Festival')).toBeInTheDocument();
  });

  it('render skip to content link', () => {
    render(<TopNavigation {...mockTopNavigationProps} />);
    expect(screen.getByText('Skip to content')).toHaveAttribute('href', '#content');
  });

  it('toggle language menu', () => {
    render(<TopNavigation {...mockTopNavigationProps} />);
    const languageButton = screen.getAllByRole('button', { name: /Language: EN|Select language/i })[0];
    fireEvent.click(languageButton);
    expect(screen.getAllByText('Suomi').length).toBeGreaterThan(0);
    expect(screen.getAllByText('English').length).toBeGreaterThan(0);
  });

  it('toggle search panel', () => {
    render(<TopNavigation {...mockTopNavigationProps} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Search' })[0]);
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('fall back to festival nav labels when datasource is missing', () => {
    render(<TopNavigation {...mockTopNavigationPropsEmpty} />);
    expect(screen.getAllByText('Info').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Programme').length).toBeGreaterThan(0);
  });

  it('use an inline data-uri logo when no Sitecore logo is configured', () => {
    render(<TopNavigation {...mockTopNavigationPropsEmpty} />);
    const brand = screen.getByLabelText('Helsinki Art Festival');
    const img = brand.querySelector('img');
    expect(img?.getAttribute('src')).toMatch(/^data:image\/png;base64,/);
  });

  it('show authoring hint in editing mode without datasource', () => {
    render(<TopNavigation {...mockTopNavigationPropsEditing} />);
    expect(screen.getByText(/configure logo, navigation links/i)).toBeInTheDocument();
  });
});
