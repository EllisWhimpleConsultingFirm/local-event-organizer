'use client';

import React from 'react';
import { useFormStatus } from 'react-dom'
import { Card } from "@/components/util/card";
import { deleteEvent } from '@/actions/event'
import Link from 'next/link';
import {Tables} from "../../../../types/supabase";

interface EventListProps {
    events: Tables<'Events'>[];
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
                    <Link href={`/admin/events/${event.id}`} className="block">
                        <Card
                            title={event.name || ""}
                            description={event.description || ""}
                            image={event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
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