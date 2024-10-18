import { NextResponse } from 'next/server';
import { DAOFactory } from "@/DAO/interface/Factory";
import { SupabaseDAOFactory } from "@/DAO/supabase/SupabaseDAOFactory";
import { EventService } from "@/services/events";

export async function GET() {
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventService = new EventService(eventsDao, bucketDao);
    const events = await eventService.getAllEvents();

    return NextResponse.json(events);
}