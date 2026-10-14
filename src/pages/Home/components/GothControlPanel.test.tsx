import React from 'react';
import { render, screen } from '@testing-library/react';
import { toast } from 'react-toastify';
import GothControlPanel from './GothControlPanel';

// CRA enables resetMocks, so the toast mock uses plain functions.
jest.mock('react-toastify', () => ({
  ToastContainer: () => null,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('GothControlPanel', () => {
  const play = jest.fn();
  const audioCtor = jest.fn();
  const originalAudio = window.Audio;

  const baseProps = () => ({
    enablePlaySound: true,
    setEnablePlaySound: jest.fn(),
    enableAIVoice: false,
    setEnableAIVoice: jest.fn(),
    onConvert: null as { success: boolean } | null,
    gothSentence: '',
    setGothSentence: jest.fn(),
    onExportAchievements: jest.fn(),
    onImportAchievements: jest.fn(),
    achievements: { unlocked: [], images: [] },
    setAchievements: jest.fn(),
  });

  beforeEach(() => {
    play.mockReset();
    audioCtor.mockReset();
    window.Audio = function (this: object, src: string) {
      audioCtor(src);
      return { play, volume: 1 };
    } as unknown as typeof Audio;
  });

  afterAll(() => {
    window.Audio = originalAudio;
  });

  test('renders the sound/voice controls', () => {
    render(<GothControlPanel {...baseProps()} />);
    expect(screen.getByLabelText('Play Sound')).toBeInTheDocument();
  });

  test('picks a sentence, plays the success sound and toasts on success', () => {
    const props = baseProps();
    render(<GothControlPanel {...props} onConvert={{ success: true }} />);
    expect(props.setGothSentence).toHaveBeenCalledWith(expect.any(String));
    expect(audioCtor).toHaveBeenCalledWith('/sounds/success.mp3');
    expect(play).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('plays the fail sound and toasts an error on failure', () => {
    const props = baseProps();
    render(<GothControlPanel {...props} onConvert={{ success: false }} />);
    expect(props.setGothSentence).toHaveBeenCalledWith(expect.any(String));
    expect(audioCtor).toHaveBeenCalledWith('/sounds/fail.mp3');
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.success).not.toHaveBeenCalled();
  });

  test('stays silent when sound is disabled', () => {
    render(<GothControlPanel {...baseProps()} enablePlaySound={false} onConvert={{ success: true }} />);
    expect(play).not.toHaveBeenCalled();
  });
});
