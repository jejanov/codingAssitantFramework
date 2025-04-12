Title: Octave Acting Instructions Guide | Hume API

URL Source: https://dev.hume.ai/docs/text-to-speech-tts/acting-instructions

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

Octave Acting Instructions Guide

Copy page

Guide to controlling voice expression in Octave TTS through acting instructions, speed settings, and silence parameters.

Octave not only supports choosing or designing voices, but also offers sophisticated control over how speech is delivered. These controls, which we refer to as “acting instructions,” allow you to shape how Octave generates expressive speech from your text. Through acting instructions, you can specify emotional tone, vocal style, and delivery characteristics to achieve your desired speech output. This capability leverages Octave’s understanding of context and meaning to create naturally expressive speech that responds to nuanced direction, in some ways similar to how a voice actor would interpret a script.

Acting instructions enable you to specify aspects of speech delivery such as:

Emotional tone: happiness, sadness, excitement, nervousness, etc.
Delivery style: whispering, shouting, rushed speaking, measured pace, etc.
Speaking rate: the rate at which the speech is delivered, faster or slower.
Trailing silence: injecting pauses in the speech for a specified duration in seconds.
Performance context: speaking to a crowd, intimate conversation, etc.

See our Prompting Guide for more detailed information and best practices for prompting Octave.

In the following section, we’ll explore the ways in which you can provide acting instructions to Octave through the API.

Providing acting instructions

The TTS API offers parameters which allow you to control how an individual utterance is performed. These parameters can be used individually or combined for precise control over speech output:

description: provide acting instructions in natural language.
speed: adjust the relative speaking rate on a non-linear scale from 0.25 (much slower) to 3.0 (much faster), where 1.0 represents normal speaking pace. Note that changes are not proportional to the value provided - for example, setting speed to 2.0 will make speech faster but not exactly twice as fast as the default.
trailing_silence: specify a duration of trailing silence (in seconds) to add to an utterance.

In this section we’ll leverage acting instructions to have Octave output speech for a session in guided meditation.

Before we apply acting instructions, let’s first take a look at a request that does not contain any acting instructions:

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      {
>	        "text": "Let us begin by taking a deep breath in.",
>	        "voice": {
>	          "name": "Ava Song",
>	          "provider": "HUME_AI"
>	        }
>	      },
>	      { 
>	        "text": "Now, slowly exhale."
>	      }
>	    ]
>	  }'

Without acting instructions, Octave will infer how to deliver the speech from the base voice’s description and the provided text input.

In the following steps, we’ll iteratively improve Octave’s delivery by specifying different types of acting instructions to better simulate guided meditation.

1
Guide delivery with natural language

Let’s begin by providing a description to guide the delivery of these utterances to be calmer and more instructive:

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      {
>	        "text": "Let us begin by taking a deep breath in.",
>	        "description": "calm, pedagogical",
>	        "voice": {
>	          "name": "Ava Song",
>	          "provider": "HUME_AI"
>	        }
>	      },
>	      { 
>	        "text": "Now, slowly exhale.",
>	        "description": "calm, serene"
>	      }
>	    ]
>	  }'
2
Control speed of delivery

While the descriptions help to make the voice sound more appropriate for our use case, we now want to adjust the speed of delivery to be slower to create an atmosphere better suited for meditation:

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      {
>	        "text": "Let us begin by taking a deep breath in.",
>	        "description": "calm, pedagogical",
>	        "voice": {
>	          "name": "Ava Song",
>	          "provider": "HUME_AI"
>	        },
>	        "speed": "0.65"
>	      },
>	      { 
>	        "text": "Now, slowly exhale.",
>	        "description": "calm, serene",
>	        "speed": "0.65"
>	      }
>	    ]
>	  }'
3
Injecting pauses

Finally, in this guided meditation, it would be helpful to give the participants some time to actually take a breath! To achieve this we can introduce a pause between utterances by specifying a trailing silence duration for the first utterance.

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      {
>	        "text": "Let us begin by taking a deep breath in.",
>	        "description": "calm, pedagogical",
>	        "voice": {
>	          "name": "Ava Song",
>	          "provider": "HUME_AI"
>	        },
>	        "speed": 0.65,
>	        "trailing_silence": 4
>	      },
>	      { 
>	        "text": "Now, slowly exhale.",
>	        "description": "calm, serene",
>	        "speed": 0.65
>	      }
>	    ]
>	  }'

By combining natural language descriptions, speed adjustments, and strategic pauses, you can achieve nuanced and effective speech delivery with Octave. This guided meditation example demonstrates how these parameters transform a basic utterance into a crafted experience with appropriate pacing and atmosphere. As you develop your own applications, consider how these controls can work together to create the ideal delivery for your specific use case.

Best practices
Use precise emotions: Instead of broad terms like “sad”, use specific emotions like “melancholy” or “frustrated”.
Combine for nuance: Pair emotions with delivery styles, e.g., “excited but whispering” or “confident, professional tone”.
Indicate pacing: Use terms like “rushed”, “measured”, “deliberate pause” to adjust speech rhythm.
Specify the audience: Instructions like “speaking to a child” or “addressing a large crowd” help shape delivery.
Keep it concise: Short instructions like “sarcastic”, “angry”, “whispering”, “loudly” work best.
Use speed for adjusting speech rate: Rather than using the description field to instruct slower or faster speech, leverage the speed parameter.
Examples

The table below demonstrates how acting instructions can transform the same text into different delivery styles:

Text Input	Acting Instruction	Output Style
”Are you serious?“	whispering, hushed	Soft, secretive tone
”We need to move, now!“	urgent, panicked	Fast, tense delivery
”Welcome, everyone.”	warm, inviting	Friendly, engaging tone
”I can’t believe this…“	sarcastic	Dry, exaggerated inflection
Acting instructions vs. voice generation

When providing a description in your request, it’s important to understand how the field functions differently when specifying or not specifying a voice.

Voice generation: when no voice is specified, Octave will generate an entirely new voice based on the provided text and description.

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      { 
>	        "text": "Today we'\''ll explore ancient writing systems.",
>	        "description": "Eastern European scholar with a high quality voice, perfect for nonfiction and educational content."
>	      }
>	    ]
>	  }'

Acting instructions: the description field will be interpreted as acting instructions when you specify a voice. In the example below, Octave maintains the core characteristics of the selected voice, but modulates its performance according to your instructions.

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      { 
>	        "text": "Today we'\''ll explore ancient writing systems.",
>	        "description": "excited, interested, projecting to a large classroom",
>	        "voice": {
>	          "name": "Literature Professor",
>	          "provider": "HUME_AI"
>	        }
>	      }
>	    ]
>	  }'

This distinction is key to using Octave effectively. When you want consistent voice identity across multiple utterances but need to express different emotions or styles, acting instructions allow you to maintain the same voice while varying its delivery.

Was this page helpful?
Yes
No
Previous

Octave Continuation Guide

Guide to maintaining coherent speech across multiple utterances and generations.

Next
Built with