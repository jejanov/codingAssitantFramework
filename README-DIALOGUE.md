# AI Dialogue Generation and Playback System

This system provides tools to generate natural-sounding dialogue using Hume.ai's Octave TTS API and play it back in your application or terminal. The dialogue system takes a JSON file with conversation text and generates individual audio files for each line, maintaining separate voices for different speakers.

## Setup

1. **Install dependencies**:
   ```bash
   npm install dotenv node-fetch
   ```

2. **Configure your Hume.ai API key**:
   Create a `.env` file in the project root with your API key:
   ```
   HUME_API_KEY=your_api_key_here
   ```
   
   Get your API key from the [Hume AI Platform](https://platform.hume.ai/settings/keys).

3. **Optional**: Configure voice descriptions:
   ```
   DEV_A_VOICE_DESCRIPTION="A professional male developer, 30s, with a clear conversational tone"
   DEV_B_VOICE_DESCRIPTION="A technical expert male developer, enthusiastic about AI technology"
   ```

## 1. Generate Dialogue Audio

### Create a Dialogue JSON File

Create a JSON file with your dialogue content:

```json
{
  "title": "My Dialogue",
  "dialogue": [
    {
      "speaker": "Dev A",
      "line": "Hello there!"
    },
    {
      "speaker": "Dev B",
      "line": "Hi, how's it going?"
    }
  ]
}
```

### Generate Audio Files

Run the generation script:

```bash
node scripts/generateDialogueAudio.js path/to/dialogue.json output-prefix
```

For example:
```bash
node scripts/generateDialogueAudio.js public/dialogue/dev-conversation.json ai-demo
```

This will:
- Generate MP3 files for each line using Hume.ai's Octave TTS
- Save them to `public/sounds/dialogue/`
- Create a metadata file (`ai-demo-metadata.json` in this example)

### Special Text Features

You can include emotional cues in your dialogue:
- `[laughs]` - Will be converted to laughter in the audio
- `[typing sounds]` - Creates a pause effect as if typing
- `[chuckles]` - Adds a small laugh
- `[sarcastically]` - Adds sarcastic tone
- `[triumphantly]` - Adds triumphant tone

## 2. Playing the Dialogue

### Terminal Playback (for testing)

Use the terminal player to test your dialogue:

```bash
node scripts/playDialogue.js path/to/metadata.json
```

If no path is provided, it will use `public/sounds/dialogue/ai-demo-metadata.json` by default:
```bash
node scripts/playDialogue.js
```

**Controls**:
- Press SPACE to pause/resume
- Press N for next line
- Press Q to quit
- Press T to toggle text-to-speech mode (if audio files are problematic)

### Browser Playback

#### Using the DialoguePlayer Component

```jsx
import DialoguePlayer from './src/components/slides/DialoguePlayer';

function MyComponent() {
  return (
    <DialoguePlayer 
      metadataPath="/dialogue/ai-demo-metadata.json"
      autoPlay={false}
      minPauseDuration={500}
      maxPauseDuration={1500}
      showTranscript={true}
      highlightCurrentLine={true}
      onComplete={() => console.log('Dialogue finished')}
    />
  );
}
```

#### Using the DialogueDemo Component

The DialogueDemo component provides a complete UI for displaying and playing dialogue:

```jsx
import DialogueDemo from './src/components/slides/DialogueDemo';

function MyPage() {
  return (
    <div className="page-content">
      <DialogueDemo />
    </div>
  );
}
```

## Component Props

**DialoguePlayer**:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| metadataPath | string | required | Path to the metadata JSON file |
| autoPlay | boolean | false | Whether to start playing automatically |
| minPauseDuration | number | 500 | Minimum pause between lines (ms) |
| maxPauseDuration | number | 1500 | Maximum pause between lines (ms) |
| showTranscript | boolean | true | Show text transcript |
| highlightCurrentLine | boolean | true | Highlight the current line |
| onComplete | function | undefined | Called when playback finishes |

## Troubleshooting

### Audio Files Not Playing

1. **Check File Generation**:
   - Make sure you've run the generation script
   - Check the `public/sounds/dialogue/` directory for MP3 files
   - Verify the metadata JSON file has correct paths

2. **API Key Issues**:
   - Ensure your Hume.ai API key is valid
   - Check for error messages during generation

3. **File Path Problems**:
   - For browser playback, paths are relative to your public directory
   - For terminal playback, paths should be relative to your project root

4. **Corrupted Audio Files**:
   - If you see errors like `AudioFileOpen failed ('dta?')`, the audio file may be corrupted
   - Try using text-to-speech mode by pressing 'T' during playback
   - The player will automatically try to use alternative playback methods

### Player Compatibility

The terminal player supports:
- macOS: using `afplay` (built-in), with fallbacks to QuickTime Player and system text-to-speech
- Windows: using PowerShell's SoundPlayer with multiple fallback options
- Linux: using `mplayer`, `aplay`, or `mpg123` (one must be installed)

### Enhanced Features

The terminal player includes several robustness features:
- **Multiple audio players**: If one fails, it tries alternatives
- **Text-to-speech fallback**: Uses system TTS if audio files are missing or corrupted
- **Auto path resolution**: Tries multiple paths to locate audio files
- **Corrupted file detection**: Checks if files are valid audio before attempting playback
- **Auto-continuation**: Even if errors occur, tries to continue to the next line

## Technical Details

### Files

- `scripts/generateDialogueAudio.js` - Converts dialogue to audio files
- `scripts/playDialogue.js` - Terminal-based playback
- `src/components/slides/DialoguePlayer.tsx` - React component for playback
- `src/components/slides/DialogueDemo.tsx` - Complete dialogue UI