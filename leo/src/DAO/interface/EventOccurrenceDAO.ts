import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";
import {Filters} from "@/utils/filter-models";

export interface EventOccurrenceDAO {
    getEventOccurrences(filters?: Filters): Promise<Tables<'Event_Occurrences'>[]>;
    addEventOccurrence(eventVendor: TablesInsert<'Event_Occurrences'>): Promise<Tables<'Event_Occurrences'>>;
    updateEventOccurrence(id: number, eventVendor: TablesUpdate<'Event_Occurrences'>): Promise<Tables<'Event_Occurrences'>>;
    deleteEventOccurrence(id: number): Promise<void>;
    getEventOccurrencesByEventId(eventId: number, filters?: Filters): Promise<Tables<'Event_Occurrences'>[]>
    getEventOccurrence(id: number): Promise<Tables<'Event_Occurrences'> | null>;
    getEventOccurrencesWithEvents(filters?: Filters): Promise<{eventOccurrence: Tables<'Event_Occurrences'>, event: Tables<'Events'>}[]>
}