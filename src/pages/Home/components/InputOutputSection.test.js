import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputOutputSection from './InputOutputSection';

// Mock child components
jest.mock('./GothAchievementsGallery', () => ({
  __esModule: true,
  default: jest.fn(({ unlockedImages, onImageClick }) => (
    <div data-testid="goth-achievements-gallery">
      Goth Achievements Gallery
      <span>{unlockedImages.length} images</span>
      <button onClick={() => onImageClick('mock-image.jpg')}>Click Image</button>
    </div>
  )),
}));

jest.mock('./SentenceDisplay', () => ({
  __esModule: true,
  default: jest.fn(({ sentence }) => (
    <div data-testid="sentence-display">{sentence}</div>
  )),
}));


describe('InputOutputSection', () => {
  const mockHandleTextChange = jest.fn();
  const mockOnImageClick = jest.fn();

  const defaultProps = {
    text: 'initial input text',
    handleTextChange: mockHandleTextChange,
    formattedText: 'formatted output text',
    gothSentence: 'test goth sentence',
    unlockedImages: ['img1.jpg', 'img2.png'],
    onImageClick: mockOnImageClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and output textareas with correct placeholders and values', () => {
    render(<InputOutputSection {...defaultProps} />);

    const inputTextarea = screen.getByPlaceholderText('Paste your JSON here');
    const outputTextarea = screen.getByPlaceholderText('Formatted JSON');

    expect(inputTextarea).toBeInTheDocument();
    expect(outputTextarea).toBeInTheDocument();
    expect(inputTextarea).toHaveValue(defaultProps.text);
    expect(outputTextarea).toHaveValue(defaultProps.formattedText);
    expect(outputTextarea).toBeReadOnly();
  });

  test('renders GothAchievementsGallery and SentenceDisplay with correct props', () => {
    render(<InputOutputSection {...defaultProps} />);

    const gallery = screen.getByTestId('goth-achievements-gallery');
    const sentenceDisplay = screen.getByTestId('sentence-display');

    expect(gallery).toBeInTheDocument();
    expect(sentenceDisplay).toBeInTheDocument();

    // Check props passed to mocked components
    expect(gallery).toHaveTextContent(`${defaultProps.unlockedImages.length} images`);
    expect(sentenceDisplay).toHaveTextContent(defaultProps.gothSentence);

    // Check if the onImageClick prop is passed correctly (by triggering the mock's button)
    fireEvent.click(screen.getByText('Click Image'));
    expect(mockOnImageClick).toHaveBeenCalledTimes(1);
    expect(mockOnImageClick).toHaveBeenCalledWith('mock-image.jpg');
  });

  test('calls handleTextChange when input textarea value changes', () => {
    render(<InputOutputSection {...defaultProps} />);
    const inputTextarea = screen.getByPlaceholderText('Paste your JSON here');
    const newText = 'new input text';

    fireEvent.change(inputTextarea, { target: { value: newText } });

    expect(mockHandleTextChange).toHaveBeenCalledTimes(1);
    expect(mockHandleTextChange).toHaveBeenCalledWith(newText);
  });

  test('inserts a tab character and calls handleTextChange when Tab key is pressed in input textarea', () => {
    render(<InputOutputSection {...defaultProps} />);
    const inputTextarea = screen.getByPlaceholderText('Paste your JSON here');

    // Set selection range to simulate cursor position
    inputTextarea.setSelectionRange(defaultProps.text.length, defaultProps.text.length);

    fireEvent.keyDown(inputTextarea, { key: 'Tab', code: 'Tab', charCode: 9 });

    expect(mockHandleTextChange).toHaveBeenCalledTimes(1);
    expect(mockHandleTextChange).toHaveBeenCalledWith(defaultProps.text + '\t');
  });
});