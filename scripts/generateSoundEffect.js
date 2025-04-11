// scripts/generateSoundEffect.js
require('dotenv').config()
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

const ELEVEN_LABS_API_KEY = process.env.ELEVENLABS_API_KEY

async function generateSoundEffect(
  prompt,
  outputFileName,
  durationSeconds = null,
  promptInfluence = 0.5
) {
  if (!ELEVEN_LABS_API_KEY) {
    console.error('Error: ELEVENLABS_API_KEY not found in .env file')
    process.exit(1)
  }

  console.log(`Generating sound effect for prompt: "${prompt}"`)

  try {
    const response = await fetch(
      'https://api.elevenlabs.io/v1/sound-generation',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text: prompt,
          duration_seconds: durationSeconds, // null lets ElevenLabs determine optimal duration
          prompt_influence: promptInfluence, // value between 0 and 1
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Eleven Labs API error: ${response.status} ${response.statusText} - ${errorText}`
      )
    }

    const buffer = await response.arrayBuffer()
    const outputDir = path.join(__dirname, '../public/sounds')

    // Ensure the directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const outputPath = path.join(outputDir, outputFileName)

    fs.writeFileSync(outputPath, Buffer.from(buffer))
    console.log(
      `✅ Sound effect successfully generated and saved to: ${outputPath}`
    )
  } catch (error) {
    console.error('❌ Error generating sound effect:', error.message)
    process.exit(1)
  }
}

// Get arguments from command line
const args = process.argv.slice(2)
const prompt = args[0]
const outputFileName = args[1] || 'generated-sound-effect.mp3'
const durationSeconds = args[2] ? parseFloat(args[2]) : null
const promptInfluence = args[3] ? parseFloat(args[3]) : 0.5

if (!prompt) {
  console.error('Error: Please provide a text prompt as the first argument')
  console.log(
    'Usage: node generateSoundEffect.js "Your sound effect description" [output-filename.mp3] [duration-seconds] [prompt-influence]'
  )
  console.log(
    'Example: node generateSoundEffect.js "Racing car engine revving with keyboard typing overlay" race-ambience.mp3 8 0.7'
  )
  process.exit(1)
}

generateSoundEffect(prompt, outputFileName, durationSeconds, promptInfluence)
