import {getEvent, getEventOccurrencesByEventId} from "@/actions/event";
import Image from 'next/image';
import {CalendarDays} from "lucide-react";
import Link from "next/link";
import React from "react";
import EventOccurrenceCard from "@/app/events/[id]/EventOccurrenceCard";
import {capitalizeFirstLetter} from "@/utils/app/capitalizeFirstLetter";
import EventOccurenceMap from "@/app/events/[id]/EventOccurenceMap";
import {isError, Result} from "../../../../types/Result";
import {Tables} from "../../../../types/database.types";
import {fetchAddresses} from "@/components/util/maps/FetchAddressesFromCoordinates";
import {EventOccurrenceMap} from "@/app/events/[id]/EventOccurrenceMap";

interface EventDetailsProps {
    params: {
        id: string;
    };
}

export default async function EventDetails({params}: EventDetailsProps) {
    const event = await getEvent(parseInt(params.id, 10));
    let eventOccurrences: Tables<'Event_Occurrences'>[] | null = null;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;

    if (!apiKey || !event) {
        return (<div className="text-center text-2xl text-red-600 mt-10">Event not found</div>);
    }

    try {
        eventOccurrences = await getEventOccurrencesByEventId(event?.id)

        if(!eventOccurrences) {}
        const addresses = eventOccurrences ? await fetchAddresses(
            eventOccurrences
                .filter(e => e.longitude !== null && e.latitude !== null)
                .map(e => ({id: e.id, longitude: e.longitude!, latitude: e.latitude!}))
        ): null;

        return (
            <>
                <div className="container mx-auto p-4 max-w-4xl">
                    <div className="mb-8 w-4/5 mx-auto h-64 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                            alt={event.name ?? "Event Image"}
                            width={1500}
                            height={800}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">{event.name}</h1>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">{event.description}</p>
                    <div className="flex flex-row mb-4 mt-6 justify-around">
                    </div>
                    <div className="flex gap-2 overflow-x-scroll">
                        {eventOccurrences?.map((eventOccurrence) => (
                            <Link href={`${eventOccurrence.event_id}/eventOccurrence/${eventOccurrence.id}`}
                                  key={eventOccurrence.id}>
                                <EventOccurrenceCard
                                    eventOccurrence={eventOccurrence}
                                />
                            </Link>
                        ))}
                    </div>
                    {eventOccurrences && addresses && (
                        <EventOccurrenceMap event_occurrences={eventOccurrences} addresses={addresses}/>
                    )}
                </div>
            </>
        );
    } catch (error) {
        error = (error as Error).message
        return (
            <p>{error as string}</p>
        )
    }
}