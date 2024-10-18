import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export interface EventsDAO {
    getEvents(): Promise<Tables<'Events'>[]>;
    addEvent(event: TablesInsert<'Events'>): Promise<Tables<'Events'>>;
    updateEvent(id: number, event: TablesUpdate<'Events'>): Promise<Tables<'Events'>>;
    deleteEvent(id: number): Promise<void>;
}