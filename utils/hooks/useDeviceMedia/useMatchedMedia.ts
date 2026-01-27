import { useContext, useEffect } from 'react';
import { MediaContext } from '@/context';

export const useMatchedMedia = (callback?: () => void): string => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error('useMatchedMedia must be used within a MediaQueryProvider');
    }

    useEffect(() => {
        if (callback) {
            callback();
        }
    }, [context.currentMedia, callback]);

    return context.currentMedia;
};
