#!/usr/bin/env node

// scripts/playDialogue.js - Command line dialogue player for testing
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import readline from 'readline';

// Get current directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Verifies audio file format using system tools
 * @param {string} audioFile Path to audio file
 * @returns {Promise<boolean>} Whether file is valid
 */
async function verifyAudioFile(audioFile) {
  return new Promise((resolve) => {
    // MacOS file command to check file type
    const fileCheck = spawn('file', [audioFile]);
    let output = '';
    
    fileCheck.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    fileCheck.on('close', () => {
      // Check if it looks like an audio file
      const isAudio = output.toLowerCase().includes('audio') || 
                      output.toLowerCase().includes('mp3') ||
                      output.toLowerCase().includes('wav');
      
      // If the file command result contains 'data' or 'empty' and doesn't mention audio, it might be corrupt
      const possiblyCorrupt = !isAudio && (output.toLowerCase().includes('data') || output.toLowerCase().includes('empty'));
      
      if (possiblyCorrupt) {
        console.warn(`Warning: File appears to be corrupted or not an audio file: ${audioFile}`);
        console.warn(`File details: ${output.trim()}`);
      }
      
      resolve(isAudio);
    });
    
    fileCheck.on('error', () => {
      // If 'file' command isn't available, we'll be optimistic
      resolve(true);
    });
  });
}

/**
 * Plays audio file using the system's audio player with fallbacks
 * @param {string} audioFile Path to audio file
 * @returns {Promise} Resolves when audio completes
 */
function playAudio(audioFile) {
  return new Promise(async (resolve, reject) => {
    // Check if file exists and is accessible
    if (!fs.existsSync(audioFile)) {
      reject(new Error(`Audio file not found: ${audioFile}`));
      return;
    }
    
    // Check file format if possible
    const isValid = await verifyAudioFile(audioFile);
    if (!isValid) {
      console.warn(`Skipping corrupted audio file: ${audioFile}`);
      // Simulate audio duration with a delay and resolve
      await new Promise(r => setTimeout(r, 2000));
      resolve();
      return;
    }
    
    // Log the file being played for debugging
    console.log(`Debug: Playing file ${audioFile}`);
    
    // Track player failures to try alternatives
    let succeeded = false;
    let lastError = null;
    
    // List of possible players based on platform
    const playerOptions = [];
    
    if (process.platform === 'darwin') {
      // macOS options in order of preference
      playerOptions.push(
        { cmd: 'afplay', args: [audioFile] },
        { cmd: 'open', args: ['-a', 'QuickTime Player', audioFile] },
        { cmd: 'mplayer', args: [audioFile] }
      );
    } else if (process.platform === 'win32') {
      // Windows options
      playerOptions.push(
        { cmd: 'powershell', args: ['-c', `(New-Object System.Media.SoundPlayer "${audioFile}").PlaySync()`] },
        { cmd: 'powershell', args: ['-c', `Add-Type -AssemblyName PresentationCore; $player = New-Object System.Windows.Media.MediaPlayer; $player.Open('${audioFile}'); $player.Play(); Start-Sleep -s 3; $player.Stop()`] },
        { cmd: 'cmd', args: ['/c', `start /wait wmplayer "${audioFile}"`] }
      );
    } else {
      // Linux and others
      playerOptions.push(
        { cmd: 'mplayer', args: ['-really-quiet', audioFile] },
        { cmd: 'aplay', args: [audioFile] },
        { cmd: 'mpg123', args: [audioFile] }
      );
    }
    
    // Try each player in sequence until one succeeds
    for (const playerOption of playerOptions) {
      if (succeeded) break;
      
      try {
        // Attempt to spawn the player
        const player = spawn(playerOption.cmd, playerOption.args);
        
        // Wait for player to exit or error
        const result = await new Promise((resolvePlayer, rejectPlayer) => {
          // Add timeout to prevent hangs (10 seconds max)
          const timeout = setTimeout(() => {
            try {
              player.kill();
            } catch (e) {
              // Ignore kill errors
            }
            rejectPlayer(new Error('Player timeout after 10 seconds'));
          }, 10000);
          
          // Collect stderr output for debugging
          let stderrOutput = '';
          if (player.stderr) {
            player.stderr.on('data', (data) => {
              stderrOutput += data.toString();
            });
          }
          
          player.on('close', (code) => {
            clearTimeout(timeout);
            if (code === 0) {
              resolvePlayer({ success: true });
            } else {
              rejectPlayer(new Error(`Player exited with code ${code}. stderr: ${stderrOutput}`));
            }
          });
          
          player.on('error', (err) => {
            clearTimeout(timeout);
            rejectPlayer(new Error(`Failed to start player: ${err.message}`));
          });
        });
        
        // If we get here, the player succeeded
        succeeded = true;
        resolve();
        
      } catch (error) {
        // Remember the last error but keep trying other players
        lastError = error;
        console.error(`Player ${playerOption.cmd} failed: ${error.message}`);
      }
    }
    
    // If all players failed, give up and reject with the last error
    if (!succeeded) {
      console.error('All audio players failed.');
      // Just resolve anyway to continue to the next line
      resolve();
    }
  });
}

