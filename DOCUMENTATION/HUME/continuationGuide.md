Title: Octave Continuation Guide | Hume API

URL Source: https://dev.hume.ai/docs/text-to-speech-tts/continuation

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

Octave Continuation Guide

Copy page

Guide to maintaining coherent speech across multiple utterances and generations.

A key feature that sets Octave apart from traditional TTS systems is that the model understands what it’s saying. This linguistic comprehension powers Octave’s sophisticated continuation capabilities, allowing for coherent audio content across multiple segments. This guide explains how to use Octave’s continuation features to create natural-sounding audio content that spans multiple utterances while preserving flow and emotional continuity.

What is continuation?

With Octave, continuation refers to maintaining contextual awareness between utterances to generate coherent, natural-sounding speech. An utterance is a unit of input that includes text to be synthesized and an optional description of how the speech should sound.

Continuation allows you to use previous utterances as context to inform new speech generation. You can implement continuation in two ways:

Multiple utterances in a single request: When you provide multiple utterances in one request, Octave automatically uses each utterance as context for the next one in the chain.
Using previous context: You can provide context as either:
A context utterance
A generation ID from previous output

When using continuation, Octave will generate speech for all utterances in the utterances array of your request. However, any utterances provided within the context parameter serve only as reference and will not produce additional audio. This distinction allows you to build upon previous speech without duplicating audio output.

The primary use case for splitting your text input into multiple utterances, rather than providing all the text in a single utterance, is when you want to provide distinct acting instructions to different parts of your text input.

Key aspects of continuation
Narrative coherence

When creating longer audio that exceeds a single utterance (such as audiobooks or educational materials), continuation ensures your audience experiences a cohesive narrative without awkward shifts in delivery, pacing, or emotional tone. The speech maintains appropriate energy levels and emotional progression, resulting in a more authentic listening experience where each new segment builds naturally from what came before.

Try these examples to experience how Octave maintains narrative coherence, delivering the same phrase with completely different emotional tones based on the context of the preceding utterance:

With positive context (excited interpretation)

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      { "text": "Our proposal has been accepted with full funding for the next three years!" },
>	      { "text": "I can'\''t believe it!" }
>	    ]
>	  }'

With negative context (disappointed interpretation)

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      { "text": "After all our preparation... They'\''ve decided to cancel the entire project..." },
>	      { "text": "I can'\''t believe it!" }
>	    ]
>	  }'
Linguistic context

Continuation also provides linguistic context for proper pronunciation, particularly with homographs—words that are spelled the same but pronounced differently based on meaning. For example, Octave can correctly differentiate between:

“Take a bow.” (/bau/) vs. “Take a bow and arrow.” (/bō/)
“Play the bass guitar.” (/bās/) vs. “Go bass fishing.” (/bas/)
“I read the book yesterday.” (/red/) vs. “I will read the book tomorrow.” (/rēd/)

Try these examples to see how Octave intelligently distinguishes between different pronunciations of the word “bow” based on contextual understanding:

With /bau/ pronunciation

cURL
Python
TypeScript
$	curl https://api.hume.ai/v0/tts \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      { "text": "What a fantastic performance!" },
>	      { "text": "Now take a bow." }
>	    ]
>	  }'

With /bō/ pronunciation

cURL
Python
TypeScript
$	curl https://api.hume.ai/v0/tts \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      { "text": "First take a quiver of arrows." },
>	      { "text": "Now take a bow." }
>	    ]
>	  }'
Consistent voice

When continuing from an utterance, Octave intelligently handles voice consistency:

If you don’t specify a voice for a new utterance, Octave automatically continues using the same voice from the previous utterance.
You only need to specify a voice when you want to change from the currently established voice.
This applies to both generated voices (from descriptions) and saved voices from the voice library.

Below are sample requests which show how you can continue with the same voice:

For more information on specifying a voice in your request, see our voices guide.

Multiple utterances in a single request

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      {
>	        "text": "Gather around everyone... can I have your attention? Great! Today we'\''ll be learning about supermassive black holes at the center of galaxies.",
>	        "description": "Speaking slightly louder at first to be heard in the busy museum, then transitioning to an enthusiastic but measured teaching tone once attention is gained.",
>	        "voice": {
>	          "name": "Donovan Sinclair",
>	          "provider": "HUME_AI"
>	        }
>	      },
>	      {
>	        "text": "I'\''ve arranged for the museum guide to explain their special exhibit on black holes. I think you'\''ll find it really helpful for the concepts we'\''ve been covering in class.",
>	        "description": "Speaking more quietly now with a casual, informative tone, showing enthusiasm appropriate for the educational context."
>	      }
>	    ]
>	  }'

Continuing from previous generation using context

cURL
Python
TypeScript
$	# First request - capture the generation_id
>	GENERATION_ID=$(curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      {
>	        "text": "Gather around everyone... can I have your attention? Great! Today we'\''ll be learning about supermassive black holes at the center of galaxies.",
>	        "description": "Speaking slightly louder at first to be heard in the busy museum, then transitioning to an enthusiastic but measured teaching tone once attention is gained.",
>	        "voice": {
>	          "name": "Donovan Sinclair",
>	          "provider": "HUME_AI"
>	        }
>	      }
>	    ]
>	  }' | jq -r '.generations[0].generation_id')
>	
>	# Second request using the generation_id from the first request
>	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      {
>	        "text": "I'\''ve arranged for the museum guide to explain their special exhibit on black holes. I think you'\''ll find it really helpful for the concepts we'\''ve been covering in class.",
>	        "description": "Speaking more quietly now with a casual, informative tone, showing enthusiasm appropriate for the educational context."
>	      },
>	    ],
>	    "context": {
>	      "generation_id": "'$GENERATION_ID'"
>	    }
>	  }'

Changing voices mid-conversation

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      {
>	        "text": "Gather around everyone... can I have your attention? Great! Today we'\''ll be learning about supermassive black holes at the center of galaxies.",
>	        "description": "Speaking slightly louder at first to be heard in the busy museum, then transitioning to an enthusiastic but measured teaching tone once attention is gained.",
>	        "voice": {
>	          "name": "Donovan Sinclair",
>	          "provider": "HUME_AI"
>	        }
>	      },
>	      {
>	        "text": "I'\''ve arranged for the museum guide to explain their special exhibit on black holes. I think you'\''ll find it really helpful for the concepts we'\''ve been covering in class.",
>	        "description": "Speaking more quietly now with a casual, informative tone, showing enthusiasm appropriate for the educational context."
>	      },
>	      {
>	        "text": "Thanks, Professor. Hi everyone, I'\''m Vince from the astronomy department here at the museum. Welcome to our black hole visualization exhibit.",
>	        "description": "Speaking in a friendly, welcoming tone with the natural projection needed in a museum space. Confident but conversational, as if addressing a group of university students.",
>	        "voice": {
>	          "name": "Vince Douglas",
>	          "provider": "HUME_AI"
>	        }
>	      },
>	      {
>	        "text": "It'\''s quite fascinating how we can detect something we can'\''t directly observe. Black holes don'\''t emit light, but we can study their effects on nearby stars and gas.",
>	        "description": "Speaking with genuine interest and enthusiasm, using a clear educational tone that emphasizes key points."
>	      }
>	    ]
>	  }'

This intelligent handling of voice consistency saves development effort and ensures a seamless listening experience, making it easier to create dynamic, multi-character narratives without redundant voice specifications.

Was this page helpful?
Yes
No
Previous

Text-to-speech API FAQ

We’ve compiled a list of frequently asked questions from our developer community. If you don’t see your question here, join the discussion on our Discord.

Next
Built with