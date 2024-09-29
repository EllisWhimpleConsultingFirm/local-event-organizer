'use client';

import React, {useEffect, useState} from 'react';
import { useFormState, useFormStatus } from 'react-dom'
import { EventCard } from "@/components/event_card/event-card";
import { EventWithPicture } from "@/services/events";
import { deleteEvent } from '@/actions/event'
import Link from 'next/link';

interface EventListProps {
    initialEvents: EventWithPicture[];
}

function DeleteButton() {
    const { pending } = useFormStatus()

    return (
        <button disabled={pending} type="submit" className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded">
            {pending ? 'Deleting...' : 'Delete'}
        </button>
    )
}

export function EventList({ initialEvents }: EventListProps) {
    const [state, formAction] = useFormState(deleteEvent, null);
    const [events, setEvents] = useState(initialEvents);

    useEffect(() => {
        const handleEventAdded = async () => {
            // Fetch updated events list
            const response = await fetch('/api/events');
            const updatedEvents = await response.json();
            setEvents(updatedEvents);
        };

        window.addEventListener('eventAdded', handleEventAdded);

        return () => {
            window.removeEventListener('eventAdded', handleEventAdded);
        };
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
                <div key={event.id} className="relative">
                    <Link href={`/events/${event.id}`} className="block">
                        <EventCard
                            title={event.name || ""}
                            description={event.description || ""}
                            image={event.pictureUrl}
                        />
                    </Link>
                    <form action={formAction} onClick={(e) => e.stopPropagation()}>
                        <input type="hidden" name="id" value={event.id} />
                        <DeleteButton />
                    </form>
                    {state?.message && <p className="text-red-500">{state.message}</p>}
                </div>
            ))}
        </div>
    );
}