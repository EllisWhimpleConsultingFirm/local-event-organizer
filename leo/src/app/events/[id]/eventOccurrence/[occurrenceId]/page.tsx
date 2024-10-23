import { getEvent } from "@/actions/event";
import Image from 'next/image';
import Link from "next/link";
import React from "react";
import {Tables} from "../../../../../../types/database.types";
import {Card} from "@/components/util/card";

interface EventDetailsProps {
    params: {
        id: string;
        occurrenceId: string;
    };
}

const vendors : (Tables<'Vendors'>)[] = [
    {
        id : 1,
        description : "Test Description",
        photo_url : "https://rnjoinjtiwtrnpwlvkeu.supabase.co/storage/v1/object/public/events-pictures/10.png",
        created_at : "2024-10-09 21:36:30.851+00",
        name : "Testers of Patience",
        phone_number: 123456789,
        email : "testyMcTesterson@gmail.com",
    },
    {
        id : 1,
        description : "Test Description",
        photo_url : "https://rnjoinjtiwtrnpwlvkeu.supabase.co/storage/v1/object/public/events-pictures/10.png",
        created_at : "2024-10-09 21:36:30.851+00",
        name : "Testers of Patience II",
        phone_number: 123456789,
        email : "testyMcTesterson@gmail.com",
    },
];

export default async function EventOccurrenceDetails({ params }: EventDetailsProps) {
    const eventOccurrence = await getEvent(parseInt(params.occurrenceId, 10)); //TODO UPDATE THIS TO GRAB EVENT OCCURRENCE INFO
    const event = await getEvent(parseInt(params.id, 10));

    if (!eventOccurrence || "error" in eventOccurrence) {
        return (
            <div className="text-center text-2xl text-red-600 mt-10">Event Occurrence not found</div>
        );
    }
    else if (!event || "error" in event) {
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
                        src={event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
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
                    {vendors.map((vendor) => {
                        return (
                            <Link href={`../../../vendors/${vendor.id}`} key={vendor.id}>
                                <Card
                                    title={vendor.name}
                                    description={vendor.description ?? "VENDOR DESCRIPTION"}
                                    image={vendor.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                                    // description={vendor.description} TODO add this value in supabase
                                    // image={vendor.img_url} TODO add this value in supabase
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}