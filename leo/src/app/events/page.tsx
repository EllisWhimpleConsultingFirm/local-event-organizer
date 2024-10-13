import React from 'react';
import { EventList } from './eventList';
import { AddEventButtonModal } from './AddEventButtonModal';
import { DAOFactory } from "@/DAO/interface/Factory";
import { SupabaseDAOFactory } from "@/DAO/supabase/SupabaseDAOFactory";
import { EventService } from "@/services/events";

export default async function EventsManagement() {
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const eventService = new EventService(eventsDao);

    const events = await eventService.getAllEvents();

    return (
        <div className="container mx-auto p-10">
            <div className="flex justify-between items-center mb-4 p-20">
                <h1 className="text-5xl font-bold">Event Management</h1>
                <AddEventButtonModal />
            </div>

            <EventList initialEvents={events} />
        </div>
    );
}