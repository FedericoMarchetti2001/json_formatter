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

  // Add explicit types to mocked FileReader implementation
  const fileReaderMock: {
    result: string;
    onload: ((event: ProgressEvent<FileReader>) => void) | null;
    readAsText: jest.Mock<any, any>;
  } = {
    result: '',
    onload: jest.fn(),
    readAsText: jest.fn(),
  };

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
    render(<AchievementImportExport onExport={mockOnExport} onImport={mockOnImport} />);
    const fileInput = screen.getByLabelText('Import Achievements');

    const validJsonFile = new File(['{"key": "value"}'], 'achievements.json', { type: 'application/json' });

    // Mock FileReader
    const fileReaderSpy = jest.spyOn(FileReader.prototype, 'readAsText');
    const fileReaderMock = {
      result: '{"key": "value"}',
      onload: jest.fn(),
      readAsText: jest.fn(),
    };
    fileReaderSpy.mockImplementation((file) => {
      fileReaderMock.onload({ target: fileReaderMock });
    });

    fireEvent.change(fileInput, { target: { files: [validJsonFile] } });

    expect(fileReaderSpy).toHaveBeenCalledWith(validJsonFile);
    expect(mockOnImport).toHaveBeenCalledWith('{"key": "value"}');

    fileReaderSpy.mockRestore();
  });

  test('shows an alert and logs error when an invalid file is selected', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<AchievementImportExport onExport={mockOnExport} onImport={mockOnImport} />);
    const fileInput = screen.getByLabelText('Import Achievements');

    const invalidFile = new File(['invalid json'], 'achievements.txt', { type: 'text/plain' });

    // Mock FileReader
    const fileReaderSpy = jest.spyOn(FileReader.prototype, 'readAsText');
    const fileReaderMock = {
      result: 'invalid json',
      onload: jest.fn(),
      readAsText: jest.fn(),
    };
     fileReaderSpy.mockImplementation((file) => {
      fileReaderMock.onload({ target: fileReaderMock });
    });

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