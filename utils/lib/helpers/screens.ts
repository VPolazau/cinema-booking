import { css } from 'styled-components';

import { DESKTOP_BREAKPOINT, TABLET_BREAKPOINT } from '../constants';

export const desktopScreen: typeof css = (first: any, ...interpolations: any[]) => css`
    @media (min-width: ${DESKTOP_BREAKPOINT}px) {
        ${css(first, ...interpolations)}
    ｝
`;

export const tabletScreen: typeof css = (first: any, ...interpolations: any[]) => css`
    @media (min-width: ${TABLET_BREAKPOINT}px) and (max-width: ${DESKTOP_BREAKPOINT - 1}px) {
        ${css(first, ...interpolations)}
    ｝
`;

export const mobileScreen: typeof css = (first: any, ...interpolations: any[]) => css`
    @media (min-width: 0) and (max-width: ${TABLET_BREAKPOINT - 1}px) {
        ${css(first, ...interpolations)}
    ｝
`;
