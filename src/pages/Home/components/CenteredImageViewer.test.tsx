import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CenteredImageViewer, { CenteredImageViewerProps } from './CenteredImageViewer';

describe('CenteredImageViewer', () => {
  const mockOnClose = jest.fn();
  const imageUrl = 'test-image.jpg';

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('renders the image viewer when isOpen is true and imageUrl is provided', () => {
    render(<CenteredImageViewer isOpen={true} imageUrl={imageUrl} onClose={mockOnClose} />);
    const image = screen.getByAltText('Centered Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', imageUrl);
  });

  test('does not render the image viewer when isOpen is false', () => {
    render(<CenteredImageViewer isOpen={false} imageUrl={imageUrl} onClose={mockOnClose} />);
    expect(screen.queryByAltText('Centered Image')).toBeNull();
  });

  test('does not render the image viewer when imageUrl is not provided', () => {
    render(<CenteredImageViewer isOpen={true} imageUrl="" onClose={mockOnClose} />);
    expect(screen.queryByAltText('Centered Image')).toBeNull();
  });

  test('calls onClose when the viewer is clicked', () => {
    render(<CenteredImageViewer isOpen={true} imageUrl={imageUrl} onClose={mockOnClose} />);
    const viewerBox = screen.getByAltText('Centered Image').closest('div'); // Find the parent Box element
    if (viewerBox) {
      fireEvent.click(viewerBox);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    } else {
      throw new Error("Viewer box not found");
    }
  });
});