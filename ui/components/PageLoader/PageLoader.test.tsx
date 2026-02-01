import { render, screen } from '@testing-library/react';
import { PageLoader } from './PageLoader';
import '@testing-library/jest-dom';

describe('PageLoader', () => {
    it('renders loader when isLoading is true', () => {
        render(<PageLoader isLoading={true} />);
        expect(screen.getByTestId('loader')).toBeVisible();
    });

    it('hides loader when isLoading is false', () => {
        render(<PageLoader isLoading={false} />);
        expect(screen.queryByTestId('loader')).toBeNull();
    });
});