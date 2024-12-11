import React from 'react';
import {Tables} from "../../../../types/database.types";
import {EventMapClient} from "@/components/util/maps/EventMapClient";

type EventMapProps = {
    event_occurrences: Tables<"Event_Occurrences">[];
    addresses: { [p: string]: string }
};

export const EventOccurrenceMap: React.FC<EventMapProps> = async ({event_occurrences, addresses}) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
    if (!apiKey) {
        return <p>Error: API key not found</p>;
    }

    return (
        <EventMapClient markers={
            event_occurrences.map((e) => ({
                id: e.id,
                latitude: e.latitude ? e.latitude : 0,
                longitude: e.longitude ? e.longitude : 0
            }))}
            addresses={addresses}
            apiKey={apiKey}/>
    );
};

export default EventOccurrenceMap;
