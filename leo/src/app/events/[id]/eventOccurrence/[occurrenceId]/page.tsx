import { getEvent, getEventOccurrence, getEventVendors } from "@/actions/event";
import { getVendor } from "@/actions/vendor";
import Image from 'next/image';
import Link from "next/link";
import React from "react";
import {Card} from "@/components/util/card";

interface EventDetailsProps {
    params: {
        id: string;
        occurrenceId: string;
    };
}

export default async function EventOccurrenceDetails({ params }: EventDetailsProps) {
    const eventOccurrence = await getEventOccurrence(parseInt(params.occurrenceId, 10));
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

    const vendors = await getEventVendors(eventOccurrence.id)

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
                {!vendors || "error" in vendors || vendors.length === 0 ? (
                    <div className="text-center text-2xl text-red-600 mt-10">No Vendors found</div>
                )
                :
                (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendors.map(async (vendor) => {
                        const currentVendor = await getVendor(vendor.vendor_id)
                        if (currentVendor && !("error" in currentVendor)) {
                            return (
                                <Link href={`../../../vendors/${currentVendor.id}`} key={currentVendor.id}>
                                    <Card
                                        title={currentVendor.name}
                                        description={currentVendor.description ?? "VENDOR DESCRIPTION"}
                                        image={currentVendor.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                                    />
                                </Link>
                            );
                        }
                    })}
                </div>)}
            </div>
        </>
    );
}