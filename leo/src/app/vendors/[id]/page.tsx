import Image from 'next/image';
import Link from "next/link";
import React from "react";
import {Card} from "@/components/util/card";
import {getVendor, getVendorEventOccurrences, getVendorEvents} from "@/actions/vendor";
import {BasicCard} from "@/components/util/basicCard";
import {CardContent} from "@/components/util/cardContent";
import {ArrowRight, Calendar, Clock} from "lucide-react";
import {formatDate, formatTime, getDurationString, isSameDay} from "@/utils/app/dates";

interface VendorDetailsProps {
    params: {
        id: string;
    };
}

const defaultImage = process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!

export default async function VendorDetails({params}: VendorDetailsProps) {
    const vendor = await getVendor(parseInt(params.id, 10))
    const events = await getVendorEvents(vendor.id)
    const eventOccurrences = await getVendorEventOccurrences(vendor.id)

    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">{vendor.name}</h1>
                <div className="mb-8 w-3/5 mx-auto h-64 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src={vendor.photo_url ?? defaultImage}
                        alt={vendor.name ?? "Event Image"}
                        width={1500}
                        height={800}
                        className="w-full h-full object-cover"
                    />
                </div>
                <p className="text-center text-lg text-gray-700 mb-6 leading-relaxed">{vendor.description}</p>
                <div className="flex flex-row mb-4 mt-6 justify-around">
                    <h1 className="text-xl font-bold text-gray-800">Event Occurrences : </h1>
                </div>
                {!eventOccurrences || eventOccurrences.length === 0 ? (
                        <div className="text-center text-2xl text-red-600 mt-10">No Event Occurrences Found</div>
                    )
                    :
                    (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {eventOccurrences.map(async ({eventOccurrence, event}) => {
                            return (
                                <Link href={`/events/${eventOccurrence.event_id}/eventOccurrence/${eventOccurrence.id}`}
                                      key={eventOccurrence.id} className="block">

                                    <BasicCard>
                                        <CardContent>
                                            <Image src={event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!} alt={event.name ?? "EVENT NAME"} width={250} height={250} className="w-full h-48 object-cover" />
                                            <div className="mt-3 bg-gray-50 rounded-lg p-6 border border-gray-200">
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
                                                                        <ArrowRight className="w-4 h-4 text-gray-400"/>
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
                                            <div className="p-4">
                                                <h4 className="text-lg font-semibold mb-2">{event.name}</h4>
                                                <p className="text-gray-600">{eventOccurrence.description}</p>
                                            </div>
                                        </CardContent>
                                    </BasicCard>
                                </Link>
                            );
                        })}
                    </div>)}
                <div className="flex flex-row mb-4 mt-6 justify-around">
                    <h1 className="text-xl font-bold text-gray-800">Events : </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {events.map(async (event) => {
                        if (event.name && event.description) {
                            return (
                                <Link href={`../events/${event.id}`} key={event.id}>
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