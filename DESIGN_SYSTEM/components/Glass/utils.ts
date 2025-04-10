import {
    transparency,
    blur,
    glassShadow,
    shadowDepth,
    radius
} from "../../tokens";

// Helper function types
type Hierarchy = 'container' | 'interactive' | 'emphasized' | 'content';
type Level = 'primary' | 'secondary' | 'tertiary';
type Intensity = 'light' | 'medium' | 'heavy' | 'intense';

export const getOpacityFromHierarchy = (
    hierarchy: Hierarchy = 'container',
    level: Level = 'primary'
): number => {
    return transparency[hierarchy][level];
};

export const getBlurFromHierarchy = (
    hierarchy: Hierarchy,
    level: Level
): string => {
    if (hierarchy === 'container') {
        return blur.light;
    } else if (hierarchy === 'interactive') {
        return level === 'primary' ? blur.light : blur.medium;
    } else {
        return level === 'primary' ? blur.medium : blur.heavy;
    }
};

export const getGlassShadowFromHierarchy = (
    hierarchy: Hierarchy = 'container',
    level: Level = 'primary',
    shadow?: number
): string => {
    if (shadow !== undefined && shadow >= 0 && shadow <= 5) {
        return glassShadow[shadow as keyof typeof glassShadow];
    }
    return glassShadow[shadowDepth[hierarchy][level] as keyof typeof glassShadow];
};

export const getBlurFromIntensity = (intensity?: Intensity): string => {
    switch (intensity) {
        case 'light': return blur.light;
        case 'medium': return blur.medium;
        case 'heavy': return blur.heavy;
        case 'intense': return blur.intense;
        default: return blur.medium;
    }
};

export const getBorderRadius = (borderRadius: string = 'md'): string => {
    if (borderRadius in radius) {
        return radius[borderRadius as keyof typeof radius];
    }
    return radius.md;
}; 