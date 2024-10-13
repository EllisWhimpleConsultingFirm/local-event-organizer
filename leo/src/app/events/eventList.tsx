'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom'
import { EventCard } from "@/components/event_card/event-card";
import { EventWithPicture } from "@/services/events";
import { deleteEvent } from '@/actions/event'
import Link from 'next/link';

interface EventListProps {
    events: EventWithPicture[];
    onEventDeleted: () => void;
}

function DeleteButton() {
    const { pending } = useFormStatus()

    return (
        <button disabled={pending} type="submit" className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded">
            {pending ? 'Deleting...' : 'Delete'}
        </button>
    )
}

export function EventList({ events, onEventDeleted }: EventListProps) {
    const handleDelete = async (formData: FormData) => {
        await deleteEvent(null, formData);
        onEventDeleted();
    };

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
                    <form action={handleDelete}>
                        <input type="hidden" name="id" value={event.id} />
                        <DeleteButton />
                    </form>
                </div>
            ))}
        </div>
    );
}