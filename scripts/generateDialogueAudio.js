// scripts/generateDialogueAudio.js
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { fileURLToPath } from 'url'

// Load environment variables
dotenv.config()

// Get current directory (for ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Hume AI API config
const HUME_API_KEY = process.env.HUME_API_KEY
const DEV_A_VOICE_DESCRIPTION = process.env.DEV_A_VOICE_DESCRIPTION || 'A professional male developer, 30s, with a clear conversational tone and casual demeanor'
const DEV_B_VOICE_DESCRIPTION = process.env.DEV_B_VOICE_DESCRIPTION || 'A technical expert male developer, mid 30s, energetic and enthusiastic about AI technology'

// Base output directory for audio files
const BASE_OUTPUT_DIR = path.join(__dirname, '../public/sounds/dialogue')

/**
 * Extract slide number from a filename like "dialogue_slide_03.json"
 * @param {string} filename The dialogue filename
 * @returns {string|null} Slide number in format "slideXX" or null if not found
 */
function extractSlideNumber(filename) {
  // Match patterns like dialogue_slide_01.json, dialogue_slide01.json, or slide_01.json
  const slideMatch = filename.match(/(?:dialogue_)?slide[_]?(\d+)/i);
  
  if (slideMatch && slideMatch[1]) {
    // Format slide number as slideXX (two digits)
    const slideNum = slideMatch[1].padStart(2, '0');
    return `slide${slideNum}`;
  }
  
  return null;
}

// Voice cache to store voices by speaker
let voiceCache = {}

/**
 * Save a voice to Hume.ai for future reuse
 * @param {string} generationId The generation ID of the voice to save
 * @param {string} name The name to give the saved voice
 * @returns {Promise<object|boolean>} Voice data object or false on failure
 */
async function saveVoice(generationId, name) {
  try {
    console.log(`Saving voice with generation ID: ${generationId} as "${name}"`)
    
    const response = await fetch(
      'https://api.hume.ai/v0/tts/voices',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hume-Api-Key': HUME_API_KEY
        },
        body: JSON.stringify({
          name: name,
          generation_id: generationId
        })
      }
    )
    
    if (!response.ok) {
      const errorText = await response.text()
      console.warn(`Could not save voice: ${response.status} - ${errorText}`)
      return false
    }
    
    const data = await response.json()
    console.log(`✅ Voice saved with ID: ${data.id}, Name: ${data.name}`)
    return data // Return the full voice data object
  } catch (error) {
    console.warn('Error saving voice:', error)
    return false
  }
}

/**
 * Get an existing voice ID for a speaker or create a new one
 * @param {string} speakerType The type of speaker (Dev A, Dev B, etc.)
 * @param {string} baseDescription The base description for the voice
 * @returns {Promise<string>} The voice ID to use
 */
