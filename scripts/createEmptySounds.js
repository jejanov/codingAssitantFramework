// Script to create empty placeholder sound files
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// Base64 encoded minimal MP3 file (1 second of silence)
const silentMP3Base64 = `//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAABAAACCQD///////////////////////////////////////////8AAABQTEFNRTMuMTAwBEgAAAAAAAAAABUAJAIATQABAgECAAAAAQBBQQBBQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==`

// Sound effect list
const soundEffects = [
  {
    name: 'keyboard-typing',
    outputPath: path.join(projectRoot, 'public/sounds/keyboard-typing.mp3'),
  },
  {
    name: 'whoosh',
    outputPath: path.join(projectRoot, 'public/sounds/whoosh.mp3'),
  },
  { name: 'pop', outputPath: path.join(projectRoot, 'public/sounds/pop.mp3') },
  {
    name: 'success',
    outputPath: path.join(projectRoot, 'public/sounds/success.mp3'),
  },
  {
    name: 'tech-ambience',
    outputPath: path.join(projectRoot, 'public/sounds/tech-ambience.mp3'),
  },
]

// Create directories if they don't exist
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath)
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true })
  }
}

// Create an empty sound file
function createEmptySoundFile(outputPath) {
  try {
    console.log(`Creating empty sound file at: ${outputPath}`)

    // Ensure the directory exists
    ensureDirectoryExists(outputPath)

    // Create a silent MP3 file
    const buffer = Buffer.from(silentMP3Base64, 'base64')
    fs.writeFileSync(outputPath, buffer)

    console.log(`✅ Successfully created empty sound file at ${outputPath}`)
  } catch (error) {
    console.error(`❌ Error creating empty sound file: ${error.message}`)
  }
}

// Process all sound effects
function createAllEmptySoundFiles() {
  console.log('Creating empty sound files...')

  for (const effect of soundEffects) {
    createEmptySoundFile(effect.outputPath)
  }

  console.log('All empty sound files have been created')
}

// Execute the script
createAllEmptySoundFiles()
