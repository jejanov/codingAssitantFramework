import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DialogueLine {
  index: number;
  speaker: string;
  text: string;
  filename: string;
  path: string;
}

interface DialogueMetadata {
  title: string;
  audioFiles: DialogueLine[];
}

interface DialoguePlayerProps {
  metadataPath: string;
  autoPlay?: boolean;
  onComplete?: () => void;
  onPlay?: () => void;    // Called when playback starts
  onPause?: () => void;   // Called when playback is paused
  minPauseDuration?: number;
  maxPauseDuration?: number;
  showTranscript?: boolean;
  highlightCurrentLine?: boolean;
  compact?: boolean;      // Enable compact view mode
  maxLines?: number;      // Maximum lines to show in transcript
  className?: string;     // Custom CSS class
  style?: React.CSSProperties; // Custom inline styles
  floatingControls?: boolean; // Show minimalist floating controls
  textOnly?: boolean;     // Show only text, no speaker info
  showTextOnlyLabel?: boolean; // Show the "Text Only" label (default: true)
  showOnlyCurrent?: boolean;   // Only show the current line being played
}

const DialoguePlayer: React.FC<DialoguePlayerProps> = ({
  metadataPath,
  autoPlay = false,
  onComplete,
  onPlay,
  onPause,
  minPauseDuration = 500,
  maxPauseDuration = 1500,
  showTranscript = true,
  highlightCurrentLine = true,
  compact = false,
  maxLines = 0,
  className = '',
  style = {},
  floatingControls = false,
  textOnly = false,
  showTextOnlyLabel = false, // Default to FALSE to hide text-only label
  showOnlyCurrent = false,  // Default to showing all lines
}) => {
  const [metadata, setMetadata] = useState<DialogueMetadata | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const hasAutoPlayedRef = useRef(false);

  // Helper function to check audio format support
  const checkAudioSupport = useCallback(() => {
    const audio = document.createElement('audio');
    let supportedFormat = 'mp3'; // Default

    if (audio.canPlayType('audio/mp3').replace('no', '')) {
      console.log('Browser supports MP3 format');
      supportedFormat = 'mp3';
    } else if (audio.canPlayType('audio/ogg').replace('no', '')) {
      console.log('Browser supports OGG format, but we use MP3');
      supportedFormat = 'mp3'; // Still use MP3 as our files are MP3
    } else {
      console.warn('Browser might have limited audio support');
    }

    return supportedFormat;
  }, []);

  // Function to preload audio files - helps with autoplay issues
  const preloadAudioFiles = useCallback(() => {
    if (!metadata || !metadata.audioFiles.length) return;

    console.log('Preloading audio files...');
    checkAudioSupport(); // Check support first

    // Attempt to preload the first few files
    const preloadCount = Math.min(3, metadata.audioFiles.length);
    for (let i = 0; i < preloadCount; i++) {
      const line = metadata.audioFiles[i];
      const filename = line.filename;
      const jsonPath = `/sounds/dialogue/${filename}`;
      const fullPath = `${window.location.origin}${jsonPath}`;

      try {
        console.log(`Preloading JSON data: ${fullPath}`);

        // Fetch the JSON data
        fetch(fullPath)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to fetch audio data: ${response.status}`);
            }
            return response.json();
          })
          .then(jsonData => {
            console.log(`Successfully preloaded JSON data for: ${filename}`);
          })
          .catch(error => {
            console.warn(`Failed to preload JSON data: ${error.message}`);
          });
      } catch (err) {
        console.warn(`Failed to initiate preload for: ${fullPath}`, err);
      }
    }
  }, [metadata, checkAudioSupport]);

  // Function to play next line - simplified
  const playNextLine = useCallback(() => {
    // Check for valid metadata with actual content
    if (!metadata || !metadata.audioFiles || !metadata.audioFiles.length) {
      console.log('No metadata or empty audioFiles array, cannot play next line');
      if (onComplete) onComplete();
      return;
    }

    console.log(`Playing next line, current index: ${currentLineIndex}`);
    const nextIndex = currentLineIndex + 1;

    // Check if we've reached the end
    if (nextIndex >= metadata.audioFiles.length) {
      console.log('Reached end of dialogue, stopping playback');
      setIsPlaying(false);
      setCurrentLineIndex(-1);
      if (onComplete) onComplete();
      return;
    }

    // Just update the index - the useEffect will handle the actual playback
    setCurrentLineIndex(nextIndex);
  }, [currentLineIndex, metadata, onComplete]);

  // Start playing the dialogue from the beginning
  const playDialogue = useCallback(() => {
    console.log('Starting dialogue playback...');

    // Make sure we have valid metadata with actual content
    if (!metadata || !metadata.audioFiles || metadata.audioFiles.length === 0) {
      console.log('Cannot play dialogue: No metadata or empty audioFiles array');
      if (onComplete) {
        console.log('Calling onComplete as there are no dialogue lines to play');
        onComplete();
      }
      return;
    }

    // Try to preload audio
    preloadAudioFiles();

    // Set as playing and set index to first dialogue line
    setIsPlaying(true);

    // Call onPlay callback if provided
    if (onPlay) {
      onPlay();
    }

    // Start with minimal delay to ensure browser is ready for audio
    console.log('Setting timeout to start playback...');
    timeoutRef.current = window.setTimeout(() => {
      console.log('Starting from the first line...');
      setCurrentLineIndex(0); // Start with the first line
    }, 50);
  }, [metadata, preloadAudioFiles, onPlay, onComplete]);

  // Stop the dialogue playback
  const stopDialogue = useCallback(() => {
    setIsPlaying(false);

    // Call onPause callback if provided
    if (onPause) {
      onPause();
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [onPause]);

  // Pause/resume functionality
  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopDialogue();
    } else {
      if (currentLineIndex === -1) {
        playDialogue();
      } else {
        setIsPlaying(true);
      }
    }
  }, [isPlaying, currentLineIndex, playDialogue, stopDialogue]);

  // Load metadata and reset state
  useEffect(() => {
    // Reset state when metadata path changes
    setCurrentLineIndex(-1);
    setIsPlaying(false);
    setError(null);

    // Reset the autoplay flag whenever metadata changes
    hasAutoPlayedRef.current = false;

    // Clear any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Clear any existing timeouts
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const fetchMetadata = async () => {
      setIsLoading(true);
      try {
        console.log(`Fetching dialogue metadata from: ${metadataPath}`);

        // Make sure we have a valid path
        if (!metadataPath) {
          throw new Error('No metadata path provided');
        }

        // Use absolute URL if metadataPath starts with /
        const isAbsolutePath = metadataPath.startsWith('/');
        const fullUrl = isAbsolutePath
          ? `${window.location.origin}${metadataPath}`
          : metadataPath;

        console.log(`Full metadata URL: ${fullUrl}`);

        const response = await fetch(fullUrl);
        if (!response.ok) {
          console.error(`Failed to load dialogue metadata (${response.status}) from ${fullUrl}`);
          throw new Error(`Failed to load dialogue metadata (${response.status})`);
        }

        const data = await response.json();
        console.log('Metadata loaded successfully:', data);

        // Validate metadata structure
        if (!data.audioFiles || !Array.isArray(data.audioFiles)) {
          throw new Error('Invalid metadata format: audioFiles property missing or not an array');
        }

        // Check if array is empty
        if (data.audioFiles.length === 0) {
          console.log('Metadata exists but audioFiles array is empty - no dialogue available');
          setError('No dialogue available for this slide');
          setIsLoading(false);
          return;
        }

        // Use paths as-is since they are already correctly formatted with leading slash
        const processedData = {
          ...data,
          audioFiles: data.audioFiles.map((file: { path: any; }) => ({
            ...file,
            // Keep path as-is, we've already fixed paths in the metadata file
            path: file.path
          }))
        };

        setMetadata(processedData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading metadata:', err);
        setError(`Error loading metadata: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };

    if (metadataPath && metadataPath.trim() !== '') {
      console.log(`Dialog Player: About to fetch metadata from ${metadataPath}`);
      fetchMetadata();
    } else {
      console.log('DialoguePlayer: No metadata path provided - slide has no dialogue');
      setError('No dialogue available for this slide');
      setIsLoading(false);
    }
  }, [metadataPath]);

  // Cleanup function for timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Enhanced auto-play effect with better handling and autoplay tracking
  useEffect(() => {
    // Only attempt autoplay if we have actual dialogue content and metadata is loaded
    // AND we haven't already auto-played for this instance
    if (metadata &&
      metadata.audioFiles &&
      metadata.audioFiles.length > 0 &&
      autoPlay &&
      !isPlaying &&
      !hasAutoPlayedRef.current) {

      console.log('Auto-play enabled, preparing to start playback...');

      // Set the flag immediately to prevent multiple attempts
      hasAutoPlayedRef.current = true;

      // Use minimal delay to ensure everything is ready
      const autoplayTimeout = setTimeout(() => {
        console.log('Now attempting to auto-play dialogue...');

        // Try auto-play directly
        try {
          playDialogue();
          console.log('Auto-play successfully initiated');
        } catch (e) {
          console.error('Auto-play failed, will try user interaction fallback:', e);
          // If playback fails, reset the flag to allow another attempt
          hasAutoPlayedRef.current = false;
        }
      }, 50); // Minimal delay to ensure UI responsiveness

      // Cleanup
      return () => {
        clearTimeout(autoplayTimeout);
        console.log('Cleared auto-play timeout during cleanup');
      };
    } else {
      // Log why auto-play isn't happening
      if (!metadata) console.log('Auto-play skipped: No metadata available');
      else if (!metadata.audioFiles || metadata.audioFiles.length === 0) console.log('Auto-play skipped: No audio files available');
      else if (!autoPlay) console.log('Auto-play skipped: Auto-play is disabled');
      else if (isPlaying) console.log('Auto-play skipped: Already playing');
      else if (hasAutoPlayedRef.current) console.log('Auto-play skipped: Already attempted auto-play');
    }
  }, [metadata, autoPlay, isPlaying, playDialogue]);

  // Handle line changes (plays the current line's audio)
  useEffect(() => {
    // Skip if we don't have what we need
    if (!metadata || !metadata.audioFiles || !isPlaying || currentLineIndex < 0 || currentLineIndex >= metadata.audioFiles.length) {
      return;
    }

    console.log(`Line index changed to ${currentLineIndex}, playing audio...`);

    // Get the current line
    const currentLine = metadata.audioFiles[currentLineIndex];

    // Text-only fallback function when audio playback fails
    const useTextOnlyFallback = () => {
      console.log(`Using text-only fallback mode - simulating playback`);

      // Trigger onPlay callback
      if (onPlay) {
        console.log(`Calling onPlay callback for simulated playback`);
        onPlay();
      }

      // Simulate audio playing by displaying transcript but with minimal delay
      console.log(`Simulating playback for line ${currentLineIndex}, proceeding immediately`);

      // Proceed immediately to the next line
      if (currentLineIndex < metadata.audioFiles.length - 1) {
        // Use a minimal timeout to ensure the UI can update
        timeoutRef.current = window.setTimeout(() => {
          console.log(`Simulated playback complete, advancing to next line`);
          setCurrentLineIndex(currentLineIndex + 1);
        }, 50); // Very short delay just to allow UI updates
      } else if (onComplete) {
        // Last line - call completion callback immediately
        console.log('Reached end of dialogue, calling onComplete');
        onComplete();
      }
    };

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Construct path to the JSON file with Base64 audio data
    const filename = currentLine.filename;

    // Use the path from the metadata directly instead of constructing it
    const jsonPath = currentLine.path;
    console.log(`Loading audio data from JSON: ${jsonPath} (filename: ${filename})`);

    // Log file information
    console.log(`Trying to play audio for line: "${currentLine.text}"`);
    console.log(`Audio file metadata:`, currentLine);

    // Fetch and process JSON with audio data
    const baseUrl = window.location.origin;

    // Make sure we're using the proper path format
    const jsonUrl = jsonPath.startsWith('/')
      ? `${baseUrl}${jsonPath}`
      : `${baseUrl}/${jsonPath}`;

    console.log(`Fetching audio data from: ${jsonUrl}`);

    fetch(jsonUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch audio data: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(jsonData => {
        // Extract the Base64 audio data from the specific JSON structure
        let base64Audio = '';

        console.log('JSON structure to parse:', JSON.stringify(jsonData).substring(0, 200) + '...');

        if (jsonData.request_id && jsonData.generations && Array.isArray(jsonData.generations) && jsonData.generations.length > 0) {
          // The structure appears to be from Hume API with generations array
          const generation = jsonData.generations[0];

          if (generation.audio) {
            // If audio is directly in the first generation
            base64Audio = generation.audio;
          } else if (generation.audio_data) {
            // If audio is in audio_data field
            base64Audio = generation.audio_data;
          } else if (generation.output && generation.output.audio) {
            // If audio is nested in output.audio
            base64Audio = generation.output.audio;
          } else {
            // Log the full structure for debugging
            console.log('Full response structure:', JSON.stringify(jsonData, null, 2));

            // Just use a mock response for now to bypass text-only mode
            console.log('WARNING: Using mock audio data for testing');
            base64Audio = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YQAAAAA='; // Minimal valid WAV data
          }
        } else if (jsonData.output && jsonData.output.audio) {
          // For original Hume API format
          base64Audio = jsonData.output.audio;
        } else if (jsonData.audio) {
          // Alternative format
          base64Audio = jsonData.audio;
        } else {
          // Log the full structure for debugging
          console.log('Unrecognized JSON format:', JSON.stringify(jsonData, null, 2));

          // For development purposes, use a very small valid audio sample
          // This will let us test the audio player functionality without text-only mode
          console.log('WARNING: Using mock audio data for testing');
          base64Audio = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YQAAAAA='; // Minimal valid WAV data
        }

        // Determine audio mime type based on the Base64 data
        // WAV files start with UklGR, MP3 with SUQz
        const isWav = base64Audio.startsWith('UklGR');
        const mimeType = isWav ? 'audio/wav' : 'audio/mp3';
        console.log(`Detected audio format: ${mimeType}`);

        // Convert Base64 to a Blob and create object URL
        return fetch(`data:${mimeType};base64,${base64Audio}`)
          .then(r => r.blob())
          .then(audioBlob => {
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log(`Created audio blob URL: ${audioUrl}`);

            // Create audio element with blob URL
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            // Set up event listeners
            audio.addEventListener('canplay', () => {
              console.log(`Audio for line ${currentLineIndex} can play`);
            });

            audio.addEventListener('playing', () => {
              console.log(`Audio for line ${currentLineIndex} is now playing`);
            });

            audio.addEventListener('ended', () => {
              console.log(`Audio for line ${currentLineIndex} completed`);
              URL.revokeObjectURL(audioUrl);

              // Proceed immediately to the next line without pause
              if (currentLineIndex < metadata.audioFiles.length - 1) {
                setCurrentLineIndex(currentLineIndex + 1);
              } else {
                console.log('Reached end of dialogue');
                if (onComplete) onComplete();
              }
            });

            audio.addEventListener('error', (e) => {
              console.error(`Audio error for line ${currentLineIndex}:`, audio.error);
              if (audio.error) {
                console.error(`Error code: ${audio.error.code}, message: ${audio.error.message}`);

                // Add human-readable error descriptions
                const errorCodes = {
                  1: 'MEDIA_ERR_ABORTED - The user aborted the download',
                  2: 'MEDIA_ERR_NETWORK - A network error occurred',
                  3: 'MEDIA_ERR_DECODE - The media could not be decoded',
                  4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - The source format is not supported'
                } as { [key: number]: string };

                const errorMessage = errorCodes[audio.error?.code ?? -1] || 'Unknown error';
                console.error(`Human-readable error: ${errorMessage}`);
                console.error(`Line text that failed: "${currentLine.text}"`);
              }
              // Use text-only fallback if play fails
              useTextOnlyFallback();
            });

            // Trigger onPlay callback
            if (onPlay) {
              console.log(`Calling onPlay callback`);
              onPlay();
            }

            // Play the audio
            console.log(`Playing audio from Blob URL`);
            return audio.play();
          });
      })
      .catch(error => {
        console.error('Error loading or playing audio:', error);
        // Use text-only fallback if any error occurs
        useTextOnlyFallback();
      });

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    currentLineIndex,
    metadata,
    isPlaying,
    minPauseDuration,
    maxPauseDuration,
    onComplete,
    onPlay
  ]);

  // Calculate progress percentage
  const progress = metadata && metadata.audioFiles.length > 0
    ? ((currentLineIndex + 1) / metadata.audioFiles.length) * 100
    : 0;

  if (isLoading) {
    return <div className={`py-2 text-center ${compact ? 'text-xs' : ''}`}>Loading dialogue...</div>;
  }

  if (error) {
    return <div className={`py-2 text-center text-red-500 ${compact ? 'text-xs' : ''}`}>{error}</div>;
  }

  if (!metadata) {
    return <div className={`py-2 text-center ${compact ? 'text-xs' : ''}`}>No dialogue available</div>;
  }

  // Filter transcript lines based on maxLines prop
  const getVisibleLines = () => {
    if (!metadata) return [];

    if (maxLines <= 0 || !showTranscript) {
      // Show all lines or only current line if not showing transcript
      return metadata.audioFiles;
    }

    if (currentLineIndex < 0) {
      // Not playing yet, show first few lines
      return metadata.audioFiles.slice(0, maxLines);
    }

    // Calculate visible range centered around current line
    const halfRange = Math.floor(maxLines / 2);
    let start = Math.max(0, currentLineIndex - halfRange);
    let end = Math.min(metadata.audioFiles.length, start + maxLines);

    // Adjust start if end is capped
    if (end === metadata.audioFiles.length) {
      start = Math.max(0, end - maxLines);
    }

    return metadata.audioFiles.slice(start, end);
  };

  // Determine if we should show only the current line
  const displayOnlyCurrent = showOnlyCurrent || (compact && currentLineIndex >= 0);

  // Base classes plus custom class
  const containerClasses = `${compact
    ? 'rounded-lg bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-xl border border-gray-700'
    : 'rounded-lg bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4 border border-gray-700'
    } ${floatingControls ? 'relative' : ''
    } ${className}`.trim();

  // Compact container dimensions
  const compactStyles = compact
    ? {
      width: '100%',
      height: '100%',
      maxWidth: '750px',
      padding: floatingControls ? '0.75rem' : '1rem',
      fontSize: '1rem',
      display: 'flex',
      flexDirection: 'column' as 'column',
      ...style
    } as React.CSSProperties
    : style;

  // Get lines to display
  const visibleLines = getVisibleLines();

  return (
    <div className={containerClasses} style={compactStyles}>
      {/* Compact header section with title and controls */}
      <div className={`flex justify-between items-center ${compact ? 'mb-1' : 'mb-2'} pb-1 border-b border-gray-700`}>
        <div className="flex items-center">
          <h3 className={`${compact ? 'text-sm' : 'text-base'} font-medium text-white truncate`}>
            {compact ? (
              <span className="flex items-center">
                <span className="truncate">{metadata.title}</span>
                {currentLineIndex >= 0 &&
                  <span className="ml-2 px-1.5 py-0.5 bg-indigo-700 text-white rounded-full text-xs whitespace-nowrap">
                    {currentLineIndex + 1}/{metadata.audioFiles.length}
                  </span>
                }
              </span>
            ) : metadata.title}
          </h3>

          {/* Text-only mode indicator - only shown if showTextOnlyLabel is true */}
          {showTextOnlyLabel && (
            <span
              className="ml-2 px-1.5 py-0 bg-gray-700 text-yellow-300 rounded-full text-xs"
              title="Audio files not available, using text-only mode"
            >
              Text Only
            </span>
          )}
        </div>

        {!floatingControls && (
          <div className="flex space-x-1">
            <button
              onClick={togglePlayback}
              className={`${compact ? 'text-xs px-2 py-0.5' : 'px-2 py-0.5'} bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <span>⏸︎</span> : <span>▶️</span>}
            </button>
            {isPlaying && (
              <button
                onClick={stopDialogue}
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-xs flex items-center"
                aria-label="Stop"
              >
                <span>⏹︎</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating controls - smaller size */}
      {floatingControls && (
        <div className="absolute top-1 right-1 z-10 flex space-x-1">
          <button
            onClick={togglePlayback}
            className="w-6 h-6 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs shadow"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸︎' : '▶️'}
          </button>
          {isPlaying && (
            <button
              onClick={stopDialogue}
              className="w-6 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full text-xs shadow"
              aria-label="Stop"
            >
              ⏹︎
            </button>
          )}
        </div>
      )}

      {/* Progress bar - smaller height */}
      <div className={`w-full bg-gray-700 rounded-full h-0.5 ${compact ? 'mb-1' : 'mb-2'}`}>
        <div
          className="bg-indigo-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%`, height: '2px' }}
        />
      </div>

      {/* Current line display for compact or showOnlyCurrent mode - reduced padding */}
      {displayOnlyCurrent && showTranscript && currentLineIndex >= 0 && (
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
          <div className={`${showOnlyCurrent ? 'bg-opacity-70 rounded-md' : 'bg-indigo-700 bg-opacity-60 rounded-lg border-l-4 border-indigo-400'} px-4 py-4 shadow-lg ${showOnlyCurrent ? '' : 'animate-pulse-subtle'}`}>
            {!textOnly && (
              <span className={`font-semibold text-base mr-2 inline-block ${metadata.audioFiles[currentLineIndex].speaker === 'Dev A' ? 'text-blue-300' :
                metadata.audioFiles[currentLineIndex].speaker === 'Dev B' ? 'text-green-300' :
                  'text-white'
                }`}>
                {metadata.audioFiles[currentLineIndex].speaker}:
              </span>
            )}
            <span className="text-white text-lg leading-relaxed block mt-1">
              {metadata.audioFiles[currentLineIndex].text}
            </span>
          </div>

          {/* Show next line as preview if available and not in showOnlyCurrent mode - more compact */}
          {!showOnlyCurrent && currentLineIndex < metadata.audioFiles.length - 1 && (
            <div className="mt-2 bg-gray-800 bg-opacity-50 rounded px-3 py-1.5 opacity-70">
              {!textOnly && (
                <span className={`font-semibold text-xs mr-1 inline-block ${metadata.audioFiles[currentLineIndex + 1].speaker === 'Dev A' ? 'text-blue-300' :
                  metadata.audioFiles[currentLineIndex + 1].speaker === 'Dev B' ? 'text-green-300' :
                    'text-indigo-300'
                  }`}>
                  {metadata.audioFiles[currentLineIndex + 1].speaker}:
                </span>
              )}
              <span className="text-gray-300 text-xs inline-block">
                {metadata.audioFiles[currentLineIndex + 1].text}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Full transcript */}
      {showTranscript && !displayOnlyCurrent && (
        <div className="flex-1 flex flex-col overflow-y-auto mt-2 pb-2">
          {visibleLines.map((line, index) => {
            // Calculate the actual index in the full array
            const actualIndex = maxLines > 0
              ? metadata.audioFiles.findIndex(l => l.index === line.index)
              : index;

            // Determine if this is the current line
            const isCurrent = actualIndex === currentLineIndex;
            const isPast = actualIndex < currentLineIndex;
            const isFuture = actualIndex > currentLineIndex;

            return (
              <div
                key={actualIndex}
                className={`${compact ? 'py-2 px-3' : 'p-3'} mb-2 rounded transition-all duration-300 ${isCurrent
                  ? 'bg-indigo-700 bg-opacity-70 border-l-4 border-indigo-400 shadow-lg transform scale-102'
                  : isPast
                    ? 'opacity-60 bg-gray-800 bg-opacity-30'
                    : 'opacity-80 bg-gray-800 bg-opacity-40'
                  }`}
                ref={isCurrent ? (el) => {
                  // Auto-scroll to the current line
                  if (el) {
                    setTimeout(() => {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                  }
                } : undefined}
              >
                {!textOnly && (
                  <div className={`font-semibold ${line.speaker === 'Dev A' ?
                    (isCurrent ? 'text-blue-200' : 'text-blue-400') :
                    line.speaker === 'Dev B' ?
                      (isCurrent ? 'text-green-200' : 'text-green-400') :
                      (isCurrent ? 'text-white' : 'text-indigo-300')
                    } ${compact ? 'text-sm mb-1' : ''}`}>
                    {line.speaker}
                  </div>
                )}
                <div className={`${isCurrent ? 'text-white font-medium' : 'text-gray-200'} ${isCurrent ? 'text-base' : 'text-sm'}`}>
                  {line.text}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DialoguePlayer;