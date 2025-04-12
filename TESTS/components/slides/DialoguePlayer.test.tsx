import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DialoguePlayer from '../../../src/components/slides/DialoguePlayer';

// Mock fetch for metadata
global.fetch = jest.fn();

// Mock Audio
const mockAudioPlay = jest.fn().mockResolvedValue(undefined);
const mockAudioPause = jest.fn();
const mockAudio = {
  play: mockAudioPlay,
  pause: mockAudioPause,
  onended: null,
  onerror: null,
};

// @ts-ignore - mocking the Audio constructor
global.Audio = jest.fn().mockImplementation(() => mockAudio);

// Mock setTimeout and clearTimeout
jest.useFakeTimers();

const mockMetadata = {
  title: 'Test Dialogue',
  audioFiles: [
    {
      index: 0,
      speaker: 'Dev A',
      text: 'Hello, how are you?',
      filename: 'dialogue-00.mp3',
      path: 'sounds/dialogue/dialogue-00.mp3',
    },
    {
      index: 1,
      speaker: 'Dev B',
      text: 'I am doing great, thanks!',
      filename: 'dialogue-01.mp3',
      path: 'sounds/dialogue/dialogue-01.mp3',
    },
  ],
};

describe('DialoguePlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful fetch by default
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockMetadata,
    });
  });

  test('renders loading state initially', () => {
    render(<DialoguePlayer metadataPath="/test-metadata.json" />);
    expect(screen.getByText(/loading dialogue/i)).toBeInTheDocument();
  });

  test('renders dialogue after loading metadata', async () => {
    render(<DialoguePlayer metadataPath="/test-metadata.json" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Dialogue')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Dev A')).toBeInTheDocument();
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    expect(screen.getByText('Dev B')).toBeInTheDocument();
    expect(screen.getByText('I am doing great, thanks!')).toBeInTheDocument();
  });

  test('shows error when metadata loading fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Failed to load'));
    
    render(<DialoguePlayer metadataPath="/test-metadata.json" />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading dialogue/i)).toBeInTheDocument();
    });
  });

  test('starts playing when play button is clicked', async () => {
    render(<DialoguePlayer metadataPath="/test-metadata.json" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Dialogue')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Play'));
    
    // Should start playing after timeout
    expect(setTimeout).toHaveBeenCalledTimes(1);
    jest.runAllTimers(); // Run the initial timeout
    
    // Should create audio for the first line
    expect(global.Audio).toHaveBeenCalledWith(expect.stringContaining('sounds/dialogue/dialogue-00.mp3'));
    expect(mockAudioPlay).toHaveBeenCalled();
  });

  test('pauses playback when pause button is clicked', async () => {
    render(<DialoguePlayer metadataPath="/test-metadata.json" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Dialogue')).toBeInTheDocument();
    });
    
    // Start playing
    fireEvent.click(screen.getByText('Play'));
    jest.runAllTimers();
    
    // Now we should have a Pause button
    await waitFor(() => {
      expect(screen.getByText('Pause')).toBeInTheDocument();
    });
    
    // Click pause
    fireEvent.click(screen.getByText('Pause'));
    expect(mockAudioPause).toHaveBeenCalled();
  });

  test('automatically plays next line when current line ends', async () => {
    render(<DialoguePlayer metadataPath="/test-metadata.json" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Dialogue')).toBeInTheDocument();
    });
    
    // Start playing
    fireEvent.click(screen.getByText('Play'));
    jest.runAllTimers();
    
    // Simulate first audio ending
    if (mockAudio.onended) mockAudio.onended();
    
    // Should set timeout for next line
    expect(setTimeout).toHaveBeenCalledTimes(2);
    jest.runAllTimers();
    
    // Should create audio for the second line
    expect(global.Audio).toHaveBeenCalledWith(expect.stringContaining('sounds/dialogue/dialogue-01.mp3'));
  });

  test('calls onComplete when all lines have been played', async () => {
    const mockOnComplete = jest.fn();
    
    render(
      <DialoguePlayer 
        metadataPath="/test-metadata.json"
        onComplete={mockOnComplete}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Dialogue')).toBeInTheDocument();
    });
    
    // Start playing
    fireEvent.click(screen.getByText('Play'));
    jest.runAllTimers();
    
    // Play first line
    if (mockAudio.onended) mockAudio.onended();
    jest.runAllTimers();
    
    // Play second line
    if (mockAudio.onended) mockAudio.onended();
    jest.runAllTimers();
    
    // Should call onComplete
    expect(mockOnComplete).toHaveBeenCalled();
  });
});