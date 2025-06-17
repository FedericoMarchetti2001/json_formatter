import React from 'react';
import { render, screen } from '@testing-library/react';
import ExampleCard from './index';

// Mock Material Kit components
jest.mock('components/MKBox', () => ({
  __esModule: true,
  default: ({ children, ...props }) => <div data-testid="mkbox" {...props}>{children}</div>,
}));
jest.mock('components/MKTypography', () => ({
  __esModule: true,
  default: ({ children, ...props }) => <span data-testid="mktypography" {...props}>{children}</span>,
}));

// Mock Material UI Tooltip
jest.mock('@mui/material/Tooltip', () => ({
    __esModule: true,
    default: ({ children, title }) => <div data-testid="tooltip" title={title}>{children}</div>,
  }));


describe('ExampleCard', () => {
  const defaultProps = {
    image: 'test-image.jpg',
    name: 'Test Card',
    count: 5,
    pro: false,
  };

  test('renders the image with correct src and alt attributes', () => {
    render(<ExampleCard {...defaultProps} />);
    const imageElement = screen.getByAltText(defaultProps.name);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', defaultProps.image);
  });

  test('renders the name and count when provided', () => {
    render(<ExampleCard {...defaultProps} />);
    expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
    expect(screen.getByText(`${defaultProps.count} Examples`)).toBeInTheDocument();
  });

  test('renders "Example" when count is 1', () => {
    render(<ExampleCard {...defaultProps} count={1} />);
    expect(screen.getByText('1 Example')).toBeInTheDocument();
  });


  test('renders the "Pro Element" tooltip and icon when pro is true', () => {
    render(<ExampleCard {...defaultProps} pro={true} />);
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute('title', 'Pro Element');
    // We can't directly check for the SVG icon, but we can check for the tooltip wrapper.
  });

  test('does not render the "Pro Element" tooltip when pro is false', () => {
    render(<ExampleCard {...defaultProps} pro={false} />);
    expect(screen.queryByTestId('tooltip')).toBeNull();
  });

  test('does not render the name and count section when name is empty and count is 0', () => {
    render(<ExampleCard {...defaultProps} name="" count={0} />);
    // Check that the parent container for name and count is not rendered
    const nameElement = screen.queryByText(defaultProps.name);
    const countElement = screen.queryByText(`${defaultProps.count} Examples`);
    expect(nameElement).toBeNull();
    expect(countElement).toBeNull();
  });
});