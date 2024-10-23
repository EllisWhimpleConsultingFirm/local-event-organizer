import { getEvent } from "@/actions/event";
import Image from 'next/image';
import Link from "next/link";
import React from "react";
import {Tables} from "../../../../types/database.types";
import {Card} from "@/components/util/card";
import {getVendor, getVendorEventOccurrences} from "@/actions/vendor";

interface VendorDetailsProps {
    params: {
        id: string;
    };
}
const defaultImage = "https://rnjoinjtiwtrnpwlvkeu.supabase.co/storage/v1/object/public/events-pictures/10.png"

export default async function VendorDetails({ params }: VendorDetailsProps) {
    const vendor = await getVendor(parseInt(params.id, 10))

    if (!vendor || "error" in vendor) {
        return (
            <div className="text-center text-2xl text-red-600 mt-10">Vendor not found</div>
        );
    }

    const eventOccurrences = await getVendorEventOccurrences(vendor.id)

    const eventArray: { event: Tables<'Events'>, eventOccurrence: Tables<'Event_Occurrences'> }[] = [];

    function isValidEventOccurrences(data: unknown): data is Tables<'Event_Occurrences'>[] {
        return Array.isArray(data) && !("error" in data);
    }

    if (eventOccurrences && isValidEventOccurrences(eventOccurrences)) {
        try {
            for (const occurrence of eventOccurrences) {
                if (!occurrence || !occurrence.event_id) continue; // Skip invalid occurrences

                const event = await getEvent(occurrence.event_id);
                if (!event || 'error' in event) {
                    throw new Error("Error retrieving events");
                }
                eventArray.push({ eventOccurrence: occurrence, event });
            }
        } catch (e) {
            return (
                <div className="text-center text-2xl text-red-600 mt-10">Error retrieving the Events</div>
            );
        }
    }

    return (
        <>
            <div className="container mx-auto p-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">{vendor.name}</h1>
                <div className="mb-8 w-4/5 mx-auto h-64 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src={vendor.photo_url ?? defaultImage}
                        alt={vendor.name ?? "Event Image"}
                        width={1500}
                        height={800}
                        className="w-full h-full object-cover"
                    />
                </div>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">{vendor.description}</p>
                <div className="flex flex-row mb-4 mt-6 justify-around">
                    <h1 className="text-xl font-bold text-gray-800">Events : </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {eventArray.map(async ({event, eventOccurrence}) => {
                        if (event.name && event.description) {
                            return (
                                <Link href={`../events/${event.id}/eventOccurrence/${eventOccurrence.id}`} key={eventOccurrence.id}>
                                    <Card
                                        title={event.name}
                                        description={event.description}
                                        image={event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                                    />
                                </Link>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </>
    );
}