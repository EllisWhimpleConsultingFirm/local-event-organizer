import {Tables} from "../../../../types/database.types";
import {Button} from "@/components/util/button";
import Image from "next/image";
import React from "react";
import {fetchAddress} from "@/components/util/maps/FetchAddressesFromCoordinates";
import {MapPin} from "@/public/map-pin";

interface EventOccurrenceCardProps {
    eventOccurrence: Tables<'Event_Occurrences'>;
    event: Tables<'Events'>;
}

export default async function EventOccurrenceCard({ eventOccurrence, event }: EventOccurrenceCardProps) {
    const startDate = new Date(eventOccurrence.start_time);
    const endDate = new Date(eventOccurrence.end_time);

    // Fetch the address if latitude and longitude are available
    const address = eventOccurrence.latitude && eventOccurrence.longitude
        ? await fetchAddress({
            latitude: eventOccurrence.latitude,
            longitude: eventOccurrence.longitude,
        })
        : { address: "Address unknown" };

    return (
        <div className="bg-white rounded-3xl shadow-lg flex flex-col overflow-hidden">
            <div className="flex-grow">
                {event.photo_url && event.description && (
                    <Image
                        src={event.photo_url}
                        alt={event.description}
                        width={250}
                        height={250}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="flex flex-col justify-between p-4">
                <div className="flex justify-between">
                    <h2 className="text-sm font-bold">{startDate.toDateString()}</h2>
                    <h2 className="text-sm font-bold">-</h2>
                    <h2 className="text-sm font-bold">{endDate.toDateString()}</h2>
                </div>

                <div className="flex items-center pt-2 text-sm text-gray-600">
                    <MapPin/>
                    <span>{address.address}</span>
                </div>

                <div className="flex justify-between mt-4">
                    <Button style="px-4">Edit</Button>
                    <Button style="px-4">Remove</Button>
                </div>
            </div>
        </div>
    );
}