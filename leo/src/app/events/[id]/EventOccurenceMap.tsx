// EventMap.server.tsx

import React from 'react';
import { Tables } from "../../../../types/database.types";
import {EventMapClient} from "@/components/util/maps/EventMapClient";

type EventMapProps = {
    event_occurrences: Tables<"Event_Occurrences">[];
};

async function fetchAddresses(event_occurrences: Tables<"Event_Occurrences">[], apiKey: string) {
    const geocodePromises = event_occurrences.map(async (event) => {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.latitude},${event.longitude}&key=${apiKey}`
        );
        const data = await response.json();
        if (data.results[0]) {
            return { id: event.id, address: data.results[0].formatted_address };
        }
        return { id: event.id, address: 'Address not found' };
    });

    const resolvedAddresses = await Promise.all(geocodePromises);
    return resolvedAddresses.reduce((acc, curr) => {
        acc[curr.id] = curr.address;
        return acc;
    }, {} as { [key: string]: string });
}

export const EventMap: React.FC<EventMapProps> = async ({ event_occurrences }) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
    if (!apiKey) {
        return <p>Error: API key not found</p>;
    }

    const addresses = await fetchAddresses(event_occurrences, apiKey);
    return (
        <EventMapClient markers={event_occurrences} addresses={addresses} apiKey={apiKey} />
    );
};

export default EventMap;
