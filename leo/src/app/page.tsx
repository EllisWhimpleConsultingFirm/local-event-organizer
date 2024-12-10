'use client';

import React, {useEffect, useState} from 'react';
import {useFilters} from '@/Contexts/filter-context';
import {Button} from '@/components/util/button';
import {FilterModal} from '@/components/filter/filter-modal';
import Link from 'next/link';
import Image from 'next/image';
import homepageImage from '@/public/icon-home-page.png';
import {getEventOccurrencesWithEvent} from "@/actions/event";
import {Tables} from "../../types/database.types";
import {Card} from "@/components/util/card";
import {Search} from "lucide-react";
import {Loader} from "@/components/util/Loading";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const {state: filters} = useFilters();
    const [eventArray, setEventArray] = useState<{
        event: Tables<'Events'>,
        eventOccurrence: Tables<'Event_Occurrences'>
    }[] | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const data = await getEventOccurrencesWithEvent(filters.filters);
                setEventArray(data);
            } catch (error) {
                console.error('Error fetching events:', error);
                setEventArray([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [filters]);

    return (
        <div className="flex flex-col min-h-screen font-solway">
            <header className="relative">
                <Image
                    src={homepageImage}
                    alt="Event background"
                    className="w-full h-[300px] object-cover"
                    width={1920}
                    height={300}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                    <h1 className="text-6xl text-white mb-2 font-solway font-medium">leo</h1>
                    <p className="text-xl text-white mb-6">local event organizer</p>
                    <div className="relative w-3/4 max-w-2xl flex flex-row align-middle">
                        <input
                            type="text"
                            placeholder="find an event or vendor"
                            className="w-full py-3 px-12 rounded-full text-lg"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    </div>
                </div>
            </header>

            <div className="flex-grow bg-white p-6 text-gray-700">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Browse Events</h2>
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">Provo, UT</h3>
                        <div className="flex space-x-2">
                            <Button>Change Location</Button>
                            <FilterModal/>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Events</h3>
                    {!eventArray?.length && !loading ? (
                        <div className="text-center text-2xl text-red-600 mt-10">
                            No events available.
                        </div>
                    ) : loading ? (
                        <Loader/>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {eventArray?.map(({event, eventOccurrence}) => (
                                <Link
                                    href={`/events/${event.id}/eventOccurrence/${eventOccurrence.id}`}
                                    key={eventOccurrence.id}
                                >
                                    <Card
                                        key={event.id}
                                        title={event?.name ?? "Event"}
                                        description={
                                            eventOccurrence.description ??
                                            event.description ??
                                            'No Description'
                                        }
                                        image={event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
