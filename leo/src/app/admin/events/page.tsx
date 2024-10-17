'use client';

import React, { useState, useEffect } from 'react';
import { EventList } from './eventList';
import { AddEventButtonModal } from './AddEventButtonModal';
import { EventWithPicture } from "@/services/events";

async function fetchEvents() {
    const response = await fetch('/api/events');
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    return response.json();
}

export default function EventsManagement() {
    const [events, setEvents] = useState<EventWithPicture[]>([]);

    useEffect(() => {
        fetchEvents().then(setEvents);
    }, []);

    const refreshEvents = () => {
        fetchEvents().then(setEvents);
    };

    return (
        <div className="container mx-auto p-10">
            <div className="flex justify-between items-center mb-4 p-20">
                <h1 className="text-5xl font-bold">Event Management</h1>
                <AddEventButtonModal onEventAdded={refreshEvents} />
            </div>

            <EventList events={events} onEventDeleted={refreshEvents} />
        </div>
    );
}