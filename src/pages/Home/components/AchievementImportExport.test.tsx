import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AchievementImportExport from './AchievementImportExport';

describe('AchievementImportExport', () => {
  const mockOnExport = jest.fn();
  const mockOnImport = jest.fn();

  beforeEach(() => {
    mockOnExport.mockClear();
    mockOnImport.mockClear();
  });

  // Replace FileReader.readAsText so it synchronously "reads" the given content and fires onload.
  const mockFileReaderContent = (content: string) =>
    jest.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function (this: FileReader) {
      this.onload?.({ target: { result: content } } as unknown as ProgressEvent<FileReader>);
    });

  const getFileInput = (container: HTMLElement) =>
    container.querySelector('#import-achievements-button') as HTMLInputElement;

  test('renders export and import buttons', () => {
    render(<AchievementImportExport onExport={mockOnExport} onImport={mockOnImport} />);

    expect(screen.getByText('Export Achievements')).toBeInTheDocument();
    expect(screen.getByText('Import Achievements')).toBeInTheDocument();
  });

  test('calls onExport when Export Achievements button is clicked', () => {
    render(<AchievementImportExport onExport={mockOnExport} onImport={mockOnImport} />);
    fireEvent.click(screen.getByText('Export Achievements'));
    expect(mockOnExport).toHaveBeenCalledTimes(1);
  });

  test('calls onImport with parsed content when a valid JSON file is selected', async () => {
    const { container } = render(<AchievementImportExport onExport={mockOnExport} onImport={mockOnImport} />);
    const fileInput = getFileInput(container);

    const validJsonFile = new File(['{"key": "value"}'], 'achievements.json', { type: 'application/json' });
    const fileReaderSpy = mockFileReaderContent('{"key": "value"}');

    fireEvent.change(fileInput, { target: { files: [validJsonFile] } });

    expect(fileReaderSpy).toHaveBeenCalledWith(validJsonFile);
    expect(mockOnImport).toHaveBeenCalledWith('{"key": "value"}');

    fileReaderSpy.mockRestore();
  });

  test('shows an alert and logs error when an invalid file is selected', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => undefined);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const { container } = render(<AchievementImportExport onExport={mockOnExport} onImport={mockOnImport} />);
    const fileInput = getFileInput(container);

    const invalidFile = new File(['invalid json'], 'achievements.txt', { type: 'text/plain' });
    const fileReaderSpy = mockFileReaderContent('invalid json');

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(fileReaderSpy).toHaveBeenCalledWith(invalidFile);
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Invalid achievements file. Please select a valid JSON file.');
    expect(mockOnImport).not.toHaveBeenCalled();

    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    fileReaderSpy.mockRestore();
  });
});