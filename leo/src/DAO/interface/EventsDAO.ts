import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export interface EventsDAO {
    getEvents(): Promise<Tables<'Events'>[]>;
    getEvent(id: number): Promise<Tables<'Events'> | null>;
    addEvent(event: TablesInsert<'Events'>): Promise<Tables<'Events'>>;
    updateEvent(id: number, event: TablesUpdate<'Events'>): Promise<Tables<'Events'>>;
    deleteEvent(id: number): Promise<void>;
}