import React, { createContext, useContext, useEffect } from 'react';
import { RootStore, rootStore } from './RootStore';

const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize stores on mount
    useEffect(() => {
        rootStore.initialize();

        // Cleanup on unmount
        return () => {
            rootStore.cleanup();
        };
    }, []);

    return (
        <StoreContext.Provider value={rootStore}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return store;
};

// Helper hooks for individual stores
export const useAudioStore = () => useStore().audioStore;
export const useSlideStore = () => useStore().slideStore;
export const useDialogueStore = () => useStore().dialogueStore; 