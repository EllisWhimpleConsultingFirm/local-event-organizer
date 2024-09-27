import {Tables} from "../../../types/database.types";

export interface EventsDAO {
    getEventPicture(eventId: number) : { publicUrl: string }
    getEvents() : Promise<Tables<'Events'>[]>
}