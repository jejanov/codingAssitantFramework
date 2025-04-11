// Simple script to test playing the keyboard sound
import { Howl } from 'howler'
import { fileURLToPath } from 'url'
import path from 'path'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

console.log('Testing keyboard sound playback...')

// Create a Howl instance for the keyboard sound
const keyboardSound = new Howl({
  src: [path.join(projectRoot, 'public/sounds/keyboard-typing.mp3')],
  volume: 0.5,
  html5: true,
  onload: () => {
    console.log('Keyboard sound loaded successfully!')
    console.log('Playing keyboard sound...')
    keyboardSound.play()
  },
  onplay: () => {
    console.log('Keyboard sound is playing!')
  },
  onend: () => {
    console.log('Keyboard sound playback ended.')
    process.exit(0)
  },
  onloaderror: (id, err) => {
    console.error('Error loading keyboard sound:', err)
    process.exit(1)
  },
  onplayerror: (id, err) => {
    console.error('Error playing keyboard sound:', err)
    process.exit(1)
  },
})

// Prevent script from exiting immediately
setTimeout(() => {
  console.log('Timeout reached, exiting...')
  process.exit(0)
}, 10000)
