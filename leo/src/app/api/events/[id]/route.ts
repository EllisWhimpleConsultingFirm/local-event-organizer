import {DAOFactory} from "@/DAO/interface/Factory";
import {SupabaseDAOFactory} from "@/DAO/supabase/SupabaseDAOFactory";
import {EventService} from "@/services/events";
import {NextResponse} from "next/server";

type Params = {
    id: string
}

export async function DELETE(request: Request, context: { params: Params }) {
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const eventService = new EventService(eventsDao);

    const id = Number(context.params.id);

    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    try {
        await eventService.deleteEvent(id);
        return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 400 });
    }
}
