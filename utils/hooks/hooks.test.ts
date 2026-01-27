import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
}));

import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import { usePageTransition } from "./usePageTransition";
import { useMounted } from "./useMounted";
import { useCommonState } from "./useCommonState";

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
});
