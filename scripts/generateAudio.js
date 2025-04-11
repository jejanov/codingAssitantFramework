// scripts/generateAudio.js
require('dotenv').config()
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY
const VOICE_ID = process.env.ELEVEN_LABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB' // Default to Adam voice if not specified

async function generateAudio(prompt, outputFileName) {
  if (!ELEVEN_LABS_API_KEY) {
    console.error('Error: ELEVEN_LABS_API_KEY not found in .env file')
    process.exit(1)
  }

  console.log(`Generating audio for prompt: "${prompt}"`)
  console.log(`Using voice ID: ${VOICE_ID}`)

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text: prompt,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
          model_id: 'eleven_monolingual_v1',
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
    console.log(`Audio successfully generated and saved to: ${outputPath}`)
  } catch (error) {
    console.error('Error generating audio:', error)
    process.exit(1)
  }
}

// Get arguments from command line
const args = process.argv.slice(2)
const prompt = args[0]
const outputFileName = args[1] || 'generated-ambience.mp3'

if (!prompt) {
  console.error('Error: Please provide a text prompt as the first argument')
  console.log(
    'Usage: node generateAudio.js "Your prompt here" [output-filename.mp3]'
  )
  process.exit(1)
}

generateAudio(prompt, outputFileName)
