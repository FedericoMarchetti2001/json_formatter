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
    render(<SoundAndVoiceControls {...defaultProps} />);
    expect(screen.getByLabelText('Play Sound')).toBeChecked();
    expect(screen.getByLabelText('AI Voice (Goth & Sweet)')).not.toBeChecked();

    render(<SoundAndVoiceControls enablePlaySound={false} enableAIVoice={true} setEnablePlaySound={mockSetEnablePlaySound} setEnableAIVoice={mockSetEnableAIVoice} />);
    expect(screen.getByLabelText('Play Sound')).not.toBeChecked();
    expect(screen.getByLabelText('AI Voice (Goth & Sweet)')).toBeChecked();
  });

  test('calls setEnablePlaySound when "Play Sound" checkbox is clicked', () => {
    render(<SoundAndVoiceControls {...defaultProps} />);
    const playSoundCheckbox = screen.getByLabelText('Play Sound');

    fireEvent.click(playSoundCheckbox);
    expect(mockSetEnablePlaySound).toHaveBeenCalledTimes(1);
    expect(mockSetEnablePlaySound).toHaveBeenCalledWith(false); // Toggling from true

    fireEvent.click(playSoundCheckbox);
    expect(mockSetEnablePlaySound).toHaveBeenCalledTimes(2);
    expect(mockSetEnablePlaySound).toHaveBeenCalledWith(true); // Toggling from false
  });

  test('calls setEnableAIVoice when "AI Voice" checkbox is clicked', () => {
    render(<SoundAndVoiceControls {...defaultProps} />);
    const aiVoiceCheckbox = screen.getByLabelText('AI Voice (Goth & Sweet)');

    fireEvent.click(aiVoiceCheckbox);
    expect(mockSetEnableAIVoice).toHaveBeenCalledTimes(1);
    expect(mockSetEnableAIVoice).toHaveBeenCalledWith(true); // Toggling from false

    fireEvent.click(aiVoiceCheckbox);
    expect(mockSetEnableAIVoice).toHaveBeenCalledTimes(2);
    expect(mockSetEnableAIVoice).toHaveBeenCalledWith(false); // Toggling from true
  });
});