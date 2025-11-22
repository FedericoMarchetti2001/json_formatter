// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import GothControlPanel from './GothControlPanel';
// import { toast } from 'react-toastify';

// // Mock child components
// jest.mock('./SoundAndVoiceControls', () => ({
//   __esModule: true,
//   default: jest.fn(({ enablePlaySound, setEnablePlaySound, enableAIVoice, setEnableAIVoice }: { enablePlaySound: boolean; setEnablePlaySound: (value: boolean) => void; enableAIVoice: boolean; setEnableAIVoice: (value: boolean) => void }) => (
//     <div data-testid="sound-voice-controls">
//       Sound and Voice Controls
//       <button onClick={() => setEnablePlaySound(!enablePlaySound)}>Toggle Sound</button>
//       <button onClick={() => setEnableAIVoice(!enableAIVoice)}>Toggle Voice</button>
//     </div>
//   )),
// }));

// jest.mock('./AchievementImportExport', () => ({
//   __esModule: true,
//   default: jest.fn(({ onExport, onImport }: { onExport: () => void; onImport: (data: string) => void }) => (
//     <div data-testid="achievement-import-export">
//       Achievement Import Export
//       <button onClick={onExport}>Export</button>
//       <button onClick={() => onImport('mock data')}>Import</button>
//     </div>
//   )),
// }));

// // Mock react-toastify
// jest.mock('react-toastify', () => ({
//   ...jest.requireActual('react-toastify'),
//   toast: {
//     success: jest.fn(),
//     error: jest.fn(),
//   },
// }));

// // Mock browser APIs for sound and speech
// const mockPlay = jest.fn();
// const mockAudio = jest.fn().mockImplementation(() => ({
//   play: mockPlay,
//   volume: 0.5, // Default volume
//   // Add other audio properties/methods if needed by the component
//   pause: jest.fn(),
//   addEventListener: jest.fn(),
//   removeEventListener: jest.fn(),
//   dispatchEvent: jest.fn(),
// }));
// Object.defineProperty(window, 'Audio', { value: mockAudio });

// const mockSpeak = jest.fn();
// const mockGetVoices = jest.fn().mockReturnValue([
//   { name: 'Google US English', lang: 'en-US', default: true, localService: false, voiceURI: 'Google US English' },
//   { name: 'Microsoft Zira - English (United States)', lang: 'en-US', default: false, localService: true, voiceURI: 'Microsoft Zira - English (United States)' },
// ]);
// const mockSpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({ text, onend: null, onerror: null }));
// Object.defineProperty(window, 'speechSynthesis', {
//   value: {
//     speak: mockSpeak,
//     getVoices: mockGetVoices,
//     speaking: false,
//     pending: false,
//     paused: false,
//     onvoiceschanged: null,
//     cancel: jest.fn(),
//     pause: jest.fn(),
//     resume: jest.fn(),
//     addEventListener: jest.fn(),
//     removeEventListener: jest.fn(),
//     dispatchEvent: jest.fn(),
//   },
// });
// Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: mockSpeechSynthesisUtterance });


// describe('GothControlPanel', () => {
//   const mockSetEnablePlaySound = jest.fn();
//   const mockSetEnableAIVoice = jest.fn();
//   const mockSetGothSentence = jest.fn();
//   const mockOnExportAchievements = jest.fn();
//   const mockOnImportAchievements = jest.fn();

//   const defaultProps = {
//     enablePlaySound: true,
//     setEnablePlaySound: mockSetEnablePlaySound,
//     enableAIVoice: true,
//     setEnableAIVoice: mockSetEnableAIVoice,
//     onConvert: null,
//     gothSentence: '',
//     setGothSentence: mockSetGothSentence,
//     onExportAchievements: mockOnExportAchievements,
//     onImportAchievements: mockOnImportAchievements,
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('renders SoundAndVoiceControls and AchievementImportExport components', () => {
//     render(<GothControlPanel {...defaultProps} />);
//     expect(screen.getByTestId('sound-voice-controls')).toBeInTheDocument();
//     expect(screen.getByTestId('achievement-import-export')).toBeInTheDocument();
//   });

//   test('calls setGothSentence with a success sentence and plays success sound and speaks sentence on successful conversion', () => {
//     const { rerender } = render(<GothControlPanel {...defaultProps} onConvert={null} />);

//     // Simulate a successful conversion
//     rerender(<GothControlPanel {...defaultProps} onConvert={{ success: true }} />);

//     expect(mockSetGothSentence).toHaveBeenCalledWith(expect.any(String));
//     expect(mockPlay).toHaveBeenCalledTimes(1);
//     expect(mockAudio).toHaveBeenCalledWith('/sounds/success.mp3');
//     expect(mockSpeak).toHaveBeenCalledTimes(1);
//     expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith(expect.any(String));
//     expect(toast.success).toHaveBeenCalledTimes(1);
//     expect(toast.error).not.toHaveBeenCalled();
//   });

//   test('calls setGothSentence with a failure sentence and plays fail sound and speaks sentence on failed conversion', () => {
//     const { rerender } = render(<GothControlPanel {...defaultProps} onConvert={null} />);

//     // Simulate a failed conversion
//     rerender(<GothControlPanel {...defaultProps} onConvert={{ success: false }} />);

//     expect(mockSetGothSentence).toHaveBeenCalledWith(expect.any(String));
//     expect(mockPlay).toHaveBeenCalledTimes(1);
//     expect(mockAudio).toHaveBeenCalledWith('/sounds/fail.mp3');
//     expect(mockSpeak).toHaveBeenCalledTimes(1);
//     expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith(expect.any(String));
//     expect(toast.error).toHaveBeenCalledTimes(1);
//     expect(toast.success).not.toHaveBeenCalled();
//   });

//   test('does not play sound if enablePlaySound is false', () => {
//     const { rerender } = render(<GothControlPanel {...defaultProps} enablePlaySound={false} onConvert={null} />);

//     // Simulate a successful conversion
//     rerender(<GothControlPanel {...defaultProps} enablePlaySound={false} onConvert={{ success: true }} />);

//     expect(mockPlay).not.toHaveBeenCalled();
//   });

//   test('does not speak sentence if enableAIVoice is false', () => {
//     const { rerender } = render(<GothControlPanel {...defaultProps} enableAIVoice={false} onConvert={null} />);

//     // Simulate a successful conversion
//     rerender(<GothControlPanel {...defaultProps} enableAIVoice={false} onConvert={{ success: true }} />);

//     expect(mockSpeak).not.toHaveBeenCalled();
//   });

//   test('calls onExportAchievements when Export button in child component is clicked', () => {
//     render(<GothControlPanel {...defaultProps} />);
//     fireEvent.click(screen.getByText('Export'));
//     expect(mockOnExportAchievements).toHaveBeenCalledTimes(1);
//   });

//   test('calls onImportAchievements when Import button in child component is clicked', () => {
//     render(<GothControlPanel {...defaultProps} />);
//     fireEvent.click(screen.getByText('Import'));
//     expect(mockOnImportAchievements).toHaveBeenCalledTimes(1);
//     expect(mockOnImportAchievements).toHaveBeenCalledWith('mock data');
//   });
// });