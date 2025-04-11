// Script to download free sound effects for the presentation
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

// Sound effect URLs from free sound libraries
// Using GitHub Gist for reliable direct downloads
const soundEffects = [
  {
    name: 'keyboard-typing',
    url: 'https://gist.githubusercontent.com/lovasoa/c1d7f3f54ea2f364b0c3f030e966e1c9/raw/89da0958afb745634945918a41693449a2a8138a/keyboard.mp3',
    outputPath: path.join(projectRoot, 'public/sounds/keyboard-typing.mp3'),
  },
  {
    name: 'whoosh',
    url: 'https://gist.githubusercontent.com/lovasoa/c1d7f3f54ea2f364b0c3f030e966e1c9/raw/89da0958afb745634945918a41693449a2a8138a/whoosh.mp3',
    outputPath: path.join(projectRoot, 'public/sounds/whoosh.mp3'),
  },
  {
    name: 'pop',
    url: 'https://gist.githubusercontent.com/lovasoa/c1d7f3f54ea2f364b0c3f030e966e1c9/raw/89da0958afb745634945918a41693449a2a8138a/pop.mp3',
    outputPath: path.join(projectRoot, 'public/sounds/pop.mp3'),
  },
  {
    name: 'success',
    // This URL was working from Pixabay
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3',
    outputPath: path.join(projectRoot, 'public/sounds/success.mp3'),
  },
  {
    name: 'tech-ambience',
    url: 'https://gist.githubusercontent.com/lovasoa/c1d7f3f54ea2f364b0c3f030e966e1c9/raw/89da0958afb745634945918a41693449a2a8138a/tech-ambience.mp3',
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

// Function to download a sound effect
async function downloadSoundEffect(name, url, outputPath) {
  try {
    console.log(`Downloading sound effect: ${name}`)

    // Make a request to download the file
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer',
    })

    // Save the audio file
    await ensureDirectoryExists(outputPath)
    await fs.promises.writeFile(outputPath, Buffer.from(response.data))
    console.log(`✅ Successfully saved to ${outputPath}`)
  } catch (error) {
    console.error(`❌ Error downloading sound effect: ${error.message}`)
    if (error.response) {
      console.error('Response status:', error.response.status)
    }
  }
}

// Process all sound effects
async function downloadAllSoundEffects() {
  console.log('Starting sound effect downloads...')

  for (const effect of soundEffects) {
    await downloadSoundEffect(effect.name, effect.url, effect.outputPath)
    // Add a small delay between requests to be nice to the servers
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  console.log('All sound effects have been downloaded')
}

// Execute the script
downloadAllSoundEffects().catch((error) => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
