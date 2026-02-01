import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import { usePageTransition } from "./usePageTransition";
import { useMounted } from "./useMounted";
import { useCommonState } from "./useCommonState";
import { useLoadingTimeout } from "./useLoadingTimeout";
import { useScrollToTopBtn } from "./useScrollToTopBtn";

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
}));

describe("hooks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    // usePageTransition
    describe("usePageTransition", () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it("sets isTransitioning to true on pathname change and resets after delay", () => {
            (usePathname as jest.Mock).mockReturnValue("/home");

            const { result, rerender } = renderHook(() =>
                usePageTransition(300)
            );

            // эффект срабатывает сразу
            expect(result.current.isTransitioning).toBe(true);

            act(() => {
                jest.advanceTimersByTime(300);
            });

            expect(result.current.isTransitioning).toBe(false);

            // меняем pathname
            (usePathname as jest.Mock).mockReturnValue("/profile");
            rerender();

            expect(result.current.isTransitioning).toBe(true);

            act(() => {
                jest.advanceTimersByTime(300);
            });

            expect(result.current.isTransitioning).toBe(false);
        });
    });


    // useMounted
    describe("useMounted", () => {
        it("returns true after mount", () => {
            const { result } = renderHook(() => useMounted());
            expect(result.current).toBe(true);
        });
    });


    // useCommonState
    jest.mock("react-redux", () => ({
        useSelector: jest.fn(),
    }));

    describe("useCommonState", () => {
        it("returns common slice from store", () => {
            const mockCommonState = {
                chats: [],
                selectedChatId: null,
                isLoading: false,
            };

            const mockedUseSelector =
                useSelector as jest.MockedFunction<typeof useSelector>;

            mockedUseSelector.mockImplementation((selector) =>
                selector({ common: mockCommonState } as any)
            );

            const { result } = renderHook(() => useCommonState());

            expect(result.current).toEqual(mockCommonState);
        });
    });

    // useLoadingTimeout
    describe("useLoadingTimeout", () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it("does not set timeout error when isLoading is false/undefined", () => {
            const { result, rerender } = renderHook(({ isLoading }) => useLoadingTimeout(isLoading), {
                initialProps: { isLoading: false as boolean | undefined },
            });

            expect(result.current.isTimeoutError).toBe(false);

            rerender({ isLoading: undefined });
            expect(result.current.isTimeoutError).toBe(false);

            act(() => {
                jest.advanceTimersByTime(7000);
            });

            expect(result.current.isTimeoutError).toBe(false);
        });

        it("sets timeout error after 7000ms when isLoading true", () => {
            const { result } = renderHook(() => useLoadingTimeout(true));

            expect(result.current.isTimeoutError).toBe(false);

            act(() => {
                jest.advanceTimersByTime(6999);
            });
            expect(result.current.isTimeoutError).toBe(false);

            act(() => {
                jest.advanceTimersByTime(1);
            });
            expect(result.current.isTimeoutError).toBe(true);
        });

        it("resets timeout error when loading stops", () => {
            const { result, rerender } = renderHook(({ isLoading }) => useLoadingTimeout(isLoading), {
                initialProps: { isLoading: true },
            });

            act(() => {
                jest.advanceTimersByTime(7000);
            });
            expect(result.current.isTimeoutError).toBe(true);

            rerender({ isLoading: false });
            expect(result.current.isTimeoutError).toBe(false);
        });

        it("clears previous timer when isLoading toggles", () => {
            const { result, rerender } = renderHook(({ isLoading }) => useLoadingTimeout(isLoading), {
                initialProps: { isLoading: true },
            });

            act(() => {
                jest.advanceTimersByTime(3000);
            });

            rerender({ isLoading: false });

            act(() => {
                jest.advanceTimersByTime(10000);
            });

            expect(result.current.isTimeoutError).toBe(false);
        });
    });

    // useScrollToTopBtn
    describe("useScrollToTopBtn", () => {
        let rafCb: FrameRequestCallback | null = null;

        beforeEach(() => {
            rafCb = null;

            global.requestAnimationFrame = jest.fn((cb: FrameRequestCallback) => {
                rafCb = cb;
                return 1;
            });

            global.cancelAnimationFrame = jest.fn();
        });

        const flushRaf = () => {
            if (!rafCb) return;
            const cb = rafCb;
            rafCb = null;
            cb(0);
        };

        it("isVisible becomes true when container scrollTop > 0, and false when back to 0", () => {
            const { result } = renderHook(() => useScrollToTopBtn());

            const el = document.createElement("div") as any;
            el.scrollTop = 0;
            el.scrollTo = jest.fn();

            act(() => {
                (result.current.containerRef as any).current = el;
            });

            act(() => {
                result.current.handleScroll();
                flushRaf();
            });
            expect(result.current.isVisible).toBe(false);

            el.scrollTop = 10;
            act(() => {
                result.current.handleScroll();
                flushRaf();
            });
            expect(result.current.isVisible).toBe(true);

            el.scrollTop = 0;
            act(() => {
                result.current.handleScroll();
                flushRaf();
            });
            expect(result.current.isVisible).toBe(false);
        });

        it("throttles scroll handler by RAF (multiple calls schedule only one frame)", () => {
            const { result } = renderHook(() => useScrollToTopBtn());

            const el = document.createElement("div") as any;
            el.scrollTop = 10;
            el.scrollTo = jest.fn();

            act(() => {
                (result.current.containerRef as any).current = el;
            });

            act(() => {
                result.current.handleScroll();
                result.current.handleScroll();
                result.current.handleScroll();
            });

            expect(global.requestAnimationFrame).toHaveBeenCalledTimes(1);

            act(() => {
                flushRaf();
            });

            expect(result.current.isVisible).toBe(true);
        });

        it("scrollToTop calls container.scrollTo with smooth behavior", () => {
            const { result } = renderHook(() => useScrollToTopBtn());

            const el = document.createElement("div") as any;
            el.scrollTop = 50;
            el.scrollTo = jest.fn();

            act(() => {
                (result.current.containerRef as any).current = el;
            });

            act(() => {
                result.current.scrollToTop();
            });

            expect(el.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
        });

        it("cancels pending RAF on unmount", () => {
            const { result, unmount } = renderHook(() => useScrollToTopBtn());

            const el = document.createElement("div") as any;
            el.scrollTop = 10;
            el.scrollTo = jest.fn();

            act(() => {
                (result.current.containerRef as any).current = el;
            });

            act(() => {
                result.current.handleScroll(); // запланировали RAF
            });

            unmount();

            expect(global.cancelAnimationFrame).toHaveBeenCalledTimes(1);
            expect(global.cancelAnimationFrame).toHaveBeenCalledWith(1);
        });
    });
});
