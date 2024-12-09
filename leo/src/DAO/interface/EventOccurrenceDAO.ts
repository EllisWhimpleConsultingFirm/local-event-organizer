import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export interface EventOccurrenceDAO {
    getEventOccurrences(): Promise<Tables<'Event_Occurrences'>[]>;
    getEventOccurrencesWithEvents(): Promise<{eventOccurrence: Tables<'Event_Occurrences'>, event: Tables<'Events'>}[]>
    addEventOccurrence(eventVendor: TablesInsert<'Event_Occurrences'>): Promise<Tables<'Event_Occurrences'>>;
    updateEventOccurrence(id: number, eventVendor: TablesUpdate<'Event_Occurrences'>): Promise<Tables<'Event_Occurrences'>>;
    deleteEventOccurrence(id: number): Promise<void>;
    getEventOccurrencesByEventId(eventId: number): Promise<Tables<'Event_Occurrences'>[]>
    getEventOccurrence(id: number): Promise<Tables<'Event_Occurrences'> | null>;
}