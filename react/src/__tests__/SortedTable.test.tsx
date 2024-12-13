import { render, screen } from "@testing-library/react";
import SortedTable from "../components/SortedTable";
import userEvent from "@testing-library/user-event";
import { Channel } from "../types";
import { describe, it, expect, vi } from "vitest";

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

describe("SortedTable Component", () => {
    const reloadChannels = vi.fn();

    beforeEach(() => {
        render(<SortedTable rows={mockData} reloadChannels={reloadChannels} />);
    });

    it("renders table with correct data", () => {
        expect(screen.getByText("Kanały")).toBeInTheDocument();
        expect(screen.getByText("Nazwa")).toBeInTheDocument();
        expect(screen.getByText("Ilość")).toBeInTheDocument();

        expect(
            screen.getByRole("cell", { name: "Google" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("cell", { name: "Youtube" })
        ).toBeInTheDocument();
    });
    it("sorts channels when header is clicked", async () => {
        const nameHeader = screen.getByText("Nazwa");

        const googleCell = screen.getByText("Google");
        const youtubeCell = screen.getByText("Youtube");

        expect(googleCell).toBeTruthy();
        expect(youtubeCell).toBeTruthy();

        expect(
            googleCell.compareDocumentPosition(youtubeCell) &
                Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();

        await userEvent.click(nameHeader);

        const googleCellAfter = screen.getByText("Google");
        const youtubeCellAfter = screen.getByText("Youtube");

        expect(youtubeCellAfter).toBeTruthy();
        expect(googleCellAfter).toBeTruthy();

        expect(
            youtubeCellAfter.compareDocumentPosition(googleCellAfter) &
                Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();
    });
});
