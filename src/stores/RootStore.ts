import { AudioStore } from './AudioStore';
import { SlideStore } from './SlideStore';
import { DialogueStore } from './DialogueStore';

export class RootStore {
    audioStore;
    slideStore;
    dialogueStore;

    constructor() {
        this.audioStore = new AudioStore(this);
        this.slideStore = new SlideStore(this);
        this.dialogueStore = new DialogueStore(this);
    }

    // Initialize stores that need setup
    initialize = () => {
        // Initialize audio
        this.audioStore.initializeAudio();
    }

    // Global cleanup function
    cleanup = () => {
        this.audioStore.cleanup();
        this.slideStore.cleanup();
        this.dialogueStore.cleanup();
    }
}

export const rootStore = new RootStore(); 