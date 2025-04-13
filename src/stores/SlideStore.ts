import { makeAutoObservable, reaction } from 'mobx';
import { RootStore } from './RootStore';

export class SlideStore {
    currentSlide = 0;
    totalSlides = 4; // Updated to include Slide04
    slideChangeReason = 'other'; // 'next', 'prev', 'direct', 'other'
    isFullscreen = false;
    showControls = false;
    contentScale = 1;
    showDebug = false;
    controlsTimeoutId: number | null = null;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this, {
            rootStore: false,
            controlsTimeoutId: false
        });

        // Set up reaction to load dialogue when slide changes
        reaction(
            () => this.currentSlide,
            (newSlide) => {
                // Load dialogue for the new slide
                this.rootStore.audioStore.loadDialogueForSlide(newSlide);
            }
        );
    }

    // Actions
    navigateToSlide = (slideNumber: number, reason = 'direct') => {
        if (slideNumber >= 0 && slideNumber <= this.totalSlides) {
            // Update slide change reason first
            this.slideChangeReason = reason;

            // Then update current slide
            this.currentSlide = slideNumber;
        }
    }

    nextSlide = () => {
        if (this.currentSlide < this.totalSlides) {
            this.navigateToSlide(this.currentSlide + 1, 'next');
        }
    }

    previousSlide = () => {
        if (this.currentSlide > 0) {
            this.navigateToSlide(this.currentSlide - 1, 'prev');
        }
    }

    toggleFullscreen = () => {
        try {
            const container = document.querySelector('[data-fullscreen-container]');

            if (!document.fullscreenElement) {
                if (container && container.requestFullscreen) {
                    container.requestFullscreen().catch(err => {
                        console.error(`Error attempting to enable fullscreen: ${err.message}`);
                    });
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        } catch (error) {
            console.error('Error toggling fullscreen:', error);
        }
    }

    handleFullscreenChange = () => {
        this.isFullscreen = !!document.fullscreenElement;
    }

    showControlsTemporarily = () => {
        // Only update state if controls aren't already visible
        if (!this.showControls) {
            this.showControls = true;
        }

        // Clear any existing timeout
        if (this.controlsTimeoutId) {
            window.clearTimeout(this.controlsTimeoutId);
        }

        // Set new timeout to hide controls
        this.controlsTimeoutId = window.setTimeout(() => {
            this.showControls = false;
        }, 2000);
    }

    toggleDebug = () => {
        this.showDebug = !this.showDebug;
    }

    // Scale management
    calculateResponsiveScale = () => {
        // Base scale is 1 (designed for 1920x1080)
        let newScale = 1;

        // Get current screen dimensions
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Scale up for 4K and larger displays
        if (width >= 3000 || height >= 1600) {
            // 4K (3840x2160) gets 1.5x scale
            newScale = 1.5;
        } else if (width >= 2000 || height >= 1300) {
            // 1440p gets 1.2x scale
            newScale = 1.2;
        } else if (width <= 1366 || height <= 768) {
            // Smaller displays get 0.9x scale
            newScale = 0.9;
        }

        // Apply scale
        this.setContentScale(newScale);
    }

    setContentScale = (scale: number) => {
        this.contentScale = scale;

        // Apply scale as CSS variable to document root
        document.documentElement.style.setProperty('--content-scale', scale.toString());
    }

    // Cleanup function
    cleanup = () => {
        if (this.controlsTimeoutId) {
            window.clearTimeout(this.controlsTimeoutId);
            this.controlsTimeoutId = null;
        }
    }

    // Computed values
    get isFirstSlide() {
        return this.currentSlide === 0;
    }

    get isLastSlide() {
        return this.currentSlide === this.totalSlides;
    }
} 