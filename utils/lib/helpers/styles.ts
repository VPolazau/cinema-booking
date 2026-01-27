export const toUnits = (unit: string, size?: number) => {
    if (size !== undefined) {
        return `${size}${unit}`;
    }

    return '';
};

export const toPixels = (size?: number) => toUnits('px', size);

export const toDegrees = (angle?: number) => toUnits('deg', angle);