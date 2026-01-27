import { renderHook, act } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

import { useMatchedMedia } from "./useMatchedMedia";
import { MediaContext } from "@/context";

describe("useMatchedMedia", () => {
    it("throws error when used outside MediaContext", () => {
        expect(() => {
            renderHook(() => useMatchedMedia());
        }).toThrow(
            "useMatchedMedia must be used within a MediaQueryProvider"
        );
    });

    it("returns currentMedia from context", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <MediaContext.Provider value={{ currentMedia: "desktop" }}>
                {children}
            </MediaContext.Provider>
        );

        const { result } = renderHook(() => useMatchedMedia(), { wrapper });

        expect(result.current).toBe("desktop");
    });

    it("calls callback when currentMedia changes", () => {
        const callback = jest.fn();
        let media = "desktop";

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <MediaContext.Provider value={{ currentMedia: media }}>
                {children}
            </MediaContext.Provider>
        );

        const { rerender } = renderHook(
            () => useMatchedMedia(callback),
            { wrapper }
        );

        expect(callback).toHaveBeenCalledTimes(1);

        act(() => {
            media = "mobile";
            rerender();
        });

        expect(callback).toHaveBeenCalledTimes(2);
    });
});
