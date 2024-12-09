import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UpdateEventForm } from './updateEventForm';
import {getEvent, getEventOccurrences, getEventOccurrencesByEventId} from "@/actions/event";
import {DeleteEventForm} from "./deleteEventForm";
import {Car} from "lucide-react";
import {Card} from "@/components/util/card";
interface EventDetailsProps {
    params: {
        id: string;
    };
}

export default async function EventDetails({ params }: EventDetailsProps) {
    const event = await getEvent(parseInt(params.id, 10));
    const eventOccurrences = event?.id && await getEventOccurrencesByEventId(event.id);

    if (!event || "error" in event) {
        return <div>Event not found</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Link href="/admin/events" className="text-blue-500 hover:underline mb-4 block">
                &larr; Back to Events
            </Link>
            <div className="flex flex-row space-x-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
                    <div className="mb-4">
                        <Image
                            src={event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                            alt={event.name ?? "Name Not Found"}
                            width={500}
                            height={300}
                            className="rounded-lg"
                        />
                    </div>
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    <p className="text-sm text-gray-500">Admin ID: {event.admin_id}</p>
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">Update Event</h2>
                    <div className="p-3">
                        <UpdateEventForm event={event} />
                    </div>
                    <div className="p-3">
                        <DeleteEventForm event={event} />
                    </div>
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 py-8">Event Occurrences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventOccurrences && eventOccurrences.length > 0 && (
                    eventOccurrences.map((occurrence) => {
                        const startTime = new Date(occurrence.start_time);
                        return <Card title={occurrence.description ?? "No Description"} description={startTime.toDateString()} />
                }))}
            </div>
        </div>
    );
}