async function getOrCreateVoice(speakerType, baseDescription) {
  // If we already have a voice for this speaker, return it
  if (voiceCache[speakerType]) {
    console.log(`Using cached voice for ${speakerType}: ${voiceCache[speakerType]}`)
    return voiceCache[speakerType]
  }
  
  console.log(`No voice found for ${speakerType}, creating new voice...`)
  
  // Create a voice with a simple utterance
  const voiceDescription = speakerType === 'Dev A' 
    ? DEV_A_VOICE_DESCRIPTION
    : DEV_B_VOICE_DESCRIPTION
  
  try {
    // Create a minimal payload to generate a voice
    const payload = {
      utterances: [
        {
          text: "Hello, this is a voice generation test.",
          description: voiceDescription,
          speed: 1.0
        }
      ],
      format: {
        type: "mp3"
      },
      num_generations: 1
    }
    
    // Make the API call to generate a voice
    const response = await fetch(
      'https://api.hume.ai/v0/tts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hume-Api-Key': HUME_API_KEY,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to generate voice: ${response.status} - ${errorText}`)
    }
    
    // Parse the response to get the generation ID
    const responseBody = await response.json()
    
    if (responseBody && responseBody.generations && responseBody.generations.length > 0) {
      const generationId = responseBody.generations[0].generation_id
      console.log(`Generated new voice with ID: ${generationId}`)
      
      // Save the voice for future use
      const voiceName = `${speakerType.replace(/\s+/g, '')}-${Date.now()}`
      const saveResult = await saveVoice(generationId, voiceName)
      
      if (saveResult && saveResult.id) {
        // The save operation returns a voice ID that might be different from the generation ID
        console.log(`Using saved voice ID: ${saveResult.id} instead of generation ID: ${generationId}`)
        voiceCache[speakerType] = saveResult.id
        
        // Return the saved voice ID
        return saveResult.id
      } else {
        // Fallback to using the generation ID directly
        console.log(`No voice ID returned from save operation, using generation ID: ${generationId}`)
        voiceCache[speakerType] = generationId
        
        return generationId
      }
    } else {
      throw new Error('Unable to extract generation ID from response')
    }
  } catch (error) {
    console.error(`Error creating voice for ${speakerType}:`, error)
    throw new Error(`Failed to create voice for ${speakerType}: ${error.message}`)
  }
}

/**
 * Generate audio for a single dialogue line using Hume.ai API
 * @param {string} text The text to convert to speech
 * @param {string} speakerType The speaker type (Dev A or Dev B)
 * @param {string} outputPath The path to save the audio file
 * @param {string} [emotion=''] Emotional tone and delivery style (e.g., "excited, confident")
 * @param {number|null} [speed=null] Speaking rate (0.8=slower, 1.0=normal, 1.2=faster)
 * @param {number|null} [trailingSilence=null] Pause after speech in seconds (0.2-1.0)
 * @returns {Promise<string>} Path to the generated JSON file
 */
async function generateAudioLine(text, speakerType, outputPath, emotion = '', speed = null, trailingSilence = null) {
  console.log(`Generating audio for: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`)
  
  try {
    // Process special text markers and create appropriate acting instructions
    let processedText = text;
    
    // Start with the provided emotion if available
    let actingInstructions = emotion ? emotion : '';
    
    // Process special markers in the text and add to acting instructions if not explicitly provided
    if (text.includes('[laughs]')) {
      processedText = processedText.replace('[laughs]', '');
      if (!emotion.includes('laugh') && !emotion.includes('amus')) {
        actingInstructions += actingInstructions ? ', laughing, amused' : 'laughing, amused';
      }
    }
    if (text.includes('[typing sounds]')) {
      processedText = processedText.replace('[typing sounds]', '');
      if (!emotion.includes('interrupt')) {
        actingInstructions += actingInstructions ? ', interrupted briefly' : 'interrupted briefly';
      }
    }
    if (text.includes('[chuckles]')) {
      processedText = processedText.replace('[chuckles]', '');
      if (!emotion.includes('chuckl') && !emotion.includes('bemused')) {
        actingInstructions += actingInstructions ? ', chuckling, bemused' : 'chuckling, bemused';
      }
    }
    if (text.includes('[sarcastically]')) {
      processedText = processedText.replace('[sarcastically]', '');
      if (!emotion.includes('sarcastic')) {
        actingInstructions += actingInstructions ? ', sarcastic, dry tone' : 'sarcastic, dry tone';
      }
    }
    if (text.includes('[triumphantly]')) {
      processedText = processedText.replace('[triumphantly]', '');
      if (!emotion.includes('triumph') && !emotion.includes('proud')) {
        actingInstructions += actingInstructions ? ', triumphant, proud' : 'triumphant, proud';
      }
    }
    
    // Add character-specific acting instructions if no emotion is provided
    if (!actingInstructions) {
      if (speakerType === 'Dev A') {
        actingInstructions = 'conversational, natural, casual, curious';
      } else {
        actingInstructions = 'enthusiastic, confident, energetic, excited about technology';
      }
    }
    
    // Determine speed based on provided value, text content, or emotion
    let speechSpeed = speed !== null ? speed : 1.0;
    
    // If speed is not explicitly set, infer from content
    if (speed === null) {
      if (processedText.includes('...')) {
        // Slower for thoughtful pauses
        speechSpeed = 0.9;
      } else if (actingInstructions.includes('excited') || actingInstructions.includes('enthusiastic')) {
        // Slightly faster for excited speech
        speechSpeed = 1.1;
      }
    }
    
    // Use provided trailing silence or default
    const silence = trailingSilence !== null ? trailingSilence : 0.5;
    
    // Get or create a voice for this speaker
    const voiceId = await getOrCreateVoice(speakerType, 
      speakerType === 'Dev A' ? DEV_A_VOICE_DESCRIPTION : DEV_B_VOICE_DESCRIPTION
    );
    
    // Prepare request payload for Hume.ai TTS API - using the voice ID with acting instructions
    const payload = {
      utterances: [
        {
          text: processedText,
          // Use the stored voice ID for this character
          voice: {
            id: voiceId
          },
          // Use acting instructions to modify the voice characteristics
          description: actingInstructions,
          speed: speechSpeed,
          trailing_silence: silence
        }
      ],
      format: {
        type: "mp3"
      },
      num_generations: 1,
      split_utterances: false // We want a single continuous audio file
    }

    // Use the correct endpoint for Hume.ai TTS
    const response = await fetch(
      'https://api.hume.ai/v0/tts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hume-Api-Key': HUME_API_KEY,
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify(payload)
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Hume AI API error: ${response.status} ${response.statusText} - ${errorText}`
      )
    }

    // Check if the response is JSON or binary audio
    const contentType = response.headers.get('content-type')
    
    // Ensure the directory exists
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    }

    // The response contains Base64-encoded audio in JSON format
    // Save it with .json extension instead of .mp3
    const jsonOutputPath = outputPath.replace('.mp3', '.json')
    
    // Get response data
    const data = await response.text()
    
    // Save the JSON response
    fs.writeFileSync(jsonOutputPath, data)
    console.log(`✅ Response saved to: ${jsonOutputPath}`)
    
    return jsonOutputPath
  } catch (error) {
    console.error('Error generating audio:', error)
    throw error
  }
}

