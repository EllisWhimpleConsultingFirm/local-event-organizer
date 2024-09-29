import React from 'react';
import { DAOFactory } from "@/DAO/interface/Factory";
import { SupabaseDAOFactory } from "@/DAO/supabase/SupabaseDAOFactory";
import { EventService } from "@/services/events";
import Image from 'next/image';
import Link from 'next/link';
import { UpdateEventForm } from './UpdateEventForm';

interface EventDetailsProps {
    params: {
        id: string;
    };
}

export default async function EventDetails({ params }: EventDetailsProps) {
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const eventService = new EventService(eventsDao);

    const event = await eventService.getEvent(parseInt(params.id, 10));

    if (!event) {
        return <div>Event not found</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Link href="/events" className="text-blue-500 hover:underline mb-4 block">
                &larr; Back to Events
            </Link>
            <div className="flex flex-row space-x-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
                    <div className="mb-4">
                        <Image
                            src={event.pictureUrl}
                            alt={event.name}
                            width={500}
                            height={300}
                            className="rounded-lg"
                        />
                    </div>
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    <p className="text-sm text-gray-500">Admin ID: {event.admin_id}</p>
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">Update Event</h2>
                    <UpdateEventForm event={event} />
                </div>
            </div>
        </div>
    );
}