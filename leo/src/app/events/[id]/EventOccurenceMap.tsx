import React from 'react';
import {Tables} from "../../../../types/database.types";
import {EventMapClient} from "@/components/util/maps/EventMapClient";

type EventMapProps = {
    event_occurrences: Tables<"Event_Occurrences">[];
    addresses:  { [p: string]: string }
};

export const EventMap: React.FC<EventMapProps> = ({ event_occurrences, addresses }) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
    if (!apiKey) {
        return <p>Error: API key not found</p>;
    }

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <EventMapClient markers={event_occurrences as any[]} addresses={addresses} apiKey={apiKey} />
    );
};

export default EventMap;
