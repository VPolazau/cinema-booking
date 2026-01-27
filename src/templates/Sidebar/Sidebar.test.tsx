import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as utils from "@utils";

jest.mock("@mui/material", () => {
    const actual = jest.requireActual("@mui/material");
    return {
        ...actual,
        Drawer: ({ open, children }: any) => (open ? <div data-testid="drawer">{children}</div> : null),
    };
});

import { Sidebar } from "./Sidebar";

jest.mock("@ui", () => ({
    Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
    Separator: () => <div data-testid="separator" />,
}));

jest.mock("@/templates", () => ({
    ChatList: ({ chats }: { chats: Array<{ id: string; name: string }> }) => (
        <div data-testid="chat-list">
            {chats?.map((c) => (
                <div key={c.id}>{c.name}</div>
            ))}
        </div>
    ),
}));

jest.mock("@utils", () => ({
    ...jest.requireActual("@utils"),
    useDeviceMedia: jest.fn(),
    useCommonState: jest.fn(),
}));

describe("Sidebar", () => {
    const mockChats = [
        { id: "chat_1", name: "Alice" },
        { id: "chat_2", name: "Bob" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders fixed sidebar on desktop", () => {
        (utils.useDeviceMedia as jest.Mock).mockReturnValue({ isDesktop: true });
        (utils.useCommonState as jest.Mock).mockReturnValue({
            chats: mockChats,
            selectedChatId: "chat_1",
        });

        render(<Sidebar />);

        expect(screen.getByTestId("chat-list")).toBeInTheDocument();
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();

        expect(screen.queryByTestId("icon-burger")).not.toBeInTheDocument();
        expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
    });

    it("renders burger button on mobile", () => {
        (utils.useDeviceMedia as jest.Mock).mockReturnValue({ isDesktop: false });
        (utils.useCommonState as jest.Mock).mockReturnValue({
            chats: mockChats,
            selectedChatId: "chat_1",
        });

        render(<Sidebar />);
        expect(screen.getByTestId("icon-burger")).toBeInTheDocument();
    });

    it("initially opens drawer if selectedChatId is null", () => {
        (utils.useDeviceMedia as jest.Mock).mockReturnValue({ isDesktop: false });
        (utils.useCommonState as jest.Mock).mockReturnValue({
            chats: mockChats,
            selectedChatId: null,
        });

        render(<Sidebar />);

        expect(screen.getByTestId("drawer")).toBeInTheDocument();
        expect(screen.getByTestId("chat-list")).toBeInTheDocument();
        expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("initially closes drawer if selectedChatId exists", () => {
        (utils.useDeviceMedia as jest.Mock).mockReturnValue({ isDesktop: false });
        (utils.useCommonState as jest.Mock).mockReturnValue({
            chats: mockChats,
            selectedChatId: "chat_1",
        });

        render(<Sidebar />);

        expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
        expect(screen.queryByTestId("chat-list")).not.toBeInTheDocument();
    });

    it("opens drawer on burger click (when initially closed)", () => {
        (utils.useDeviceMedia as jest.Mock).mockReturnValue({ isDesktop: false });
        (utils.useCommonState as jest.Mock).mockReturnValue({
            chats: mockChats,
            selectedChatId: "chat_1",
        });

        const { container } = render(<Sidebar />);

        const burgerBtn = container.querySelector(".sidebar__burger-btn") as HTMLElement;
        expect(burgerBtn).toBeInTheDocument();

        fireEvent.click(burgerBtn);

        expect(screen.getByTestId("drawer")).toBeInTheDocument();
        expect(screen.getByTestId("chat-list")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("closes drawer on back button click (when opened)", () => {
        (utils.useDeviceMedia as jest.Mock).mockReturnValue({ isDesktop: false });
        (utils.useCommonState as jest.Mock).mockReturnValue({
            chats: mockChats,
            selectedChatId: null,
        });

        const { container } = render(<Sidebar />);

        expect(screen.getByTestId("drawer")).toBeInTheDocument();

        const backBtn = container.querySelector(".back-btn") as HTMLElement;
        expect(backBtn).toBeInTheDocument();

        fireEvent.click(backBtn);

        expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
        expect(screen.queryByTestId("chat-list")).not.toBeInTheDocument();
    });
});
