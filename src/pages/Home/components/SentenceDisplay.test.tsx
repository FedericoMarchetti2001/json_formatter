import React from 'react';
import { render, screen } from '@testing-library/react';
import SentenceDisplay from './SentenceDisplay';

describe('SentenceDisplay', () => {
  test('renders the provided sentence', () => {
    const testSentence = 'This is a test sentence.';
    render(<SentenceDisplay sentence={testSentence} />);
    expect(screen.getByText(testSentence)).toBeInTheDocument();
  });

  test('renders an empty string if no sentence is provided', () => {
    render(<SentenceDisplay sentence="" />);
    expect(screen.getByText('')).toBeInTheDocument();
  });
});