import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GothControlPanel from "./GothControlPanel";
import { toast } from "react-toastify";

// CRA enables resetMocks, so factories use plain functions rather than jest.fn(impl).
jest.mock("./SoundAndVoiceControls", () => ({
  __esModule: true,
  default: () => <div data-testid="sound-voice-controls" />,
}));

jest.mock("./AchievementImportExport", () => ({
  __esModule: true,
  default: ({ onExport, onImport }: { onExport: () => void; onImport: (data: string) => void }) => (
    <div data-testid="achievement-import-export">
      <button onClick={onExport}>Export</button>
      <button onClick={() => onImport("mock data")}>Import</button>
    </div>
  ),
}));

jest.mock("react-toastify", () => ({
  ToastContainer: () => null,
  toast: { success: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

describe("GothControlPanel", () => {
  const setEnablePlaySound = jest.fn();
  const setEnableAIVoice = jest.fn();
  const setGothSentence = jest.fn();
  const setAchievements = jest.fn();
  const onExportAchievements = jest.fn();
  const onImportAchievements = jest.fn();
  const play = jest.fn();
  const audioCtor = jest.fn();
  const speak = jest.fn();
  const utteranceCtor = jest.fn();

  const defaultProps = {
    enablePlaySound: true,
    setEnablePlaySound,
    enableAIVoice: true,
    setEnableAIVoice,
    onConvert: null,
    gothSentence: "",
    setGothSentence,
    onExportAchievements,
    onImportAchievements,
    achievements: { unlocked: [], images: [] },
    setAchievements,
  };

  beforeEach(() => {
    window.Audio = function (src: string) {
      audioCtor(src);
      return { play, volume: 0 };
    } as unknown as typeof Audio;
    (window as any).SpeechSynthesisUtterance = function (text: string) {
      utteranceCtor(text);
      return { text };
    };
    (window as any).speechSynthesis = {
      speak,
      getVoices: () => [{ name: "Zira", voiceURI: "Zira", lang: "en-US", default: true, localService: true }],
      speaking: false,
      cancel: jest.fn(),
      onvoiceschanged: null,
    };
  });

  test("renders the sound controls and achievement import/export", () => {
    render(<GothControlPanel {...defaultProps} />);
    expect(screen.getByTestId("sound-voice-controls")).toBeInTheDocument();
    expect(screen.getByTestId("achievement-import-export")).toBeInTheDocument();
  });

  test("a successful conversion sets a sentence, plays the success sound, speaks and toasts", () => {
    const { rerender } = render(<GothControlPanel {...defaultProps} />);
    rerender(<GothControlPanel {...defaultProps} onConvert={{ success: true }} />);

    expect(setGothSentence).toHaveBeenCalledWith(expect.any(String));
    expect(audioCtor).toHaveBeenCalledWith("/sounds/success.mp3");
    expect(play).toHaveBeenCalledTimes(1);
    expect(speak).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.error).not.toHaveBeenCalled();
  });

  test("a failed conversion plays the fail sound and shows an error toast", () => {
    const { rerender } = render(<GothControlPanel {...defaultProps} />);
    rerender(<GothControlPanel {...defaultProps} onConvert={{ success: false }} />);

    expect(audioCtor).toHaveBeenCalledWith("/sounds/fail.mp3");
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.success).not.toHaveBeenCalled();
  });

  test("does not play sound when enablePlaySound is false", () => {
    render(<GothControlPanel {...defaultProps} enablePlaySound={false} onConvert={{ success: true }} />);
    expect(play).not.toHaveBeenCalled();
  });

  test("does not speak when enableAIVoice is false", () => {
    render(<GothControlPanel {...defaultProps} enableAIVoice={false} onConvert={{ success: true }} />);
    expect(speak).not.toHaveBeenCalled();
  });

  test("forwards export and import to the parent callbacks", () => {
    render(<GothControlPanel {...defaultProps} />);
    fireEvent.click(screen.getByText("Export"));
    expect(onExportAchievements).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText("Import"));
    expect(onImportAchievements).toHaveBeenCalledWith("mock data");
  });
});