/**
 * Process a complete dialogue file and generate all audio files
 * @param {string} dialogueFilePath Path to the JSON dialogue file
 * @param {string} outputPrefix Prefix for output files (dialogue-1, dialogue-2, etc.)
 * @returns {Promise<Object>} Metadata about generated files
 */
async function processDialogue(dialogueFilePath, outputPrefix = 'dialogue') {
  if (!HUME_API_KEY) {
    console.error('Error: HUME_API_KEY not found in .env file')
    process.exit(1)
  }

  console.log(`Processing dialogue file: ${dialogueFilePath}`)
  
  // Determine if this is a slide-specific dialogue
  const filename = path.basename(dialogueFilePath);
  const slideNumber = extractSlideNumber(filename);
  
  // If outputPrefix is 'dialogue' and we have a slide number, use the slide number
  if (outputPrefix === 'dialogue' && slideNumber) {
    outputPrefix = slideNumber;
  }
  
  // Determine the output directory based on whether this is a slide or not
  let OUTPUT_DIR = BASE_OUTPUT_DIR;
  if (slideNumber) {
    // For slide-specific dialogues, create/use a slide subfolder
    OUTPUT_DIR = path.join(BASE_OUTPUT_DIR, slideNumber);
    console.log(`Using slide-specific output directory: ${OUTPUT_DIR}`);
  }
  
  // Read and parse the dialogue file
  const dialogueData = JSON.parse(fs.readFileSync(dialogueFilePath, 'utf8'))
  
  if (!dialogueData.dialogue || !Array.isArray(dialogueData.dialogue)) {
    throw new Error('Invalid dialogue file format. Expected { dialogue: [...] }')
  }
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }
  
  // Reset voice cache for new dialogue
  voiceCache = {}
  
  // Process each dialogue line
  const audioMetadata = {
    title: dialogueData.title || 'Untitled Dialogue',
    audioFiles: [],
    voices: {}, // Will store voice IDs by speaker
    slideNumber: slideNumber // Store the slide number in metadata
  }
  
  for (let i = 0; i < dialogueData.dialogue.length; i++) {
    const line = dialogueData.dialogue[i]
    const lineNumber = String(i).padStart(2, '0')
    const filename = `${outputPrefix}-${lineNumber}.json`  // Changed to .json extension
    // Use the slide-specific or default OUTPUT_DIR
    const outputPath = path.join(OUTPUT_DIR, filename.replace('.json', '.mp3'))  // Still use .mp3 for generateAudioLine
    
    // Extract any emotion, speed, and trailingSilence parameters if present
    const emotion = line.emotion || '';
    const speed = typeof line.speed !== 'undefined' ? line.speed : null;
    const trailingSilence = typeof line.trailingSilence !== 'undefined' ? line.trailingSilence : null;
    
    console.log(`Line ${i}: Using emotion="${emotion}", speed=${speed}, trailingSilence=${trailingSilence}`);
    
    try {
      // Generate audio for this line with the enhanced parameters
      const jsonPath = await generateAudioLine(
        line.line, 
        line.speaker, 
        outputPath,
        emotion,
        speed,
        trailingSilence
      )
      const jsonFilename = path.basename(jsonPath)
      
      // Add to metadata with the enhanced parameters
      audioMetadata.audioFiles.push({
        index: i,
        speaker: line.speaker,
        text: line.line,
        emotion: emotion,
        speed: speed,
        trailingSilence: trailingSilence,
        filename: jsonFilename,  // Use the JSON filename
        path: path.relative(path.join(__dirname, '..'), jsonPath)
      })
      
      // Add a delay between API calls to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Failed to generate audio for line ${i}:`, error)
    }
  }
  
  // Add voice cache to metadata
  audioMetadata.voices = voiceCache
  
  // Save metadata file in the slide-specific or default directory
  const metadataPath = path.join(OUTPUT_DIR, `${outputPrefix}-metadata.json`)
  fs.writeFileSync(
    metadataPath, 
    JSON.stringify(audioMetadata, null, 2)
  )
  
  console.log(`✅ Dialogue processing complete. Generated ${audioMetadata.audioFiles.length} audio files.`)
  console.log(`✅ Used ${Object.keys(voiceCache).length} unique voices for ${Object.keys(voiceCache).join(', ')}`)
  if (slideNumber) {
    console.log(`✅ Slide-specific audio generated for ${slideNumber}`)
  }
  console.log(`✅ Metadata saved to: ${metadataPath}`)
  
  return audioMetadata
}

