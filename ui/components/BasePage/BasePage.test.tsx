import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { BasePage } from './BasePage';

// mocks
const useMountedMock = jest.fn();
const useScrollToTopBtnMock = jest.fn();
const useLoadingTimeoutMock = jest.fn();

jest.mock('@utils', () => ({
    useMounted: () => useMountedMock(),
    useScrollToTopBtn: () => useScrollToTopBtnMock(),
    useLoadingTimeout: (isPending: boolean | undefined) => useLoadingTimeoutMock(isPending),
}));

jest.mock('../PageLoader', () => ({
    PageLoader: ({ isLoading }: { isLoading: boolean }) => (
        <div data-testid="page-loader">{String(isLoading)}</div>
    ),
}));

jest.mock('../ErrorSnackbar', () => ({
    ErrorSnackbar: ({ isError, message }: { isError: boolean; message?: string }) =>
        isError ? <div data-testid="error-snackbar">{message}</div> : null,
}));

jest.mock('../LiquidGlassButton', () => ({
    LiquidGlassButton: ({ children, onClick }: any) => (
        <button data-testid="scroll-btn" onClick={onClick}>
            {children}
        </button>
    ),
}));

jest.mock('../Icon', () => ({
    Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}));

jest.mock('./BasePage.styles', () => {
    const React = require('react');
    return {
        StyledPageBody: React.forwardRef(
            ({ children, onScroll }: any, ref: React.ForwardedRef<HTMLDivElement>) => (
                <div data-testid="page-body" ref={ref} onScroll={onScroll}>
                    {children}
                </div>
            )
        ),
    };
});

describe('BasePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useMountedMock.mockReturnValue(true);
        useScrollToTopBtnMock.mockReturnValue({
            containerRef: { current: null },
            isVisible: false,
            handleScroll: jest.fn(),
            scrollToTop: jest.fn(),
        });
        useLoadingTimeoutMock.mockReturnValue({ isTimeoutError: false });
    });

    it('renders nothing when not mounted', () => {
        useMountedMock.mockReturnValue(false);

        const { container } = render(
            <BasePage isPending={false} isError={false} errorMessage="err">
                <div>Content</div>
            </BasePage>
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('shows PageLoader when isPending=true and hides children', () => {
        render(
            <BasePage isPending={true} isError={false} errorMessage="err">
                <div>Content</div>
            </BasePage>
        );

        expect(screen.getByTestId('page-loader')).toHaveTextContent('true');
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
        expect(screen.queryByTestId('error-snackbar')).not.toBeInTheDocument();
    });

    it('shows children when not pending and no error', () => {
        render(
            <BasePage isPending={false} isError={false} errorMessage="err">
                <div>Content</div>
            </BasePage>
        );

        expect(screen.getByTestId('page-loader')).toHaveTextContent('false');
        expect(screen.getByText('Content')).toBeInTheDocument();
        expect(screen.queryByTestId('error-snackbar')).not.toBeInTheDocument();
    });

    it('shows ErrorSnackbar with provided errorMessage when isError=true', () => {
        render(
            <BasePage isPending={false} isError={true} errorMessage="Не удалось загрузить">
                <div>Content</div>
            </BasePage>
        );

        expect(screen.getByTestId('error-snackbar')).toHaveTextContent('Не удалось загрузить');
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('shows timeout message when useLoadingTimeout returns isTimeoutError=true', () => {
        useLoadingTimeoutMock.mockReturnValue({ isTimeoutError: true });

        render(
            <BasePage isPending={true} isError={false} errorMessage="Не удалось загрузить">
                <div>Content</div>
            </BasePage>
        );

        expect(screen.getByTestId('error-snackbar')).toHaveTextContent('Загрузка заняла слишком много времени');
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('renders scroll button only when isShowScrollBtn=true and isVisible=true', () => {
        useScrollToTopBtnMock.mockReturnValue({
            containerRef: { current: null },
            isVisible: true,
            handleScroll: jest.fn(),
            scrollToTop: jest.fn(),
        });

        render(
            <BasePage isPending={false} isError={false} errorMessage="err" isShowScrollBtn={true}>
                <div>Content</div>
            </BasePage>
        );

        expect(screen.getByTestId('scroll-btn')).toBeInTheDocument();
        expect(screen.getByTestId('icon-arrow-chevron-down')).toBeInTheDocument();
    });

    it('does not render scroll button when isShowScrollBtn=false', () => {
        useScrollToTopBtnMock.mockReturnValue({
            containerRef: { current: null },
            isVisible: true,
            handleScroll: jest.fn(),
            scrollToTop: jest.fn(),
        });

        render(
            <BasePage isPending={false} isError={false} errorMessage="err" isShowScrollBtn={false}>
                <div>Content</div>
            </BasePage>
        );

        expect(screen.queryByTestId('scroll-btn')).not.toBeInTheDocument();
    });

    it('calls scrollToTop on scroll button click', () => {
        const scrollToTop = jest.fn();

        useScrollToTopBtnMock.mockReturnValue({
            containerRef: { current: null },
            isVisible: true,
            handleScroll: jest.fn(),
            scrollToTop,
        });

        render(
            <BasePage isPending={false} isError={false} errorMessage="err">
                <div>Content</div>
            </BasePage>
        );

        fireEvent.click(screen.getByTestId('scroll-btn'));
        expect(scrollToTop).toHaveBeenCalledTimes(1);
    });

    it('binds onScroll only when isShowScrollBtn=true', () => {
        const handleScroll = jest.fn();

        useScrollToTopBtnMock.mockReturnValue({
            containerRef: { current: null },
            isVisible: false,
            handleScroll,
            scrollToTop: jest.fn(),
        });

        const { rerender } = render(
            <BasePage isPending={false} isError={false} errorMessage="err" isShowScrollBtn={true}>
                <div>Content</div>
            </BasePage>
        );

        fireEvent.scroll(screen.getByTestId('page-body'));
        expect(handleScroll).toHaveBeenCalledTimes(1);

        rerender(
            <BasePage isPending={false} isError={false} errorMessage="err" isShowScrollBtn={false}>
                <div>Content</div>
            </BasePage>
        );

        fireEvent.scroll(screen.getByTestId('page-body'));
        expect(handleScroll).toHaveBeenCalledTimes(1);
    });
});