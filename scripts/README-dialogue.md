# Dialogue Generation and Playback

This system converts JSON dialogue files into voice-acted audio conversations using Hume.ai's Octave TTS and plays them back with natural pacing in your React application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the project root with the following variables:
   ```
   HUME_API_KEY=your_api_key_here
   DEV_A_VOICE_DESCRIPTION="A professional male developer, 30s, with a clear conversational tone and casual demeanor"
   DEV_B_VOICE_DESCRIPTION="A technical expert male developer, mid 30s, energetic and enthusiastic about AI technology"
   ```

   You can get your Hume.ai API key by signing up at [platform.hume.ai](https://platform.hume.ai) and visiting the API keys page.

   **Optional**: If you have saved voice IDs that you want to reuse:
   ```
   HUME_A_VOICE_ID=your_saved_voice_id
   HUME_B_VOICE_ID=your_saved_voice_id
   ```

## Generating Dialogue Audio

1. **Create a JSON dialogue file** 
   
   The easiest way is to use the LLM prompt in `/public/dialogue/README.md` to generate a properly structured dialogue file. Save it as `dialogue_slide_XX.json` in the `/public/dialogue/` directory.

   Example format:
   ```json
   {
     "title": "Slide 03: Productivity Gains",
     "dialogue": [
       {
         "speaker": "Dev A",
         "line": "Hello there!",
         "emotion": "curious, slightly skeptical",
         "speed": 0.95,
         "trailingSilence": 0.3
       },
       {
         "speaker": "Dev B",
         "line": "Hi, how's it going?",
         "emotion": "enthusiastic, confident",
         "speed": 1.1,
         "trailingSilence": 0.2
       }
     ]
   }
   ```

2. **Run the generation script:**
   
   Interactive mode (recommended):
   ```bash
   node scripts/generateDialogueAudio.js
   ```
   
   Direct mode:
   ```bash
   node scripts/generateDialogueAudio.js public/dialogue/dialogue_slide_XX.json
   ```
   
   This will:
   - Create consistent voices for each character (Dev A, Dev B)
   - Generate MP3 files for each line using Hume.ai's Octave TTS
   - Apply emotional parameters from the dialogue file
   - Detect slide number from filename and organize files by slide
   - Save audio files to `public/sounds/dialogue/slideXX/`
   - Create a metadata file with information about all generated files

## Using the DialoguePlayer Component

Import and use the `DialoguePlayer` component in your React application:

```jsx
import DialoguePlayer from './components/slides/DialoguePlayer';

function MyComponent() {
  return (
    <DialoguePlayer 
      metadataPath="/dialogue/my-dialogue-metadata.json"
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

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| metadataPath | string | required | Path to the metadata JSON file |
| autoPlay | boolean | false | Whether to start playing automatically |
| minPauseDuration | number | 500 | Minimum pause between lines (ms) |
| maxPauseDuration | number | 1500 | Maximum pause between lines (ms) |
| showTranscript | boolean | true | Show text transcript |
| highlightCurrentLine | boolean | true | Highlight the current line |
| onComplete | function | undefined | Called when playback finishes |

## Demo

To see a complete demo:

1. Create sample dialogue: `public/dialogue/dev-conversation.json` (already included)
2. Generate audio: `node scripts/generateDialogueAudio.js public/dialogue/dev-conversation.json ai-demo`
3. Start the app: `npm run dev`
4. View the DialogueDemo component

## Voice Customization with Hume.ai

Hume.ai's Octave TTS allows rich customization through voice descriptions. You can:

1. **Create dynamic voices with descriptions**:
   ```
   DEV_A_VOICE_DESCRIPTION="A calm female software engineer in her 40s, speaks authoritatively but warmly"
   ```

2. **Add acting instructions** to influence delivery:
   ```
   DEV_A_VOICE_DESCRIPTION="A male developer who speaks with excitement and enthusiasm about AI technology"
   ```

3. **Save and reuse voices** by their IDs:
   - First create a voice using a description
   - Save the voice ID returned in the API response
   - Reuse that exact voice by setting `HUME_A_VOICE_ID` in your .env file

## Implementation Details

- The dialogue audio generator uses Hume.ai's Octave TTS API for LLM-backed natural sounding speech
- Each dialogue line is saved as a separate MP3 file
- Voices are context-aware, understanding the meaning of words to deliver natural speech
- The player component plays the files in sequence with randomized natural pauses
- Voice selection is based on the speaker name in the dialogue file
- Customization options include voice descriptions, playback speed, pause length, and visual styling