/**
 * Lists available dialogue files in the dialogue directory
 * @returns {Promise<Array<{path: string, name: string, slide: string|null}>>} Available dialogue files
 */
async function listDialogueFiles() {
  const dialogueDir = path.join(__dirname, '../public/dialogue');
  
  try {
    const files = await fs.promises.readdir(dialogueDir);
    
    // Filter for JSON files
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    // Extract information about each file
    return jsonFiles.map(file => {
      const filePath = path.join(dialogueDir, file);
      const slideNumber = extractSlideNumber(file);
      
      return {
        path: filePath,
        name: file,
        slide: slideNumber
      };
    });
  } catch (error) {
    console.error('Error listing dialogue files:', error);
    return [];
  }
}

/**
 * Prompt user to select a dialogue file
 * @param {Array} files List of dialogue files
 * @returns {Promise<string|null>} Selected file path or null if canceled
 */
async function promptUserForFile(files) {
  if (files.length === 0) {
    console.error('No dialogue files found in public/dialogue directory');
    return null;
  }
  
  console.log('\nAvailable dialogue files:');
  files.forEach((file, index) => {
    const slideInfo = file.slide ? `(${file.slide})` : '';
    console.log(`${index + 1}. ${file.name} ${slideInfo}`);
  });
  
  // In a real interactive environment, we would prompt the user here
  // Since this is a script, we'll read from stdin
  
  console.log('\nEnter the number of the file to process (or press Enter to exit):');
  
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', (data) => {
      process.stdin.pause();
      
      const input = data.trim();
      if (!input) {
        resolve(null);
        return;
      }
      
      const selectedIndex = parseInt(input) - 1;
      if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= files.length) {
        console.error('Invalid selection');
        resolve(null);
        return;
      }
      
      resolve(files[selectedIndex]);
    });
  });
}

// Main execution when run directly
async function main() {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  // If a file path is provided as an argument, use it directly
  if (args.length > 0) {
    const dialogueFilePath = args[0];
    const outputPrefix = args[1] || 'dialogue';
    
    await processDialogue(dialogueFilePath, outputPrefix);
    return;
  }
  
  // Otherwise, list available files and prompt the user
  const dialogueFiles = await listDialogueFiles();
  const selectedFile = await promptUserForFile(dialogueFiles);
  
  if (!selectedFile) {
    console.log('No file selected, exiting');
    process.exit(0);
  }
  
  console.log(`Processing selected file: ${selectedFile.name}`);
  
  // Determine output prefix - use slide number if available
  let outputPrefix = 'dialogue';
  if (selectedFile.slide) {
    outputPrefix = selectedFile.slide;
  }
  
  await processDialogue(selectedFile.path, outputPrefix);
}

// Check if the script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Failed to process dialogue:', error);
    process.exit(1);
  });
}

export { processDialogue, generateAudioLine }