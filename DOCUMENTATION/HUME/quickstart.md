Title: TTS TypeScript Quickstart Guide | Hume API

URL Source: https://dev.hume.ai/docs/text-to-speech-tts/quickstart/typescript

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
TypeScript
Python
CLI
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
Quickstart

TTS TypeScript Quickstart Guide

Copy page

Step-by-step guide for integrating the TTS API using Hume’s TypeScript SDK.

This guide shows how to get started using Hume’s Text-to-Speech capabilities in TypeScript using Hume’s TypeScript SDK. It demonstrates:

Converting text to speech with a new voice.
Saving a voice to your voice library for future use.
Giving “acting instructions” to modulate the voice.
Generating multiple variations of the same text at once.
Providing context to maintain consistency across multiple generations.

The complete code for the example in this guide is available on GitHub.

Environment Setup

Create a new TypeScript project and install the required packages:

$	npm init -y
>	npm install hume dotenv
>	npm install --save-dev typescript @types/node
Authenticating the HumeClient

You must authenticate to use the Hume TTS API. Your API key can be retrieved from the Hume AI platform.

This example uses dotenv. Place your API key in a .env file at the root of your project.

.env
$	echo "HUME_API_KEY=your_api_key_here" > .env

Then create a new file index.ts and use your API key to instantiate the HumeClient.

1	import { HumeClient } from "hume"
2	import dotenv from "dotenv"
3	
4	dotenv.config()
5	
6	const hume = new HumeClient({ 
7	  apiKey: process.env.HUME_API_KEY!
8	})
Helper function

Define a function to aid in writing generated audio to a temporary file:

1	import fs from "fs/promises"
2	import path from "path"
3	import * as os from "os"
4	
5	const outputDir = path.join(os.tmpdir(), `hume-audio-${Date.now()}`)
6	
7	const writeResultToFile = async (base64EncodedAudio: string, filename: string) => {
8	  const filePath = path.join(outputDir, `${filename}.wav`)
9	  await fs.writeFile(filePath, Buffer.from(base64EncodedAudio, "base64"))
10	  console.log('Wrote', filePath)
11	}
12	
13	const main = async () => {
14	  await fs.mkdir(outputDir)
15	  console.log('Writing to', outputDir)
16	  
17	  // All the code examples in the remainder of the guide
18	  // belong within this main function.
19	}
20	
21	main().then(() => console.log('Done')).catch(console.error)
Calling Text-to-Speech

To use Hume TTS, you can call hume.tts.synthesizeJson with a list of utterances. Inside each utterance, put the text to speak, and optionally provide a description of how the voice speaking the text should sound. If you don’t provide a description, Hume will examine text and attempt to determine an appropriate voice.

The base64-encoded bytes of an audio file with your speech will be present at .generations[0].audio in the returned object. By default, there will only be a single variation in the .generations array, and the audio will be in wav format.

The .generations[0].generationId field will contain an ID you can use to refer to this specific generation of speech in future requests.

1	const speech1 = await hume.tts.synthesizeJson({
2	  utterances: [{
3	    description: "A refined, British aristocrat",
4	    text: "Take an arrow from the quiver."
5	  }]
6	})
7	await writeResultToFile(speech1.generations[0].audio, "speech1_0")
Saving voices

Use hume.tts.voices.create to save the voice of a generated piece of audio to your voice library for future use:

1	await hume.tts.voices.create({
2	  name: `aristocrat-${Date.now()}`,
3	  generationId: speech1.generations[0].generationId,
4	})
Continuity

Inside an utterance, specify the name or ID of a voice to generate more speech from that voice.

To generate speech that is meant to follow previously generated speech, specify context with the generationId of that speech.

You can specify a number up to 5 in numGenerations to generate multiple variations of the same speech at the same time.

1	const speech2 = await hume.tts.synthesizeJson({
2	  utterances: [{
3	    voice: { name: "aristocrat" },
4	    text: "Now take a bow."
5	  }],
6	  context: {
7	    generationId: speech1.generations[0].generationId
8	  },
9	  numGenerations: 2,
10	})
11	await writeResultToFile(speech2.generations[0].audio, "speech2_0")
12	await writeResultToFile(speech2.generations[1].audio, "speech2_1")
Acting Instructions

If you specify both voice and description, the description field will behave as “acting instructions”. It will keep the character of the specified voice, but modulated to match description.

1	const speech3 = await hume.tts.synthesizeJson({
2	  utterances: [{
3	    voice: { name: "aristocrat" },
4	    description: "Murmured softly, with a heavy dose of sarcasm and contempt",
5	    text: "Does he even know how to use that thing?"
6	  }],
7	  context: {
8	    generationId: speech2.generations[0].generationId
9	  },
10	  numGenerations: 1
11	})
12	await writeResultToFile(speech3.generations[0].audio, "speech3_0")
Streaming speech

You can stream utterances using the synthesizeJsonStreaming method. This allows you to process audio chunks as they become available rather than waiting for the entire speech generation to complete.

1	let i = 0
2	for await (const snippet of await hume.tts.synthesizeJsonStreaming({
3	  context: {
4	    generationId: speech3.generations[0].generationId,
5	  },
6	  utterances: [{text: "He's drawn the bow..."}, {text: "he's fired the arrow..."}, {text: "I can't believe it! A perfect bullseye!"}],
7	})) {
8	  await writeResultToFile(snippet.audio, `speech4_${i++}`)
9	}
Running the Example

To run the example:

$	npx ts-node index.ts
Was this page helpful?
Yes
No
Previous

TTS Python Quickstart Guide

Step-by-step guide for integrating the TTS API using Hume’s Python SDK.

Next
Built with