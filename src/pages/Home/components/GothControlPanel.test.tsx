import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GothControlPanel from './GothControlPanel';

// Note: CRA enables resetMocks, so factories use plain functions instead of jest.fn(impl).
jest.mock('./SoundAndVoiceControls', () => ({
  __esModule: true,
  default: () => <div data-testid="sound-voice-controls" />,
}));

jest.mock('./AchievementImportExport', () => ({
  __esModule: true,
  default: ({ onExport, onImport }: { onExport: () => void; onImport: (data: string) => void }) => (
    <div data-testid="achievement-import-export">
      <button onClick={onExport}>Export</button>
      <button onClick={() => onImport('mock data')}>Import</button>
    </div>
  ),
}));

describe('GothControlPanel', () => {
  const baseProps = () => ({
    enablePlaySound: false,
    setEnablePlaySound: jest.fn(),
    enableAIVoice: false,
    setEnableAIVoice: jest.fn(),
    onConvert: null,
    gothSentence: '',
    setGothSentence: jest.fn(),
    onExportAchievements: jest.fn(),
    onImportAchievements: jest.fn(),
    achievements: { unlocked: [] as string[], images: [] as string[] },
    setAchievements: jest.fn(),
  });

  test('renders the sound/voice controls and achievement import/export', () => {
    render(<GothControlPanel {...baseProps()} />);
    expect(screen.getByTestId('sound-voice-controls')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-import-export')).toBeInTheDocument();
  });

  test('does not set a sentence before any conversion', () => {
    const props = baseProps();
    render(<GothControlPanel {...props} />);
    expect(props.setGothSentence).not.toHaveBeenCalled();
  });

  test('sets a goth sentence after a conversion', () => {
    const props = { ...baseProps(), onConvert: { success: true } };
    render(<GothControlPanel {...props} />);
    expect(props.setGothSentence).toHaveBeenCalledTimes(1);
    expect(typeof (props.setGothSentence as jest.Mock).mock.calls[0][0]).toBe('string');
  });

  test('forwards export and import to the parent callbacks', () => {
    const props = baseProps();
    render(<GothControlPanel {...props} />);
    fireEvent.click(screen.getByText('Export'));
    expect(props.onExportAchievements).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Import'));
    expect(props.onImportAchievements).toHaveBeenCalledWith('mock data');
  });
});
