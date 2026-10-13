import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SoundAndVoiceControls from './SoundAndVoiceControls';

describe('SoundAndVoiceControls', () => {
  const mockSetEnablePlaySound = jest.fn();
  const mockSetEnableAIVoice = jest.fn();

  const defaultProps = {
    enablePlaySound: true,
    setEnablePlaySound: mockSetEnablePlaySound,
    enableAIVoice: false,
    setEnableAIVoice: mockSetEnableAIVoice,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the "Play Sound" and "AI Voice" checkboxes', () => {
    render(<SoundAndVoiceControls {...defaultProps} />);
    expect(screen.getByLabelText('Play Sound')).toBeInTheDocument();
    expect(screen.getByLabelText('AI Voice (Goth & Sweet)')).toBeInTheDocument();
  });

  test('checkboxes are checked based on props', () => {
    const { rerender } = render(<SoundAndVoiceControls {...defaultProps} />);
    expect(screen.getByLabelText('Play Sound')).toBeChecked();
    expect(screen.getByLabelText('AI Voice (Goth & Sweet)')).not.toBeChecked();

    rerender(<SoundAndVoiceControls enablePlaySound={false} enableAIVoice={true} setEnablePlaySound={mockSetEnablePlaySound} setEnableAIVoice={mockSetEnableAIVoice} />);
    expect(screen.getByLabelText('Play Sound')).not.toBeChecked();
    expect(screen.getByLabelText('AI Voice (Goth & Sweet)')).toBeChecked();
  });

  test('calls setEnablePlaySound when "Play Sound" checkbox is clicked', () => {
    const { rerender } = render(<SoundAndVoiceControls {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Play Sound'));
    expect(mockSetEnablePlaySound).toHaveBeenCalledTimes(1);
    expect(mockSetEnablePlaySound).toHaveBeenLastCalledWith(false); // Toggling from true

    // The component is controlled, so re-render with the new prop before toggling back.
    rerender(<SoundAndVoiceControls {...defaultProps} enablePlaySound={false} />);
    fireEvent.click(screen.getByLabelText('Play Sound'));
    expect(mockSetEnablePlaySound).toHaveBeenCalledTimes(2);
    expect(mockSetEnablePlaySound).toHaveBeenLastCalledWith(true); // Toggling from false
  });

  test('calls setEnableAIVoice when "AI Voice" checkbox is clicked', () => {
    const { rerender } = render(<SoundAndVoiceControls {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('AI Voice (Goth & Sweet)'));
    expect(mockSetEnableAIVoice).toHaveBeenCalledTimes(1);
    expect(mockSetEnableAIVoice).toHaveBeenLastCalledWith(true); // Toggling from false

    rerender(<SoundAndVoiceControls {...defaultProps} enableAIVoice={true} />);
    fireEvent.click(screen.getByLabelText('AI Voice (Goth & Sweet)'));
    expect(mockSetEnableAIVoice).toHaveBeenCalledTimes(2);
    expect(mockSetEnableAIVoice).toHaveBeenLastCalledWith(false); // Toggling from true
  });
});