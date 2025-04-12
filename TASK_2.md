# Task 2: Refactor Dialogue Audio Generation for Voice Reuse

## Objective
Refactor the `generateDialogueAudio.js` script to reuse voice IDs for the same character, following HUME API best practices. Currently, a new voice is generated for each dialogue line, which is inefficient and may cause inconsistency in character voices.

## Requirements
- Use HUME API voice generation and saving capabilities
- Create and save a unique voice for each character (Dev A, Dev B, etc.)
- Reuse the same voice ID for all dialogue lines from the same character
- Store voice IDs in the metadata for potential future use

## Approach

### 1. Create Voice Management Functions
- [x] Implement `getOrCreateVoice()` function to check for existing voices or create new ones
- [x] Implement `saveVoice()` function to save generated voices for reuse

### 2. Update Audio Generation Process
- [x] Add voice caching mechanism to track character voice IDs
- [x] Modify `generateAudioLine()` to use the cached voice IDs
- [x] Use voice with acting instructions for consistent character voice with correct emotion

### 3. Update Metadata Structure
- [x] Add voices object to metadata to store voice IDs by speaker
- [x] Update metadata serialization to include voice information

### 4. Testing and Validation
- [x] Verify multiple lines from the same character use the same voice ID
- [x] Ensure proper error handling for voice creation and reuse
- [x] Validate that dialogue playback works correctly with the new voice reuse system

## Technical Details

### Voice Cache Implementation
```javascript
// Will track voice IDs by speaker name
const voiceCache = {
  "Dev A": "voice-id-123", 
  "Dev B": "voice-id-456"
};
```

### Voice API Calls
- First dialogue line: Generate voice and save ID
- Subsequent lines: Reuse saved voice ID with acting instructions

### Metadata Format
```json
{
  "title": "Dialogue Title",
  "audioFiles": [...],
  "voices": {
    "Dev A": "voice-id-123",
    "Dev B": "voice-id-456"
  }
}
```

## Benefits
- Reduced number of API calls to generate voices
- Consistent voice characteristics for each character
- More efficient audio generation process
- Better alignment with HUME API best practices