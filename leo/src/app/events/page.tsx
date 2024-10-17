import {DAOFactory} from "@/DAO/interface/Factory";
import {SupabaseDAOFactory} from "@/DAO/supabase/SupabaseDAOFactory";
import {Card} from "@/components/util/card";
import React from "react";
import Link from "next/link";

export default async function Events() {
    const daoFactory: DAOFactory = new SupabaseDAOFactory()
    const eventsDao = daoFactory.getEventsDAO()
    const events = await eventsDao.getEvents()

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-5xl font-bold">Events</h1>
            <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {events.map(async (event) => {
                        if (event.name && event.description) {
                            const img = await eventsDao.getEventPicture(event.id)
                            return (
                                <Link href={`events/${event.id}`}>
                                    <Card
                                        key={event.id}
                                        title={event.name}
                                        description={event.description}
                                        image={img.publicUrl}
                                    />
                                </Link>
                            );
                        };
                    })}
                </div>
            </div>
        </div>
    )
}