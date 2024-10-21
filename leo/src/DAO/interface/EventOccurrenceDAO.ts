import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export interface EventOccurrenceDAO {
    getEventOccurrences(): Promise<Tables<'Event_Occurences'>[]>;
    addEventOccurrence(eventVendor: TablesInsert<'Event_Occurences'>): Promise<Tables<'Event_Occurences'>>;
    updateEventOccurrence(id: number, eventVendor: TablesUpdate<'Event_Occurences'>): Promise<Tables<'Event_Occurences'>>;
    deleteEventOccurrence(id: number): Promise<void>;
    getEventOccurrencesByEventId(eventId: number): Promise<Tables<'EventOccurrences'>[]>
}