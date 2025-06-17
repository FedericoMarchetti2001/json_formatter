import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GothAchievementsGallery from './GothAchievementsGallery';

describe('GothAchievementsGallery', () => {
  const mockOnImageClick = jest.fn();

  beforeEach(() => {
    mockOnImageClick.mockClear();
  });

  test('renders the title', () => {
    render(<GothAchievementsGallery unlockedImages={[]} onImageClick={mockOnImageClick} />);
    expect(screen.getByText('Unlocked Goth Girls')).toBeInTheDocument();
  });

  test('renders images when unlockedImages is not empty', () => {
    const unlockedImages = ['image1.jpg', 'image2.png'];
    render(<GothAchievementsGallery unlockedImages={unlockedImages} onImageClick={mockOnImageClick} />);

    const images = screen.getAllByRole('img');
    expect(images.length).toBe(unlockedImages.length);

    images.forEach((img, index) => {
      expect(img).toHaveAttribute('src', unlockedImages[index]);
      expect(img).toHaveAttribute('alt', `Unlocked Goth Girl ${index + 1}`);
    });
  });

  test('calls onImageClick with the correct image path when an image is clicked', () => {
    const unlockedImages = ['image1.jpg'];
    render(<GothAchievementsGallery unlockedImages={unlockedImages} onImageClick={mockOnImageClick} />);

    const image = screen.getByAltText('Unlocked Goth Girl 1');
    fireEvent.click(image);

    expect(mockOnImageClick).toHaveBeenCalledTimes(1);
    expect(mockOnImageClick).toHaveBeenCalledWith('image1.jpg');
  });

  test('renders the "no goth girls unlocked" message when unlockedImages is empty', () => {
    render(<GothAchievementsGallery unlockedImages={[]} onImageClick={mockOnImageClick} />);
    expect(screen.getByText('No goth girls unlocked yet. Format some JSON!')).toBeInTheDocument();
  });
});