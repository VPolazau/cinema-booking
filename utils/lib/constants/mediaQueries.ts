export const BREAKPOINTS = { desktop: 1440, tablet: 768 };

export const MEDIA_QUERIES = {
    desktopMedia: `(min-width: ${BREAKPOINTS.desktop}px)`,
    tabletMedia: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
    mobileMedia: `(min-width: 0px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`,
};
