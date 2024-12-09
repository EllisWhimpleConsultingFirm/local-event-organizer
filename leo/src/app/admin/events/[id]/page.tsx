import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { UpdateEventForm } from './updateEventForm';
import { getEvent, getEventOccurrencesByEventId, getEventVendors } from "@/actions/event";
import { EventTabs } from "@/app/admin/events/[id]/eventTabs";
import { getEventPendingVendors } from "@/actions/applications";

interface EventDetailsProps {
    params: {
        id: string;
    };
}

export default async function EventDetails({ params }: EventDetailsProps) {
    const event = await getEvent(parseInt(params.id, 10));

    if (!event || "error" in event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Event Not Found</h2>
                    <Link href="/admin/events" className="text-blue-600 hover:text-blue-700 font-medium">
                        Return to Events
                    </Link>
                </div>
            </div>
        );
    }

    const eventOccurrences = await getEventOccurrencesByEventId(event.id);
    const eventVendors = await getEventVendors(event.id);
    const pendingVendors = await getEventPendingVendors(event.id);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <Link href="/admin/events">
                        <button
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300
                                     rounded-lg shadow-sm text-gray-700 hover:bg-gray-50
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                     transition-colors duration-200 ease-in-out"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Events
                        </button>
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
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

                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700">{event.description}</p>
                            </div>
                        </div>

                        <div className="md:border-l border-gray-200 md:pl-8">
                            <UpdateEventForm event={event} />
                        </div>
                    </div>
                </div>

                <div className="px-4 mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
                    <EventTabs
                        event={event}
                        eventVendors={eventVendors}
                        pendingVendors={pendingVendors}
                        eventOccurrences={eventOccurrences}
                    />
                </div>
            </div>
        </div>
    );
}