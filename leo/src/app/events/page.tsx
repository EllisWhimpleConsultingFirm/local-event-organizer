import {DAOFactory} from "@/DAO/interface/Factory";
import {SupabaseDAOFactory} from "@/DAO/supabase/SupabaseDAOFactory";
import {Card} from "@/components/util/card";
import React from "react";

export default async function Notes() {
    const daoFactory: DAOFactory = new SupabaseDAOFactory()
    const eventsDao = daoFactory.getEventsDAO()
    const events = await eventsDao.getEvents()

    return (
        <div className="flex flex-col p-8 bg-white text-gray-700">
            <h3 className="text-xl font-semibold mb-4">Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((event) => {
                    if (event.name && event.description) {
                        return (
                            <Card
                                key={event.id}
                                title={event.name}
                                description={event.description}
                                image={eventsDao.getEventPicture(event.id).publicUrl}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    )
}