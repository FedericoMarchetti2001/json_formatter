import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { toast } from "react-toastify";
import GothControlPanel from "./GothControlPanel";

jest.mock("./SoundAndVoiceControls", () => ({
  __esModule: true,
  default: () => <div data-testid="sound-voice-controls" />,
}));

jest.mock("./AchievementImportExport", () => ({
  __esModule: true,
  default: ({ onExport, onImport }: { onExport: () => void; onImport: (data: string) => void }) => (
    <div>
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
  const setGothSentence = jest.fn();
  const onExportAchievements = jest.fn();
  const onImportAchievements = jest.fn();
  const setAchievements = jest.fn();

  const renderPanel = (props = {}) =>
    render(
      <GothControlPanel
        enablePlaySound={false}
        setEnablePlaySound={jest.fn()}
        enableAIVoice={false}
        setEnableAIVoice={jest.fn()}
        onConvert={null}
        gothSentence=""
        setGothSentence={setGothSentence}
        onExportAchievements={onExportAchievements}
        onImportAchievements={onImportAchievements}
        achievements={{ unlocked: [], images: [] }}
        setAchievements={setAchievements}
        {...props}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the sound and voice controls", () => {
    renderPanel();
    expect(screen.getByTestId("sound-voice-controls")).toBeInTheDocument();
  });

  test("sets a sentence and shows a success toast on successful conversion", () => {
    renderPanel({ onConvert: { success: true } });
    expect(setGothSentence).toHaveBeenCalledWith(expect.any(String));
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.error).not.toHaveBeenCalled();
  });

  test("sets a sentence and shows an error toast on failed conversion", () => {
    renderPanel({ onConvert: { success: false } });
    expect(setGothSentence).toHaveBeenCalledWith(expect.any(String));
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.success).not.toHaveBeenCalled();
  });

  test("forwards export and import to the parent callbacks", () => {
    renderPanel();
    fireEvent.click(screen.getByText("Export"));
    fireEvent.click(screen.getByText("Import"));
    expect(onExportAchievements).toHaveBeenCalledTimes(1);
    expect(onImportAchievements).toHaveBeenCalledWith("mock data");
  });
});
