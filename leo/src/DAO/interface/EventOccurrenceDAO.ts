import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";
import {Result} from "../../../types/Result";

export interface EventOccurrenceDAO {
    getEventOccurrences(): Promise<Tables<'Event_Occurrences'>[]>;
    addEventOccurrence(eventVendor: TablesInsert<'Event_Occurrences'>): Promise<Tables<'Event_Occurrences'>>;
    updateEventOccurrence(id: number, eventVendor: TablesUpdate<'Event_Occurrences'>): Promise<Tables<'Event_Occurrences'>>;
    deleteEventOccurrence(id: number): Promise<void>;
    getEventOccurrencesByEventId(eventId: number): Promise<Result<Tables<'Event_Occurrences'>[]>>
    getEventOccurrence(id: number): Promise<Tables<'Event_Occurrences'> | null>;
}