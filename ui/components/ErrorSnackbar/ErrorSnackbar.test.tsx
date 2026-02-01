import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ErrorSnackbar } from "./ErrorSnackbar";

// mocks
const backMock = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({ back: backMock }),
}));

const useDeviceMediaMock = jest.fn();
jest.mock("@utils", () => ({
    useDeviceMedia: () => useDeviceMediaMock(),
}));

const snackbarMock = jest.fn();

jest.mock("@mui/material", () => ({
    Snackbar: (props: any) => {
        snackbarMock(props);
        const { open, children, onClose } = props;

        if (!open) return null;

        return (
            <div data-testid="snackbar">
                {/* даем возможность дернуть onClose руками */}
                <button data-testid="snackbar-close" onClick={() => onClose?.({}, "timeout")}>
                    close
                </button>
                {children}
            </div>
        );
    },

    Alert: ({ children, onClose }: any) => (
        <div role="alert">
            <button data-testid="alert-close" onClick={() => onClose?.({}, "clickaway")}>
                close
            </button>
            {children}
        </div>
    ),
}));

describe("ErrorSnackbar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useDeviceMediaMock.mockReturnValue({ isDesktop: true });
    });

    it("does not render when isError is false", () => {
        render(<ErrorSnackbar isError={false} />);

        expect(screen.queryByTestId("snackbar")).not.toBeInTheDocument();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("renders when isError is true (after effect)", async () => {
        render(<ErrorSnackbar isError={true} />);

        await waitFor(() => {
            expect(screen.getByTestId("snackbar")).toBeInTheDocument();
        });

        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("renders custom message", async () => {
        render(<ErrorSnackbar isError={true} message="Timeout error" />);

        expect(await screen.findByText("Timeout error")).toBeInTheDocument();
    });

    it("opens again when isError toggles from false to true", async () => {
        const { rerender } = render(<ErrorSnackbar isError={false} />);
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();

        rerender(<ErrorSnackbar isError={true} />);

        expect(await screen.findByRole("alert")).toBeInTheDocument();
    });

    it("calls router.back() on close via Alert", async () => {
        render(<ErrorSnackbar isError={true} />);

        await screen.findByTestId("snackbar");

        fireEvent.click(screen.getByTestId("alert-close"));
        expect(backMock).toHaveBeenCalledTimes(1);
    });

    it("calls router.back() on close via Snackbar onClose", async () => {
        render(<ErrorSnackbar isError={true} />);

        await screen.findByTestId("snackbar");

        fireEvent.click(screen.getByTestId("snackbar-close"));
        expect(backMock).toHaveBeenCalledTimes(1);
    });

    it("uses correct anchorOrigin for desktop", async () => {
        useDeviceMediaMock.mockReturnValue({ isDesktop: true });

        render(<ErrorSnackbar isError={true} />);

        await screen.findByTestId("snackbar");

        const lastCallProps = snackbarMock.mock.calls.at(-1)?.[0];
        expect(lastCallProps.anchorOrigin).toEqual({ vertical: "bottom", horizontal: "right" });
    });

    it("uses correct anchorOrigin for non-desktop", async () => {
        useDeviceMediaMock.mockReturnValue({ isDesktop: false });

        render(<ErrorSnackbar isError={true} />);

        await screen.findByTestId("snackbar");

        const lastCallProps = snackbarMock.mock.calls.at(-1)?.[0];
        expect(lastCallProps.anchorOrigin).toEqual({ vertical: "top", horizontal: "center" });
    });
});