import React from 'react';
import { render, screen } from '@testing-library/react';
import { MediaQueryProvider, MediaContext } from './MediaQueryProvider';
import { MEDIA_QUERIES } from '@utils';

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => {
            return {
                matches: query === MEDIA_QUERIES.desktopMedia,
                media: query,
                onchange: null,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            };
        },
    });
});

describe('MediaQueryProvider', () => {
    it('should provide currentMedia context value based on matchMedia', () => {
        const TestComponent = () => {
            const context = React.useContext(MediaContext);
            return <div data-testid="media">{context?.currentMedia}</div>;
        };

        render(
            <MediaQueryProvider>
                <TestComponent />
            </MediaQueryProvider>
        );

        expect(screen.getByTestId('media')).toHaveTextContent(MEDIA_QUERIES.desktopMedia);
    });
});