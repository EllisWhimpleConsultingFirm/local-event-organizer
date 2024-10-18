import { getEvent } from "@/actions/event";
import Image from 'next/image';
import Link from "next/link";
import React from "react";
import {Tables} from "../../../../types/database.types";
import {EventWithPicture} from "@/services/events";
import {Card} from "@/components/util/card";

interface VendorDetailsProps {
    params: {
        id: string;
    };
}
const defaultImage = "https://rnjoinjtiwtrnpwlvkeu.supabase.co/storage/v1/object/public/events-pictures/10.png"

const vendor : (Tables<'Vendors'>) =
    {
        id : 1,
        created_at : "2024-10-09 21:36:30.851+00",
        name : "Testers of Patience",
        phone_number: 123456789,
        email : "testyMcTesterson@gmail.com",
        photo_url : "https://rnjoinjtiwtrnpwlvkeu.supabase.co/storage/v1/object/public/events-pictures/10.png",
        description : "Test Description"
    };

const eventOccurrences : (Tables<'Event_Occurences'>)[] = [
    {
        id : 4,
        created_at: "2024-10-09 21:36:30.851+00",
        event_id: 4,
        start_time: "2024-10-17 20:36:30.851",
        end_time: "2024-10-17 21:36:30.851",
        latitude: -73.882575,
        longitude: -18.947416
    },
    {
        id : 2,
        created_at:"2024-10-09 21:36:30.851+00",
        event_id: 2,
        start_time:"2024-10-17 20:36:30.851",
        end_time:"2024-10-17 21:36:30.851",
        latitude: -73.882575,
        longitude: -18.947416
    },
];

export default async function VendorDetails({ params }: VendorDetailsProps) {
    console.log(params)
    // TODO get vendor information based on the id
    // TODO get event information based on event occurrences of vendor
    const eventArray : {event: EventWithPicture, eventOccurrence: Tables<'Event_Occurences'>}[] = []
    try {
        for (let i = 0; i < eventOccurrences.length; i++) {
            const event = await getEvent(eventOccurrences[i].event_id);
            if (!event || 'error' in event) {
                throw new Error("Error retrieving events")
            }
            eventArray.push({eventOccurrence : eventOccurrences[i], event})
        }
    } catch (e) {
        return (
                <div className="text-center text-2xl text-red-600 mt-10">Error retrieving the Events</div>
        );
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
                                <Link href={`../events/${eventOccurrence.event_id}/eventOccurrence/${eventOccurrence.id}`} key={eventOccurrence.id}>
                                    <Card
                                        title={event.name}
                                        description={event.description}
                                        image={event.pictureUrl}
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