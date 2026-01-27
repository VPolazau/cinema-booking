import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Separator } from "./Separator";

jest.mock("./Separator.styles", () => ({
    StyledSeparator: ({ type, className }: any) => (
        <div
            data-testid="separator"
            data-type={type}
            className={className}
        />
    ),
}));

describe("Separator", () => {
    it("renders separator", () => {
        render(<Separator type="dashed" />);

        expect(screen.getByTestId("separator")).toBeInTheDocument();
    });

    it("passes type prop to StyledSeparator", () => {
        render(<Separator type="dotted" />);

        const separator = screen.getByTestId("separator");
        expect(separator).toHaveAttribute("data-type", "dotted");
    });

    it("passes className prop", () => {
        render(<Separator type="solid" className="custom-class" />);

        const separator = screen.getByTestId("separator");
        expect(separator).toHaveClass("custom-class");
    });
});
