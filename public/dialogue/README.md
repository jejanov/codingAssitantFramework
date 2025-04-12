# Dialogue Generator for AI Presentation Slides

This directory contains dialogue JSON files that drive the conversational elements of the AI Coding Presentation. Each dialogue file corresponds to a specific slide in the presentation and contains a structured conversation between two developers discussing AI-assisted coding.

## Directory Structure

- `dialogue_slide_XX.json` - Slide-specific dialogue files
- Generated audio files are stored in: `/public/sounds/dialogue/slideXX/`

## Creating New Dialogue

### Step 1: Generate Dialogue Content

Use the prompt below with an LLM (Claude, GPT-4, etc.) to generate a properly structured dialogue JSON file:

```
# Enhanced Dialogue Generation for AI Presentation Slides

I need you to create a natural, engaging dialogue between two developers (Dev A and Dev B) discussing [TOPIC] for slide [NUMBER]. The dialogue should illustrate how AI coding tools are transforming software development.

## Output Format

Provide your response as a complete, valid JSON object with this structure:

```json
{
  "title": "Slide [NUMBER]: [BRIEF TITLE]",
  "dialogue": [
    {
      "speaker": "Dev A",
      "line": "First line of dialogue.",
      "emotion": "curious, slightly skeptical",
      "speed": 0.95,
      "trailingSilence": 0.3
    },
    {
      "speaker": "Dev B",
      "line": "Response to first line.",
      "emotion": "enthusiastic, confident",
      "speed": 1.1,
      "trailingSilence": 0.2
    }
  ]
}
```

## Important Parameters

For EACH dialogue line, include ALL of these parameters:

1. **speaker**: Either "Dev A" or "Dev B" (exactly as written, case-sensitive)
2. **line**: The actual dialogue text (natural conversation, 1-3 sentences per line)
3. **emotion**: 2-4 descriptive words for emotional tone and delivery style
   - Be specific and nuanced (e.g., "quietly confident" instead of just "confident")
   - Match the emotion to the content and character
   - These act as "acting instructions" for the HUME API voice generation
4. **speed**: Speaking rate (0.8=slower, 1.0=normal, 1.2=faster)
   - Use slower speeds (0.8-0.9) for thoughtful, serious, or reflective moments
   - Use faster speeds (1.1-1.2) for excited, enthusiastic, or urgent statements
   - This is non-linear; 0.5 is not exactly half speed, but noticeably slower
   - Range: 0.65 (very slow) to 1.5 (very fast), values outside this range may sound unnatural
5. **trailingSilence**: Pause after speech in seconds (0.2-1.0)
   - Use longer pauses (0.5-0.8) after questions or important points
   - Use shorter pauses (0.2-0.4) during rapid exchanges
   - Use medium pauses (0.4-0.6) for natural conversation flow
   - Can go up to 4.0 seconds for dramatic pauses or to allow time for reflection

## Character Profiles

**Dev A (The Skeptic)**:
- Curious but initially skeptical about AI coding tools
- Asks thoughtful questions and raises practical concerns
- Gradually becomes more open to the possibilities
- Emotion examples: "curious but cautious", "professionally skeptical", "thoughtfully considering", "mildly surprised"

**Dev B (The Enthusiast)**:
- Experienced AI tool user who's seen the benefits firsthand
- Confident, enthusiastic, and forward-thinking
- Balances excitement with practical examples and data
- Emotion examples: "confidently explaining", "enthusiastically sharing", "professionally reassuring", "excited but measured"

## Conversation Structure

Create a dialogue with 10-15 exchanges that follows this emotional arc:

1. **Opening** (2-3 exchanges): 
   - Introduction of topic, Dev A expresses curiosity/skepticism
   - Dev B responds with enthusiasm

2. **Exploration** (3-4 exchanges): 
   - Dev A asks probing questions or raises concerns
   - Dev B provides examples and evidence

3. **Demonstration** (2-3 exchanges):
   - Specific AI coding capabilities discussed
   - Compare traditional vs AI-assisted development

4. **Consideration** (2-3 exchanges):
   - Address practical limitations or concerns
   - Show balanced perspective

5. **Conclusion** (2-3 exchanges):
   - Dev A acknowledges benefits but may retain some reservation
   - Dev B offers forward-looking perspective
   - End on a positive, future-oriented note

## Natural Speech Elements

Include these elements to make the dialogue sound realistic:

- Use natural speech markers like "...", "hmm", "well"
- Include conversational indicators: [laughs], [nods], [typing sounds]
- Vary sentence length and structure
- Use contractions and informal language
- Reference visual elements that might be on the slide

For dialogue markers like [laughs], use them sparingly and in the text itself. The emotion parameter will control how they're delivered.

## Advanced Emotion Techniques

The HUME API responds exceptionally well to these emotion direction techniques:

1. **Combine delivery style with emotional state**:
   - "excited but speaking quietly" (combines emotion + volume)
   - "professionally concerned, measured tone" (combines emotion + pacing)
   - "enthusiastically explaining to a colleague" (combines emotion + audience)

2. **Specify performance context**:
   - "speaking in a small meeting room"
   - "presenting to a conference audience"
   - "explaining in a one-on-one mentoring session"

3. **Indicate vocal characteristics**:
   - "clear articulation with mild emphasis"
   - "slightly breathy, reflective tone"
   - "projecting voice with confidence"

4. **Emotional transitions**:
   - "initially hesitant, growing more confident"
   - "calmly starting but becoming more animated"
   - "professionally neutral with underlying excitement"

## File Naming

The JSON file must be named: `dialogue_slide_[XX].json` where [XX] is the slide number (e.g., `dialogue_slide_03.json`).

## Example Lines with Parameters

```json
{
  "speaker": "Dev A",
  "line": "But what about debugging? Doesn't AI-generated code introduce new problems we'd have to fix anyway?",
  "emotion": "genuinely concerned, slightly challenging, professional tone",
  "speed": 0.95,
  "trailingSilence": 0.5
}
```

```json
{
  "speaker": "Dev B",
  "line": "Great question! In our team, we've found that AI tools actually reduce bugs by about 40%. They're particularly good at avoiding common pitfalls that humans tend to make when writing boilerplate code.",
  "emotion": "enthusiastically explaining to a colleague, professionally reassuring",
  "speed": 1.05,
  "trailingSilence": 0.3
}
```

```json
{
  "speaker": "Dev A",
  "line": "Hmm, that's actually pretty impressive. [thoughtful pause] I've been skeptical because of some early experiments we did, but maybe the technology has improved since then.",
  "emotion": "initially skeptical, gradually becoming more receptive, thoughtfully considering",
  "speed": 0.9,
  "trailingSilence": 0.6
}
```

Replace [TOPIC], [NUMBER], and [BRIEF TITLE] with the specific details for your slide. Generate a complete, properly formatted JSON file that's ready to use with our audio generation system.
```

