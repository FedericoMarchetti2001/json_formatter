import React from 'react';
import { render, screen } from '@testing-library/react';
import BuiltByDevelopers from './index';

// Mock Material Kit components
jest.mock('components/MKBox', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="mkbox">{children}</div>,
}));
jest.mock('components/MKTypography', () => ({
  __esModule: true,
  default: ({ children, ...props }) => <div data-testid="mktypography" {...props}>{children}</div>,
}));
jest.mock('@mui/material/Icon', () => ({
  __esModule: true,
  default: ({ children }) => <span data-testid="mui-icon">{children}</span>,
}));
jest.mock('@mui/material/Container', () => ({
    __esModule: true,
    default: ({ children }) => <div data-testid="mui-container">{children}</div>,
  }));
  jest.mock('@mui/material/Grid', () => ({
    __esModule: true,
    default: ({ children }) => <div data-testid="mui-grid">{children}</div>,
  }));


describe('BuiltByDevelopers', () => {
  test('renders the correct text content and link', () => {
    render(<BuiltByDevelopers />);

    expect(screen.getByText('Built by developers')).toBeInTheDocument();
    expect(screen.getByText('Complex Documentation')).toBeInTheDocument();
    expect(screen.getByText(/From colors, cards, typography to complex elements/)).toBeInTheDocument();

    const linkElement = screen.getByText('Read docs').closest('div'); // Find the parent div with the link text
    expect(linkElement).toBeInTheDocument();
    // We can't directly check the href on the mocked component, but we can check for the text content.
    // A more advanced test would involve checking the props passed to the mocked MKTypography component.
  });
});