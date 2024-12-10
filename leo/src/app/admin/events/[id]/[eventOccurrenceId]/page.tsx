import Link from "next/link";
import React from "react";
import Image from "next/image";
import {
    getEvent,
    getEventOccurrence,
    getEventOccurrenceVendors,
} from "@/actions/event";
import {getEventOccurrencePendingVendors} from "@/actions/applications";
import {DeleteEventOccurrenceForm} from "@/app/admin/events/[id]/[eventOccurrenceId]/deleteEventOccurrenceForm";
import {UpdateEventOccurrenceForm} from "@/app/admin/events/[id]/[eventOccurrenceId]/updateEventOccurrenceForm";
import {EventOccurrenceTabs} from "@/app/admin/events/[id]/[eventOccurrenceId]/eventOccurrenceTabs";

interface EventOccurrenceDetailsProps {
    params: {
        id: string;
        eventOccurrenceId: string
    };
}

export default async function EventOccurrenceDetails({ params }: EventOccurrenceDetailsProps) {
    const eventId = parseInt(params.id, 10)
    const eventOccurrenceId = parseInt(params.eventOccurrenceId, 10)

    const event = await getEvent(eventId);
    const eventOccurrence = await getEventOccurrence(eventOccurrenceId)

    if (!event || "error" in event) {
        return <div>Event not found</div>;
    }

    if (!eventOccurrence || "error" in eventOccurrence) {
        return <div>Event Occurrence not found</div>;
    }

    const eventVendors = await getEventOccurrenceVendors(eventOccurrenceId)

    const pendingVendors = await getEventOccurrencePendingVendors(eventOccurrenceId)

    if (!eventVendors || "error" in eventVendors) {
        return <div>Vendors for this Event were not found</div>;
    }

    if (!pendingVendors || "error" in pendingVendors) {
        return <div>Error Retrieving the pending applications for this Event</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Link href={`/admin/events/${eventId}`} className="text-blue-500 hover:underline mb-4 block">
                &larr; Back to Event Page
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
                    <p className="text-gray-700 mb-4">Description: {eventOccurrence.description}</p>
                    <p className="text-gray-700 mb-4">Start Time: {eventOccurrence.start_time}</p>
                    <p className="text-gray-700 mb-4">End Time: {eventOccurrence.end_time}</p>
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">Update Event</h2>
                    <div className="p-3">
                        <UpdateEventOccurrenceForm eventOccurrence={eventOccurrence} />
                    </div>
                    <div className="p-3">
                        <DeleteEventOccurrenceForm eventOccurrence={eventOccurrence} />
                    </div>
                </div>
            </div>
            <EventOccurrenceTabs eventVendors={eventVendors} pendingVendors={pendingVendors} event={event}></EventOccurrenceTabs>
        </div>
    )
}