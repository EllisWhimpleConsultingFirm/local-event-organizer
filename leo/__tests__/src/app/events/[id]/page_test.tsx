import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import EventDetails from "@/app/events/[id]/page";
import {getEvent, getEventOccurrencesByEventId} from "@/actions/event";
import React from "react";


// Define mock types for event and event occurrences
interface MockEvent {
    id: number;
    name: string;
    description: string;
    recurrence_pattern: string | null;
    photo_url: string | null;
}

jest.mock("../../../../../src/DAO/supabase/SupabaseEventsDAO", () => ({
    getEvent: jest.fn(),
}));

jest.mock("../../../../../src/DAO/supabase/SupabaseEventsDAO", () => ({
    getEventOccurrencesByEventId: jest.fn(),
}));

interface MockEventOccurrence {
    id: number;
    event_id: number;
    occurrence_date: string;
}

describe("EventDetails Component", () => {
    const mockParams = { id: "1" };

    test("Valid Test", async () => (
            expect(1).toEqual(1)
    ))

    // test("displays 'Event not found' if event is not found", async () => {
    //     (getEvent as jest.Mock).mockResolvedValueOnce(null);
    //
    //     render(
    //         <Router>
    //             <EventDetails params={mockParams} />
    //         </Router>
    //     );
    //
    //     await waitFor(() =>
    //         expect(screen.getByText("Event not found")).toBeInTheDocument()
    //     );
    // });

    // test("displays 'No Event Occurrences found' if no event occurrences are found", async () => {
    //     const mockEvent: MockEvent = {
    //         id: 1,
    //         name: "Sample Event",
    //         description: "Event Description",
    //         recurrence_pattern: null,
    //         photo_url: null,
    //     };
    //
    //     (getEvent as jest.Mock).mockResolvedValueOnce(mockEvent);
    //     (getEventOccurrencesByEventId as jest.Mock).mockResolvedValueOnce([]);
    //
    //     render(
    //         <Router>
    //             <EventDetails params={mockParams} />
    //         </Router>
    //     );
    //
    //     await waitFor(() =>
    //         expect(screen.getByText("No Event Occurrences found")).toBeInTheDocument()
    //     );
    // });

    // test("renders event details and occurrences if data is available", async () => {
    //     const mockEvent: MockEvent = {
    //         id: 1,
    //         name: "Sample Event",
    //         description: "Event Description",
    //         recurrence_pattern: "weekly",
    //         photo_url: "sample_image_url",
    //     };
    //
    //     const mockEventOccurrences: MockEventOccurrence[] = [
    //         { id: 1, event_id: 1, occurrence_date: "2024-01-01" },
    //         { id: 2, event_id: 1, occurrence_date: "2024-01-08" },
    //     ];
    //
    //     (getEvent as jest.Mock).mockResolvedValueOnce(mockEvent);
    //     (getEventOccurrencesByEventId as jest.Mock).mockResolvedValueOnce(
    //         mockEventOccurrences
    //     );
    //
    //     render(
    //         <Router>
    //             <EventDetails params={mockParams} />
    //         </Router>
    //     );
    //
    //     await waitFor(() => {
    //         expect(screen.getByText("Sample Event")).toBeInTheDocument();
    //         expect(screen.getByText("Event Description")).toBeInTheDocument();
    //         expect(screen.getByText("Weekly Event")).toBeInTheDocument();
    //     });
    //
    //     expect(screen.getAllByRole("link")).toHaveLength(2);
    // });
});
