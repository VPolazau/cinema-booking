import { renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";

import { useDeviceMedia } from "./useDeviceMedia";
import { useMatchedMedia } from "./useMatchedMedia";
import { MEDIA_QUERIES } from "../../lib";

jest.mock("./useMatchedMedia", () => ({
    useMatchedMedia: jest.fn(),
}));

describe("useDeviceMedia", () => {
    const mockedUseMatchedMedia =
        useMatchedMedia as jest.MockedFunction<typeof useMatchedMedia>;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns isDesktop=true when media is desktop", () => {
        mockedUseMatchedMedia.mockReturnValue(
            MEDIA_QUERIES.desktopMedia
        );

        const { result } = renderHook(() => useDeviceMedia());

        expect(result.current).toEqual({
            isDesktop: true,
            isTablet: false,
            isMobile: false,
        });
    });

    it("returns isTablet=true when media is tablet", () => {
        mockedUseMatchedMedia.mockReturnValue(
            MEDIA_QUERIES.tabletMedia
        );

        const { result } = renderHook(() => useDeviceMedia());

        expect(result.current).toEqual({
            isDesktop: false,
            isTablet: true,
            isMobile: false,
        });
    });

    it("returns isMobile=true when media is mobile", () => {
        mockedUseMatchedMedia.mockReturnValue(
            MEDIA_QUERIES.mobileMedia
        );

        const { result } = renderHook(() => useDeviceMedia());

        expect(result.current).toEqual({
            isDesktop: false,
            isTablet: false,
            isMobile: true,
        });
    });

    it("passes callback to useMatchedMedia", () => {
        const callback = jest.fn();
        mockedUseMatchedMedia.mockReturnValue(
            MEDIA_QUERIES.desktopMedia
        );

        renderHook(() => useDeviceMedia(callback));

        expect(mockedUseMatchedMedia).toHaveBeenCalledWith(callback);
    });
});
