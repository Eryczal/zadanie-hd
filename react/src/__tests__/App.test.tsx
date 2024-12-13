import { act, render, screen, waitFor } from "@testing-library/react";
import { Channel } from "../types";
import { describe, it, expect, vi } from "vitest";
import App from "../App";
import { getChannels } from "../channelApi";

const mockData: Channel[] = [
    {
        id: 1,
        name: "Google",
        number: "5",
        created_at: "",
        updated_at: "",
    },
    {
        id: 2,
        name: "Youtube",
        number: "3",
        created_at: "",
        updated_at: "",
    },
];

vi.mock("../channelApi", () => ({
    getChannels: vi.fn(),
}));

const mockGetChannels = getChannels as jest.Mock;

describe("App Component", () => {
    beforeEach(() => {
        mockGetChannels.mockResolvedValue(mockData);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders loading text", () => {
        render(<App />);
        expect(screen.getByText("Wczytywanie danych...")).toBeInTheDocument();
    });

    it("renders channels after data fetch", async () => {
        await act(async () => render(<App />));

        await waitFor(() => screen.getByRole("table"));

        const rows = screen
            .getAllByRole("row")
            .filter((row) => !row.closest("thead"));
        expect(rows).toHaveLength(mockData.length);

        mockData.forEach(({ name }) => {
            const matchingRow = Array.from(rows).find((row) =>
                row.textContent?.includes(name)
            );
            expect(matchingRow).toBeDefined();
        });
    });
});
