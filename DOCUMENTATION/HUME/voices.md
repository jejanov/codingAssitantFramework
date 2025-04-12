Title: Octave Voices | Hume API

URL Source: https://dev.hume.ai/docs/text-to-speech-tts/voices

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

Octave Voices

Copy page

Guide to specifying and generating voices with Octave TTS.

The Octave TTS API enables you to generate expressive voices through simple descriptions or specify a voice from your saved voices or from Hume’s Voice Library. This guide explains how to specify voices for synthesis, generate new ones, and save your favorites for reuse.

Specify a voice, or don’t!

Choose a voice from the voice library or let Octave dynamically generate a new one based on your text. Optionally, add a description to guide speech delivery. These descriptions help shape the voice’s characteristics, whether you’re using a saved voice or generating a new one.

Dynamic voice generation

When a voice is not specified, the generated speech is delivered in a dynamically generated voice. The text and description fields determine the characteristics of the voice.

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      {
>	        "text": "Welcome to my application!"
>	      }
>	    ]
>	  }'

See our prompting guide for tips on designing a voice, and our Acting instructions guide for how to guide speech delivery.

Specifying a voice

When specifying a voice for the generated speech to be delivered in, you can specify a custom voice that you have designed and saved, either through the Platform UI or through the API, or a voice from Hume’s Voice Library.

The provider field in your request will default to CUSTOM_VOICE. When specifying one of your saved voices you do not need to specify a provider. However, when specifying a voice from Hume’s Voice Library you must specify HUME_AI as the provider.

In the example below, we specify a custom voice for the first utterance and a voice from Hume’s Voice Library voice in the second:

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      {
>	        "text": "Welcome to my application!",
>	        "voice": {
>	          "id": "6e138d63-e6a9-4360-b1b9-da0bb77e3a58"
>	        }
>	      },
>	      {
>	        "text": "Thank you!",
>	        "voice": {
>	          "id": "5bb7de05-c8fe-426a-8fcc-ba4fc4ce9f9c",
>	          "provider": "HUME_AI"
>	        }
>	      }
>	    ]
>	  }'
Saving generated voices

When you generate a voice you would like to reuse, you can save it to your voice library. This requires the generation_id from your TTS API response. Call the /v0/tts/voices endpoint with this ID and a name. Once saved, you can use the voice in future requests by specifying either its name or id.

1
Generate a voice and extract the generation_id

Send a text-to-speech request without specifying a voice.

cURL
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	    "utterances": [
>	      {
>	        "text": "Welcome to my application!"
>	      }
>	    ]
>	  }'

The response will include the generation_id, which you’ll use to save the voice.

Response
1	{
2	  "generations": [
3	    {
4	      "audio": "//PExAAspDoWXjDNQgk3HJJJZNbaEPZMmTJk7QIEC...",
5	      "duration": 1.589667,
6	      "encoding": {
7	        "format": "mp3",
8	        "sample_rate": 48000
9	      },
10	      "file_size": 26496,
11	      "generation_id": "41f7c154-fbb2-4372-8ecc-e6b7bf6ace01",
12	      "snippets": [
13	        [
14	          {
15	            "audio": "//PExAAspDoWXjDNQgk3HJJJZNbaEPZMmTJk7QIEC...",
16	            "generation_id": "41f7c154-fbb2-4372-8ecc-e6b7bf6ace01",
17	            "id": "37a108c4-5de7-4507-8a54-0521f5cb0383",
18	            "text": "Welcome to my application!",
19	            "utterance_index": 0
20	          }
21	        ]
22	      ]
23	    }
24	  ],
25	  "request_id": "7903e4a7-6642-491a-aa96-c6b359dd1042707439"
26	}
2
Save the voice for reuse

Use the generation_id from the response to save the voice with a custom name.

Request
Python
TypeScript
$	curl "https://api.hume.ai/v0/tts/voices" \
>	  -H "X-Hume-Api-Key: $HUME_API_KEY" \
>	  --json '{
>	      "name": "NewVoice",
>	      "generation_id": "41f7c154-fbb2-4372-8ecc-e6b7bf6ace01"
>	  }'

The response will provide the voice’s name and id for use in future TTS requests.

Response
1	{
2	  "name": "NewVoice",
3	  "id": "41f7c154-fbb2-4372-8ecc-e6b7bf6ace01",
4	  "provider": "CUSTOM_VOICE"
5	}
Fetching and deleting voices

You can either fetch a list of your saved voices, or a list of Hume’s Voice Library voices, with the list voices endpoint. Should you want to delete a voice, you can do so using the delete voices endpoint.

Was this page helpful?
Yes
No
Previous

Octave Prompting Guide

A guide to effectively prompting Octave for voice creation and voice modulation.

Next
Built with
