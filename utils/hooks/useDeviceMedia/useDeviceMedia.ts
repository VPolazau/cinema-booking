import { useMatchedMedia } from './useMatchedMedia';
import { MEDIA_QUERIES } from '../../lib';


export const useDeviceMedia = (callback?: () => void) => {
    const currentMedia = useMatchedMedia(callback);
    const { desktopMedia, mobileMedia, tabletMedia } = MEDIA_QUERIES;

    return {
        isDesktop: currentMedia === desktopMedia,
        isTablet: currentMedia === tabletMedia,
        isMobile: currentMedia === mobileMedia,
    };
};
