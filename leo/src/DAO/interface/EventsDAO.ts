import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export interface EventsDAO {
    getEventPicture(eventId: number): { publicUrl: string };
    getEvents(): Promise<Tables<'Events'>[]>;
    addEvent(event: TablesInsert<'Events'>): Promise<Tables<'Events'>>;
    updateEvent(id: number, event: TablesUpdate<'Events'>): Promise<Tables<'Events'>>;
    deleteEvent(id: number): Promise<void>;
    addEventPicture(eventId: number, file: File): Promise<{ publicUrl: string }>;
    updateEventPicture(eventId: number, file: File): Promise<{ publicUrl: string }>;
    deleteEventPicture(eventId: number): Promise<void>;
}