### Step 2: Save the Dialogue File

1. Save the generated JSON as `dialogue_slide_XX.json` in this directory (`public/dialogue/`)
2. Make sure the file name includes the slide number (e.g., `dialogue_slide_03.json`)
3. Ensure the JSON is properly formatted and valid

## Generating Audio Files

Once you've created your dialogue JSON file, use the `generateDialogueAudio.js` script to convert it to audio files:

### Option 1: Direct Command (specify file)

```bash
# Navigate to project root
cd /path/to/project

# Run with specific dialogue file
node scripts/generateDialogueAudio.js public/dialogue/dialogue_slide_XX.json
```

### Option 2: Interactive Mode (select from available files)

```bash
# Navigate to project root
cd /path/to/project

# Run in interactive mode
node scripts/generateDialogueAudio.js
```

This will:
1. Show a list of available dialogue files
2. Let you select which one to process
3. Automatically detect the slide number from the filename
4. Create a slide-specific output directory (`public/sounds/dialogue/slideXX/`)
5. Generate audio files with consistent voices for each character

### Required Environment Variables

Make sure you have a `.env` file in the project root with your HUME API key:

```
HUME_API_KEY=your_hume_api_key_here
DEV_A_VOICE_DESCRIPTION="A professional male developer, 30s, with a clear conversational tone and casual demeanor"
DEV_B_VOICE_DESCRIPTION="A technical expert male developer, mid 30s, energetic and enthusiastic about AI technology"
```

## How Audio Generation Works

The script:

1. Creates a unique voice for each character (Dev A, Dev B) on first use
2. Reuses the same voice for subsequent lines from the same character
3. Applies emotional instructions based on the "emotion" parameter
4. Adjusts speaking rate based on the "speed" parameter
5. Adds pauses after each line based on the "trailingSilence" parameter
6. Places all files in a slide-specific directory structure
7. Creates a metadata.json file that the DialoguePlayer component uses to play the dialogue

## Supported Emotions

The HUME API supports a wide range of emotional instructions. Some effective examples include:

- "excited, eager to share"
- "thoughtful, considering seriously"
- "skeptical but curious"
- "confidently explaining"
- "surprised and impressed"
- "carefully articulating"
- "professionally concerned"
- "warmly encouraging"

Combine 2-4 descriptive terms for best results. The voice will maintain its character while expressing these emotions.

## Troubleshooting

- **Invalid JSON**: Ensure your dialogue file is valid JSON (check with a JSON validator)
- **API Errors**: Check your HUME API key and ensure you have sufficient quota
- **Missing Audio**: Verify the slide number is correctly formatted in the filename
- **Voice Inconsistency**: The script caches voices by speaker name - ensure consistent naming

For additional help, refer to the HUME API documentation in `/DOCUMENTATION/HUME/`.