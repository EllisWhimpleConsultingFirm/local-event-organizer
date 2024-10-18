import { getEvent } from "@/actions/event";
import Image from 'next/image';
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import React from "react";
import EventOccurrenceCard from "@/app/events/[id]/EventOccurrenceCard";
import {Tables} from "../../../../../../types/database.types";

interface EventDetailsProps {
    params: {
        id: string;
    };
}

const eventOccurrences : (Tables<'Event_Occurences'>)[] = [
    {
        id : 1,
        created_at:"2024-10-09 21:36:30.851+00",
        event_id:2,
        start_time:"2024-10-17 20:36:30.851",
        end_time:"2024-10-17 21:36:30.851",
        latitude: -73.882575,
        longitude: -18.947416
    },
    {
        id : 2,
        created_at:"2024-10-09 21:36:30.851+00",
        event_id:2,
        start_time:"2024-10-17 20:36:30.851",
        end_time:"2024-10-17 21:36:30.851",
        latitude: -73.882575,
        longitude: -18.947416
    },
];

const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export default async function EventOccurrenceDetails({ params }: EventDetailsProps) {
    const eventOccurrence = await getEvent(parseInt(params.id, 10)); //TODO UPDATE THIS TO GRAB EVENT OCCURRENCE INFO

    if (!eventOccurrence || "error" in eventOccurrence) {
        return (
            <div className="text-center text-2xl text-red-600 mt-10">Event Occurrence not found</div>
        );
    }

    const event = await getEvent(eventOccurrence.id);

    if (!event || "error" in event) {
        return (
            <div className="text-center text-2xl text-red-600 mt-10">Event Associated with the Event Occurrence was not found</div>
        );
    }

    return (
        <>
            <div className="container mx-auto p-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">{event.name}</h1>
                <div className="mb-8 w-4/5 mx-auto h-64 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src={event.pictureUrl}
                        alt={event.name ?? "Event Image"}
                        width={1500}
                        height={800}
                        className="w-full h-full object-cover"
                    />
                </div>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">{eventOccurrence.description}</p>
                <div className="flex flex-row mb-4 mt-6 justify-center">
                    <h1 className="text-xl font-bold text-gray-800">Vendors </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventOccurrences.map((eventOccurrence) => {
                        return (
                            <Link href={`eventOccurrence/${eventOccurrence.id}`}>
                                <EventOccurrenceCard
                                    eventOccurrence={eventOccurrence}
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}