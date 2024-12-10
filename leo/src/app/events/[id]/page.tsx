import {getEvent, getEventOccurrencesByEventId, getEventVendors} from "@/actions/event";
import Image from 'next/image';
import Link from "next/link";
import React from "react";
import {Tables} from "../../../../types/database.types";
import {fetchAddresses} from "@/components/util/maps/FetchAddressesFromCoordinates";
import {EventOccurrenceMap} from "@/app/events/[id]/EventOccurrenceMap";
import {Card} from "@/components/util/card";
import {BasicCard} from "@/components/util/basicCard";
import {CardContent} from "@/components/util/cardContent";
import {ArrowRight, Calendar, Clock} from "lucide-react";
import {formatDate, formatTime, getDurationString, isSameDay} from "@/utils/app/dates";

interface EventDetailsProps {
    params: {
        id: string;
    };
}

export default async function EventDetails({params}: EventDetailsProps) {
    const event = await getEvent(parseInt(params.id, 10));
    const vendors = await getEventVendors(event.id)
    let eventOccurrences: Tables<'Event_Occurrences'>[] | null = null;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;

    if (!apiKey || !event) {
        return (<div className="text-center text-2xl text-red-600 mt-10">Event not found</div>);
    }

    try {
        eventOccurrences = await getEventOccurrencesByEventId(event.id)

        if (!eventOccurrences) {
        }
        const addresses = eventOccurrences ? await fetchAddresses(
            eventOccurrences
                .filter(e => e.longitude !== null && e.latitude !== null)
                .map(e => ({id: e.id, longitude: e.longitude!, latitude: e.latitude!}))
        ) : null;

        return (
            <>
                <div className="container mx-auto p-4">
                    <div className="mb-8 w-3/5 mx-auto h-64 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                            alt={event.name ?? "Event Image"}
                            width={1500}
                            height={800}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">{event.name}</h1>
                        <p className="text-center text-lg text-gray-700 mb-6 leading-relaxed">{event.description}</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-center">Event Occurrences:</h2>
                        {!eventOccurrences || eventOccurrences.length === 0 ? (
                                <div className="text-center text-2xl text-red-600 mt-10">No Event Occurrences Found</div>
                            )
                            :
                            (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {eventOccurrences.map(async (eventOccurrence) => {
                                    return (
                                        <Link href={`/events/${eventOccurrence.event_id}/eventOccurrence/${eventOccurrence.id}`}
                                              key={eventOccurrence.id} className="block">
                                            <BasicCard>
                                                <CardContent>
                                                    <div
                                                        className="mt-3 bg-gray-50 rounded-lg p-6 border border-gray-200">
                                                        <div className="space-y-4">
                                                            <div className="flex items-start gap-4">
                                                                <div
                                                                    className="w-16 h-16 flex-shrink-0 bg-blue-100 rounded-lg flex flex-col items-center justify-center text-blue-700">
                                                                    <Calendar className="w-6 h-6 mb-1"/>
                                                                    <span className="text-xs font-medium">Date</span>
                                                                </div>
                                                                <div className="flex-1">
                                                                    {isSameDay(eventOccurrence.start_time, eventOccurrence.end_time) ? (
                                                                        <p className="text-gray-900 font-medium">
                                                                            {formatDate(eventOccurrence.start_time)}
                                                                        </p>
                                                                    ) : (
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <p className="text-gray-900 font-medium">
                                                                                    {formatDate(eventOccurrence.start_time)}
                                                                                </p>
                                                                                <ArrowRight
                                                                                    className="w-4 h-4 text-gray-400"/>
                                                                                <p className="text-gray-900 font-medium">
                                                                                    {formatDate(eventOccurrence.end_time)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    <p className="text-gray-500 text-sm mt-1">
                                                                        Duration: {getDurationString(eventOccurrence.start_time, eventOccurrence.end_time)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-start gap-4">
                                                                <div
                                                                    className="w-16 h-16 flex-shrink-0 bg-green-100 rounded-lg flex flex-col items-center justify-center text-green-700">
                                                                    <Clock className="w-6 h-6 mb-1"/>
                                                                    <span className="text-xs font-medium">Time</span>
                                                                </div>
                                                                <div className="flex-1 flex items-center gap-3">
                                                                    <div>
                                                                        <p className="text-gray-900 font-medium">
                                                                            {formatTime(eventOccurrence.start_time)}
                                                                        </p>
                                                                        <p className="text-gray-500 text-sm">Start</p>
                                                                    </div>
                                                                    <div
                                                                        className="text-gray-400 flex-1 border-t border-dashed border-gray-300 relative top-3">
                                                                        <span
                                                                            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2">to</span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-900 font-medium">
                                                                            {formatTime(eventOccurrence.end_time)}
                                                                        </p>
                                                                        <p className="text-gray-500 text-sm">End</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </BasicCard>
                                        </Link>
                                    );
                                })}
                            </div>)}
                    </div>

                    {eventOccurrences && addresses && (
                        <EventOccurrenceMap event_occurrences={eventOccurrences} addresses={addresses}/>
                    )}
                    <div className="flex flex-row mb-4 mt-6 justify-center">
                        <h1 className="mt-8 text-xl font-bold text-gray-800">Vendors </h1>
                    </div>
                    {!vendors || vendors.length === 0 ? (
                            <div className="text-center text-2xl text-red-600 mt-10 mb-16">No Vendors found</div>
                        )
                        :
                        (<div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vendors.map(async (vendor) => {
                                return (
                                    <Link href={`../../../vendors/${vendor.id}`} key={vendor.id}>
                                        <Card
                                            title={vendor.name}
                                            description={vendor.description ?? "VENDOR DESCRIPTION"}
                                            image={vendor.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                                        />
                                    </Link>
                                );
                            })}
                        </div>)}
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