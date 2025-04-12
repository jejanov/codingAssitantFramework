import React, { useState } from 'react';
import DialoguePlayer from './DialoguePlayer';

const DialogueDemo: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  
  // Function to trigger dialogue generation (would be connected to backend in real implementation)
  const generateDialogue = async () => {
    // This would normally call your backend to run the script
    // For demo purposes, we're just showing what would happen
    setIsGenerating(true);
    setGenerationStatus('Connecting to Hume.ai API...');
    
    // Simulate the generation process
    await new Promise(resolve => setTimeout(resolve, 1000));
    setGenerationStatus('Generating voice for Dev A using Hume.ai Octave TTS...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGenerationStatus('Generating voice for Dev B using Hume.ai Octave TTS...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGenerationStatus('Saving audio files...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setGenerationStatus('Generation complete!');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsGenerating(false);
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">AI Developer Dialogue Demo</h2>
      
      <div className="mb-8 bg-gray-800 bg-opacity-40 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2 text-white">1. Generate Dialogue Audio</h3>
        <p className="text-gray-300 mb-4">
          In a real implementation, this would call the Node.js script to generate audio files using Hume.ai's Octave TTS API.
          The script generates separate audio files for each line of dialogue using voice descriptions.
        </p>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={generateDialogue}
            disabled={isGenerating}
            className={`px-4 py-2 rounded-md font-medium ${
              isGenerating 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isGenerating ? 'Generating...' : 'Generate Dialogue Audio'}
          </button>
          
          {isGenerating && (
            <span className="text-indigo-300">{generationStatus}</span>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-gray-400 text-sm">
            To run the actual generation script:
          </p>
          <pre className="bg-gray-900 p-2 rounded mt-1 text-xs text-gray-300 overflow-x-auto">
            node scripts/generateDialogueAudio.js public/dialogue/dev-conversation.json ai-demo
          </pre>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-white">2. Play Dialogue Sequence</h3>
        <p className="text-gray-300 mb-4">
          The DialoguePlayer component plays back the generated audio files with natural pauses between lines.
        </p>
        
        <DialoguePlayer 
          metadataPath="/dialogue/ai-demo-metadata.json" 
          minPauseDuration={800}
          maxPauseDuration={2000}
          showTranscript={true}
        />
        
        <p className="text-sm text-gray-400 mt-4">
          If no audio has been generated yet, this component will show an error message.
          After running the generation script, refresh the page to see the dialogue player in action.
        </p>
      </div>
      
      <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-white">Implementation Details</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
          <li>The dialogue generation script uses Hume.ai's Octave text-to-speech API</li>
          <li>Voices are generated dynamically using voice descriptions like "A professional male developer, 30s"</li>
          <li>Hume.ai's context-aware speech model adds natural expressiveness and proper pacing</li>
          <li>Audio files are stored in the public/sounds/dialogue directory</li>
          <li>A metadata JSON file keeps track of all dialogue lines and their corresponding audio files</li>
          <li>The DialoguePlayer component handles sequential playback with variable pauses</li>
          <li>Voice descriptions can be customized in the .env file</li>
        </ul>
      </div>
    </div>
  );
};

export default DialogueDemo;