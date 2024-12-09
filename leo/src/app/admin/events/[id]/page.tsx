import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UpdateEventForm } from './updateEventForm';
import {getEvent, getEventOccurrencesByEventId, getEventVendors} from "@/actions/event";
import {DeleteEventForm} from "./deleteEventForm";
import {EventTabs} from "@/app/admin/events/[id]/eventTabs";
import {getEventPendingVendors} from "@/actions/applications";
interface EventDetailsProps {
    params: {
        id: string;
    };
}

export default async function EventDetails({ params }: EventDetailsProps) {
    const event = await getEvent(parseInt(params.id, 10));

    if (!event || "error" in event) {
        return <div>Event not found</div>;
    }

    const eventOccurrences = await getEventOccurrencesByEventId(event.id)

    const eventVendors = await getEventVendors(event.id)

    const pendingVendors = await getEventPendingVendors(event.id)

    if (!eventOccurrences || "error" in eventOccurrences) {
        return <div>Error Retrieving the Event's Occurrences</div>;
    }

    if (!eventVendors || "error" in eventVendors) {
        return <div>Vendors for this Event were not found</div>;
    }

    if (!pendingVendors || "error" in pendingVendors) {
        return <div>Error Retrieving the pending applications for this Event</div>;
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
            <EventTabs event={event} eventVendors={eventVendors} pendingVendors={pendingVendors} eventOccurrences={eventOccurrences}></EventTabs>
        </div>
    );
}