Title: Octave Prompting Guide | Hume API

URL Source: https://dev.hume.ai/docs/text-to-speech-tts/prompting

Markdown Content:
Search or ask AI
/
Documentation
API Reference
Changelog
Discord
Introduction
Welcome to Hume AI
Getting your API keys
Support
Pricing
Text-to-speech (TTS)
Overview
Quickstart
Voices
Prompting
Acting instructions
Continuation
FAQ
Empathic Voice Interface (EVI)
Overview
Quickstart
Configuration
Features
Guides
FAQ
Expression Measurement
Overview
Processing batches of media files
Real-time measurement streaming
Custom models
FAQ
Resources
Terms of use
Billing
Errors
About the science
Use case guidelines
Privacy
Status
Roadmap
Start building
Get support
System
Text-to-speech (TTS)

Octave Prompting Guide

Copy page

A guide to effectively prompting Octave for voice creation and voice modulation.

Octave is a breakthrough speech-language model that combines LLM intelligence with advanced text-to-speech capabilities. Unlike traditional TTS systems that simply convert text to audio, Octave understands context, meaning, and the intricate relationships between voice, performance, and content. This deep comprehension allows Octave to generate nuanced, context-aware speech that naturally adapts to what’s being said and how it should be delivered.

Key principles for effective prompting

The effectiveness of Octave’s speech generation depends primarily on two factors:

Character matching - the alignment between voice description and speaker identity.
Semantic alignment - the relationship between voice style and content.

For example, a voice description of a “calm, reflective elderly woman reminiscing about her childhood” paired with the text “The sun dipped below the horizon, casting golden hues over the fields of my youth” creates strong semantic alignment. However, using the same voice description with text like “Let’s get ready to rumble!” would create a mismatch between the character’s nature and the content’s style.

In the TTS API, the text and description fields serve as the prompt for Octave. See our voices guide to understand how the description field functions differently with and without a specified voice.

Creating effective voice descriptions
Develop detailed character profiles

Create comprehensive character descriptions to guide Octave’s voice generation. Include relevant details about:

Demographics (age, gender, background)
Speaking style (pace, energy, formality)
Personality traits
Professional role or context
Emotional disposition

Example description:

“A middle-aged university professor with a gentle but authoritative voice, speaking deliberately and clearly, with occasional moments of dry humor and genuine enthusiasm for the subject matter.”

Incorporate emotional context

Octave can interpret and express emotional states when they’re clearly conveyed in the voice description or text content. Consider including:

Emotional state descriptions: “speaking with quiet determination”
Situational context: “delivering news of a surprising victory”
Character background: “a wise mentor sharing life lessons”
Example voice prompts

These examples demonstrate different approaches to voice description:

Title	Description
British Romance Novel Narrator	”The speaker is a sophisticated British female narrator with a gentle, warm voice, recounting the ending of a classic romance novel.”
Film Narrator	”An American, deep middle-aged male film trailer narrator for a film about chickens.”
70-year old Literary Voice	”A reflective 70 year old black woman with a calming tone, reminiscing about the profound impact of literature on her life, speaking slowly and poetically.”
Meditation Guru	”A mindfulness instructor with a gentle, soothing voice that flows at a slow, measured pace with natural pauses.”
Elderly Scottish Gentleman	”An elderly Scottish gentleman with a thick brogue, expressing awe and admiration.”
California Surfer	”The speaker is an excited Californian surfer dude, with a loud, stoked, and enthusiastic tone.”
Crafting text for optimal delivery
Match text tone to delivery

The emotional and stylistic qualities you want in the generated speech should be reflected in your input text. Octave analyzes the text’s meaning to inform its delivery. For example:

For angry delivery: “I am absolutely furious about this situation! This needs to STOP immediately!”
For calm explanation: “Let me explain this carefully. The process works in three simple steps.”
Align text with voice descriptions

When providing both text and a voice description, ensure they complement each other semantically and stylistically. This creates a cohesive output where the voice characteristics match the content’s requirements.

Example alignment:

Voice description: “A seasoned sports announcer with energetic, dynamic delivery”
Matching text: “And there’s the pitch! A massive swing and… it’s going, going, GONE! An incredible moment here at Central Stadium!”
Utilize natural punctuation

Standard punctuation helps Octave understand your intended phrasing and emphasis:

Periods (.) for complete stops
Commas (,) for natural pauses
Em dashes (—) for dramatic breaks
Exclamation marks (!) for emphasis
Question marks (?) for rising intonation

Avoid special formatting characters or symbols, as they may interfere with natural speech generation. This includes: HTML tags, Markdown syntax, Emojis, special symbols (~ # %), and non-standard punctuation.

Technical considerations
Text normalization

Octave performs best with normalized text that follows natural speech patterns. Consider these guidelines:

Spell out numbers: “forty-two” instead of “42”
Write dates in full: “February twenty-third” instead of “2/23”
Express time naturally: “three thirty in the afternoon” instead of “15:30”
Spell out abbreviations when meant to be spoken fully
Break up complex technical terms or codes into speakable segments
Normalized text examples
1	Original: "Meeting at 9:30AM on 3/15/24 in rm101"
2	Normalized: "Meeting at nine thirty AM on March fifteenth, twenty 
3	twenty-four in room one oh one"
4	
5	Original: "Temperature outside is 72.5°F"
6	Normalized: "Temperature outside is seventy-two point five degrees 
7	Fahrenheit"
8	
9	Original: "Contact support@company.com or call 1-800-555-0123"
10	Normalized: "Contact support at company dot com or call one eight 
11	hundred, five five five, zero one two three"
Multilingual support

Currently, Octave supports English and Spanish, with more languages planned for future releases. When working with multiple languages:

Provide voice descriptions in the same language as the input text
Maintain consistent language use within a single generation request
Follow language-specific punctuation and formatting conventions
Testing and refinement

As with any generative AI system, achieving optimal results with Octave often requires iteration and refinement. Here’s how to approach the testing and refinement process:

Voice refinement process

Follow these steps to refine your voice descriptions:

Start with a basic voice description
Test with various emotional states
Refine based on performance
Validate across different content types
Example of voice description refinement
1	Initial: "A professional newsreader"
2	Refined: "A veteran broadcast journalist with clear diction and 
3	measured pacing, naturally transitioning between serious and 
4	conversational tones while maintaining professional authority"
Content adaptation

Test how your voice descriptions handle different types of content to ensure consistency and appropriate delivery:

Example of content adaptation
1	Voice: "A wise mentor figure with gentle authority"
2	
3	Explanation: "Let me show you how this works. First, we'll..."
4	Encouragement: "You're getting it! See how much progress you've made?"
5	Correction: "Ah, not quite. Let's take a step back and think about..."
Best practices
Test variations of voice descriptions and text to find the most effective combinations for your use case
Keep voice descriptions focused and coherent rather than trying to combine too many different characteristics
Use natural language in both text and voice descriptions rather than technical or artificial-sounding constructs
Consider the intended context and audience when crafting voice descriptions
Maintain consistency in character voice across multiple utterances in the same context

Remember that Octave’s intelligence comes from its understanding of context and meaning. The more clearly you can express your intended delivery through natural language, the better the model can generate appropriate speech output.

Was this page helpful?
Yes
No
Previous

Octave Acting Instructions Guide

Guide to controlling voice expression in Octave TTS through acting instructions, speed settings, and silence parameters.

Next
Built with