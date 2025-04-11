// Script to fetch sound effects from OpenAI's TTS API
// This uses OpenAI's text-to-speech API in a creative way to generate sound effects
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

// Replace with your actual OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Sound effect descriptions from slide instructions
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
      'Tech ambient background sound at low volume to establish atmosphere, subtle electronic loops',
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

// Function to fetch a sound effect using OpenAI's API
async function fetchSoundEffect(description, outputPath) {
  try {
    console.log(`Generating sound effect: ${description}`)

    // Make a request to OpenAI's TTS API
    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/audio/speech',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'tts-1',
        voice: 'alloy',
        input: `<silence>1s</silence>[sound effect: ${description}]<silence>1s</silence>`,
        response_format: 'mp3',
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
      console.error('API Response:', error.response.data.toString())
    }
  }
}

// Process all sound effects
async function processAllSoundEffects() {
  console.log('Starting sound effect generation...')

  // Check for API key
  if (!OPENAI_API_KEY) {
    console.error(
      'ERROR: OpenAI API key is missing. Set the OPENAI_API_KEY environment variable.'
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
