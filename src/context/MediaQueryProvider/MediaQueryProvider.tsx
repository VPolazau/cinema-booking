import { createContext, useEffect, useState } from 'react';

import { MediaContextType, MediaQueryProviderProps } from './MediaQueryProvider.declarations';
import { MEDIA_QUERIES, get } from '@utils';

export const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaQueryProvider = ({ children }: MediaQueryProviderProps) => {
    const { desktopMedia, tabletMedia, mobileMedia } = MEDIA_QUERIES;

    const [currentMedia, setCurrentMedia] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const medias: MediaQueryList[] = [
                window.matchMedia(desktopMedia),
                window.matchMedia(tabletMedia),
                window.matchMedia(mobileMedia)
            ];
            return get(medias.find((mediaQuery) => mediaQuery.matches), 'media', desktopMedia);
        }
        return desktopMedia;
    });

    useEffect(() => {
        const medias: MediaQueryList[] = [
            window.matchMedia(desktopMedia),
            window.matchMedia(tabletMedia),
            window.matchMedia(mobileMedia)
        ];

        const handleMediaChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                setCurrentMedia(event.media);
            }
        };

        medias.forEach((mediaQuery) => mediaQuery.addEventListener('change', handleMediaChange));

        return () => {
            medias.forEach((mediaQuery) => mediaQuery.removeEventListener('change', handleMediaChange));
        };
    }, []);

    return <MediaContext.Provider value={{ currentMedia }}>{children}</MediaContext.Provider>;
};
