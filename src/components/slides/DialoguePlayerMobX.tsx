import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useDialogueStore } from '../../stores/StoreContext';

interface DialogueLine {
    index: number;
    speaker: string;
    text: string;
    filename: string;
    path: string;
}

interface DialoguePlayerProps {
    metadataPath: string;
    autoPlay?: boolean;
    onComplete?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    minPauseDuration?: number;
    maxPauseDuration?: number;
    showTranscript?: boolean;
    highlightCurrentLine?: boolean;
    compact?: boolean;
    maxLines?: number;
    className?: string;
    style?: React.CSSProperties;
    floatingControls?: boolean;
    textOnly?: boolean;
    showTextOnlyLabel?: boolean;
    showOnlyCurrent?: boolean;
}

const DialoguePlayerMobX = observer((props: DialoguePlayerProps) => {
    const dialogueStore = useDialogueStore();

    // Call onComplete and onPlay from props when store's state changes
    useEffect(() => {
        if (dialogueStore.playbackCompleted && props.onComplete) {
            props.onComplete();
        }
    }, [dialogueStore.playbackCompleted, props.onComplete]);

    useEffect(() => {
        if (dialogueStore.isPlaying && props.onPlay) {
            props.onPlay();
        }
    }, [dialogueStore.isPlaying, props.onPlay]);

    // Simplified UI for testing
    return (
        <div className={`bg-gray-800 rounded p-4 ${props.className || ''}`} style={props.style}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-white text-lg">Dialogue</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => dialogueStore.togglePlayback()}
                        className="px-3 py-1 bg-blue-600 rounded"
                    >
                        {dialogueStore.isPlaying ? 'Pause' : 'Play'}
                    </button>
                </div>
            </div>

            <div className="bg-gray-700 h-2 rounded-full mb-4">
                <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${dialogueStore.progress}%` }}
                />
            </div>

            {dialogueStore.metadata && (dialogueStore.metadata as any).audioFiles && dialogueStore.currentLineIndex >= 0 && (
                <div className="bg-gray-700 p-3 rounded mb-2">
                    <div className="font-bold text-blue-300">
                        {(dialogueStore.metadata as any).audioFiles[dialogueStore.currentLineIndex].speaker}:
                    </div>
                    <div className="text-white">
                        {(dialogueStore.metadata as any).audioFiles[dialogueStore.currentLineIndex].text}
                    </div>
                </div>
            )}

            {dialogueStore.isLoading && (
                <div className="text-gray-400 text-center">Loading dialogue...</div>
            )}

            {!dialogueStore.isLoading && !dialogueStore.metadata && (
                <div className="text-gray-400 text-center">No dialogue available</div>
            )}
        </div>
    );
});

export default DialoguePlayerMobX; 