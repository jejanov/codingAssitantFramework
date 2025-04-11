// Script to fetch sound effects from ElevenLabs Text to Sound Effects API
// This uses ElevenLabs' API to generate realistic sound effects
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// Replace with your actual ElevenLabs API key
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

// Sound effect descriptions and filenames
const soundEffects = [
  {
    name: 'keyboard-typing',
    description:
      'Realistic mechanical keyboard typing sounds for code typing animation, clicky and precise',
    outputPath: path.join(projectRoot, 'public/sounds/keyboard-typing.mp3'),
  },
  {
    name: 'whoosh',
    description:
      'Subtle whoosh sound when logo appears with glassmorphism effect, light and airy',
    outputPath: path.join(projectRoot, 'public/sounds/whoosh.mp3'),
  },
  {
    name: 'pop',
    description:
      'Subtle pop sound for animation bullet points appearing, light and playful',
    outputPath: path.join(projectRoot, 'public/sounds/pop.mp3'),
  },
  {
    name: 'success',
    description:
      'Soft success sound when code executes and title begins pulsing, positive achievement tone',
    outputPath: path.join(projectRoot, 'public/sounds/success.mp3'),
  },
  {
    name: 'tech-ambience',
    description:
      'Racing developers background sound with subtle engine hum, keyboard typing, and tech ambience. Dynamic and energetic but not distracting, with slight dust and motion effects that complement the racing video.',
    outputPath: path.join(projectRoot, 'public/sounds/tech-ambience.mp3'),
  },
]

// Create directories if they don't exist
async function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath)
  if (!fs.existsSync(dirname)) {
    await fs.promises.mkdir(dirname, { recursive: true })
  }
}

// Function to fetch a sound effect using ElevenLabs API
async function fetchSoundEffect(description, outputPath) {
  try {
    console.log(`Generating sound effect: ${description}`)

    // Make a request to ElevenLabs' Text to Sound Effects API
    // Updated endpoint based on the current ElevenLabs documentation
    const response = await axios({
      method: 'post',
      url: 'https://api.elevenlabs.io/v1/sound-generation',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      params: {
        output_format: 'mp3_44100_128',
      },
      data: {
        text: description,
        duration_seconds: null, // Let ElevenLabs determine optimal duration
        prompt_influence: 0.5, // Medium influence for better results (0-1 range)
      },
      responseType: 'arraybuffer',
    })

    // Save the audio file
    await ensureDirectoryExists(outputPath)
    await fs.promises.writeFile(outputPath, Buffer.from(response.data))
    console.log(`✅ Successfully saved to ${outputPath}`)
  } catch (error) {
    console.error(`❌ Error generating sound effect: ${error.message}`)
    if (error.response) {
      console.error('API Response Status:', error.response.status)
      if (error.response.data) {
        try {
          // Try to parse the error response data if it's not binary
          const errorData = Buffer.from(error.response.data).toString('utf8')
          console.error('Error details:', errorData)
        } catch (parseError) {
          console.error('Could not parse error response data')
        }
      }
    }
  }
}

// Process all sound effects
async function processAllSoundEffects() {
  console.log('Starting sound effect generation with ElevenLabs...')

  // Check for API key
  if (!ELEVENLABS_API_KEY) {
    console.error(
      'ERROR: ElevenLabs API key is missing. Set the ELEVENLABS_API_KEY environment variable.'
    )
    process.exit(1)
  }

  for (const effect of soundEffects) {
    await fetchSoundEffect(effect.description, effect.outputPath)
    // Add a small delay between requests to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log('All sound effects have been processed')
}

// Execute the script
processAllSoundEffects().catch((error) => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
