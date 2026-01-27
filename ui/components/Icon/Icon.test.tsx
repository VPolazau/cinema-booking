import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Icon } from './Icon';
import { TIconName } from '@ui';

jest.mock('./constants', () => ({
    ICONS: {
        check: <svg data-testid="icon-check" />,
        close: <svg data-testid="icon-close" />,
    }
}));

describe('Icon', () => {
    it('renders the icon by name', () => {
        render(<Icon name={'check' as TIconName} />);
        expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    });

    it('does not render anything for unknown icon name', () => {
        render(<Icon name={'unknown' as TIconName} />);
        expect(screen.queryByTestId('icon-check')).not.toBeInTheDocument();
        expect(screen.queryByTestId('icon-close')).not.toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<Icon name={'close' as TIconName} onClick={handleClick} />);
        fireEvent.click(screen.getByTestId('icon-close'));
        expect(handleClick).toHaveBeenCalled();
    });

    it('applies passed className', () => {
        render(<Icon name={'check' as TIconName} className="custom-class" />);
        const wrapper = screen.getByTestId('icon-check').parentElement;
        expect(wrapper).toHaveClass('custom-class');
    });
});
