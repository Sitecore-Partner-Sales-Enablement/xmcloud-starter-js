import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as Hero } from '../../../components/hero/Hero';
import {
  mockHeroProps,
  mockHeroPropsCustomColors,
  mockHeroPropsEmpty,
  mockHeroPropsEditing,
} from './Hero.mockProps';

const getRoot = () => document.querySelector('.hero');

describe('Hero Component should', () => {
  it('render without crashing', () => {
    render(<Hero {...mockHeroProps} />);
    expect(getRoot()).toBeInTheDocument();
  });

  it('apply correct CSS classes and id', () => {
    render(<Hero {...mockHeroProps} />);
    expect(getRoot()).toHaveClass('component', 'hero', 'event-hero', 'hero-styles');
    expect(getRoot()).toHaveAttribute('id', 'hero-test-id');
  });

  it('render the title', () => {
    render(<Hero {...mockHeroProps} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Night of the Arts' })).toBeInTheDocument();
  });

  it('render the hero image', () => {
    render(<Hero {...mockHeroProps} />);
    expect(screen.getByAltText('Night festival lights')).toBeInTheDocument();
  });

  it('render the image caption', () => {
    render(<Hero {...mockHeroProps} />);
    expect(screen.getByText('Image: Pietari Purovaara')).toBeInTheDocument();
  });

  it('use default grey and white background colors', () => {
    render(<Hero {...mockHeroProps} />);
    const root = getRoot() as HTMLElement;
    const header = document.querySelector('.event-hero__header') as HTMLElement;
    expect(root).toHaveStyle({ backgroundColor: '#FFFFFF' });
    expect(header).toHaveStyle({ backgroundColor: '#E4E4E3' });
  });

  it('allow background colors to be changed via params', () => {
    render(<Hero {...mockHeroPropsCustomColors} />);
    const root = getRoot() as HTMLElement;
    const header = document.querySelector('.event-hero__header') as HTMLElement;
    expect(root).toHaveStyle({ backgroundColor: '#F5F5F5' });
    expect(header).toHaveStyle({ backgroundColor: '#008676' });
  });

  it('overlap the image onto the title band when an image is present', () => {
    render(<Hero {...mockHeroProps} />);
    const figure = document.querySelector('.event-hero__image');
    expect(figure).toHaveClass('-mt-[210px]');
  });

  it('use fallback image when fields are missing', () => {
    render(<Hero {...mockHeroPropsEmpty} />);
    expect(getRoot()).toBeInTheDocument();
    expect(screen.getByAltText('Night of the Arts')).toHaveAttribute(
      'src',
      '/hero/night-of-the-arts.png'
    );
  });

  it('show authoring title hint in editing mode without datasource', () => {
    render(<Hero {...mockHeroPropsEditing} />);
    expect(screen.getByText(/Hero: add a title/i)).toBeInTheDocument();
    expect(screen.getByAltText('Night of the Arts')).toBeInTheDocument();
  });
});