/**
 * Plays a dialogue sequence with pauses between lines
 * @param {string} metadataPath Path to dialogue metadata JSON
 */
async function playDialogue(metadataPath) {
  try {
    // Read metadata file with proper path resolution
    console.log(`Starting dialogue player with metadata: ${metadataPath}`);
    
    // Try different possible paths for the metadata file
    const possiblePaths = [
      metadataPath,                              // As provided
      path.resolve(process.cwd(), metadataPath), // Absolute from current dir
      path.resolve(__dirname, '..', metadataPath) // Relative to script location
    ];
    
    let metadataFile = null;
    for (const p of possiblePaths) {
      console.log(`Checking path: ${p}`);
      if (fs.existsSync(p)) {
        metadataFile = p;
        console.log(`Found metadata file at: ${metadataFile}`);
        break;
      }
    }
    
    if (!metadataFile) {
      console.error(`Metadata file not found. Tried: ${possiblePaths.join(', ')}`);
      process.exit(1);
    }
    
    // Read and parse metadata
    let metadata;
    try {
      const rawData = fs.readFileSync(metadataFile, 'utf8');
      metadata = JSON.parse(rawData);
    } catch (err) {
      console.error(`Failed to read or parse metadata file: ${err.message}`);
      process.exit(1);
    }
    
    console.log(`\n===== ${metadata.title || 'Dialogue'} =====\n`);
    
    if (!metadata.audioFiles || !metadata.audioFiles.length) {
      console.error('No audio files found in metadata');
      process.exit(1);
    }
    
    // Verify audio files exist
    console.log('Checking audio files...');
    const baseDir = path.dirname(metadataFile);
    const missingFiles = [];
    
    for (const file of metadata.audioFiles) {
      // Try multiple path resolution methods
      const possibleAudioPaths = [
        file.path,                               // As is in metadata
        path.resolve(process.cwd(), file.path),  // Absolute from current dir
        path.join(baseDir, file.filename),       // Relative to metadata file
        path.join(path.dirname(baseDir), file.path) // From project root
      ];
      
      let exists = false;
      for (const p of possibleAudioPaths) {
        if (fs.existsSync(p)) {
          exists = true;
          // Update the path to the working one
          file.resolvedPath = p;
          break;
        }
      }
      
      if (!exists) {
        missingFiles.push(file.path);
      }
    }
    
    if (missingFiles.length > 0) {
      console.warn(`Warning: ${missingFiles.length} audio files are missing:`);
      missingFiles.slice(0, 3).forEach(f => console.warn(`  - ${f}`));
      if (missingFiles.length > 3) {
        console.warn(`  - ...and ${missingFiles.length - 3} more`);
      }
      console.log('\nWill attempt to play available files only.');
    } else {
      console.log('All audio files found. Ready to play.');
    }
    
    // Print controls
    console.log('\nControls:');
    console.log('  Press SPACE to pause/resume');
    console.log('  Press N for next line');
    console.log('  Press Q to quit');
    console.log('\nStarting playback...\n');
    
    let isPaused = false;
    let currentIndex = 0;
    let shouldExit = false;
    
    // Set up key press handlers
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    
    process.stdin.on('keypress', (str, key) => {
      if (key.name === 'q') {
        console.log('\nExiting player...');
        shouldExit = true;
        process.exit(0);
      } else if (key.name === 'space') {
        isPaused = !isPaused;
        console.log(isPaused ? '\n[PAUSED]' : '\n[RESUMED]');
      } else if (key.name === 'n') {
        console.log('\n[NEXT]');
        isPaused = false;
      }
    });
    
    // Flag to use TTS if audio files are problematic
  let useTTS = false;
  
  // User can choose to use TTS mode
  console.log('  Press T to toggle text-to-speech mode (if audio files are problematic)');
  
  // Add TTS toggle
  process.stdin.on('keypress', (str, key) => {
    if (key.name === 't') {
      useTTS = !useTTS;
      console.log(useTTS ? '\n[TTS Mode ON]' : '\n[TTS Mode OFF]');
    }
  });
  
  /**
   * Use text-to-speech for playback
   * @param {string} text The text to speak
   * @param {string} speaker Speaker identifier to change voice
   * @returns {Promise} Resolves when audio completes
   */
  async function playTTS(text, speaker) {
    return new Promise((resolve, reject) => {
      let voice = speaker.includes('A') ? 'Alex' : 'Victoria';
      
      try {
        // macOS has built-in TTS with the 'say' command
        if (process.platform === 'darwin') {
          const player = spawn('say', ['-v', voice, text]);
          
          player.on('close', (code) => {
            if (code === 0) {
              resolve();
            } else {
              console.error(`TTS exited with code ${code}`);
              resolve(); // Resolve anyway to continue
            }
          });
          
          player.on('error', (err) => {
            console.error(`TTS error: ${err.message}`);
            resolve(); // Resolve anyway to continue
          });
        } else {
          // For non-macOS systems, just simulate with a delay
          console.log(`[TTS would read]: ${text}`);
          setTimeout(resolve, 1000 + text.length * 50); // Approximate reading time
        }
      } catch (error) {
        console.error(`TTS error: ${error.message}`);
        resolve(); // Resolve anyway to continue
      }
    });
  }

  // Play each audio file in sequence
  while (currentIndex < metadata.audioFiles.length && !shouldExit) {
    const line = metadata.audioFiles[currentIndex];
    const audioPath = line.resolvedPath || (path.isAbsolute(line.path) ? line.path : path.resolve(process.cwd(), line.path));
    
    // Display the current line
    console.log(`\n[${line.speaker}]: ${line.text}`);
    
    if (!isPaused) {
      try {
        // Use TTS if enabled or fall back to audio files
        if (useTTS) {
          await playTTS(line.text, line.speaker);
        } else if (fs.existsSync(audioPath)) {
          try {
            await playAudio(audioPath);
          } catch (audioError) {
            console.error(`Audio playback failed: ${audioError.message}`);
            console.log('Falling back to text-to-speech...');
            await playTTS(line.text, line.speaker);
          }
        } else {
          console.log(`Audio file missing, using text-to-speech: ${audioPath}`);
          await playTTS(line.text, line.speaker);
        }
        
        // Add a pause between lines (500-1500ms random)
        const pauseDuration = Math.floor(Math.random() * 1000) + 500;
        await new Promise(resolve => setTimeout(resolve, pauseDuration));
      } catch (error) {
        console.error(`Error during playback: ${error.message}`);
        // Continue to next line after error
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } else {
        // If paused, wait for user input
        await new Promise(resolve => {
          const checkPaused = setInterval(() => {
            if (!isPaused) {
              clearInterval(checkPaused);
              resolve();
            }
          }, 100);
        });
        continue;
      }
      
      currentIndex++;
    }
    
    console.log('\n===== Playback Complete =====\n');
    process.exit(0);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Get metadata path from command line arguments
const metadataPath = process.argv[2] || 'public/sounds/dialogue/ai-demo-metadata.json';

// Start playback
playDialogue(metadataPath);