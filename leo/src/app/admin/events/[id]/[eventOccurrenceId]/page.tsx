import Link from "next/link";
import React from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, CalendarDays, ArrowRight } from 'lucide-react';
import {
    getEvent,
    getEventOccurrence,
    getEventOccurrenceVendors,
} from "@/actions/event";
import { getEventOccurrencePendingVendors } from "@/actions/applications";
import { UpdateEventOccurrenceForm } from "@/app/admin/events/[id]/[eventOccurrenceId]/updateEventOccurrenceForm";
import { EventOccurrenceTabs } from "@/app/admin/events/[id]/[eventOccurrenceId]/eventOccurrenceTabs";
import {formatDate, formatTime, getDurationString, isSameDay} from "@/utils/app/dates";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

interface EventOccurrenceDetailsProps {
    params: {
        id: string;
        eventOccurrenceId: string
    };
}

export default async function EventOccurrenceDetails({ params }: EventOccurrenceDetailsProps) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }
    const eventId = parseInt(params.id, 10)
    const eventOccurrenceId = parseInt(params.eventOccurrenceId, 10)
    const event = await getEvent(eventId);
    const eventOccurrence = await getEventOccurrence(eventOccurrenceId)
    const eventVendors = await getEventOccurrenceVendors(eventOccurrenceId)
    const pendingVendors = await getEventOccurrencePendingVendors(eventOccurrenceId)

    if (!event || !eventVendors) {
        redirect("/error")
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <Link href={`/admin/events/${eventId}`}>
                        <button
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300
                                     rounded-lg shadow-sm text-gray-700 hover:bg-gray-50
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                     transition-colors duration-200 ease-in-out"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Event Page
                        </button>
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h1 className="text-3xl font-bold text-gray-900">{event.name ?? "Event Name"}</h1>
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                    <Image
                                        src={event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                                        alt={event.name ?? "Name Not Found"}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="prose prose-gray max-w-none">
                                    <h2 className="text-xl font-semibold text-gray-800">Description</h2>
                                    <p className="text-gray-700">{eventOccurrence.description}</p>
                                </div>

                                <div className="mt-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CalendarDays className="w-6 h-6 text-blue-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">Event Schedule</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 flex-shrink-0 bg-blue-100 rounded-lg flex flex-col items-center justify-center text-blue-700">
                                                <Calendar className="w-6 h-6 mb-1" />
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
                                                            <ArrowRight className="w-4 h-4 text-gray-400" />
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
                                            <div className="w-16 h-16 flex-shrink-0 bg-green-100 rounded-lg flex flex-col items-center justify-center text-green-700">
                                                <Clock className="w-6 h-6 mb-1" />
                                                <span className="text-xs font-medium">Time</span>
                                            </div>
                                            <div className="flex-1 flex items-center gap-3">
                                                <div>
                                                    <p className="text-gray-900 font-medium">
                                                        {formatTime(eventOccurrence.start_time)}
                                                    </p>
                                                    <p className="text-gray-500 text-sm">Start</p>
                                                </div>
                                                <div className="text-gray-400 flex-1 border-t border-dashed border-gray-300 relative top-3">
                                                    <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2">to</span>
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
                            </div>
                        </div>

                        <div className="md:border-l border-gray-200 md:pl-8">
                            <UpdateEventOccurrenceForm eventOccurrence={eventOccurrence} />
                        </div>
                    </div>
                </div>

                <div className="px-4 mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
                    <EventOccurrenceTabs
                        eventVendors={eventVendors}
                        pendingVendors={pendingVendors}
                        event={event}
                    />
                </div>
            </div>
        </div>
    );
}