import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export interface EventOccurrenceVendorDAO {
    getEventOccurrenceVendors(): Promise<Tables<'Event_Occurrence_Vendors'>[]>;
    addEventOccurrenceVendor(eventOccurrenceVendor: TablesInsert<'Event_Occurrence_Vendors'>): Promise<Tables<'Event_Occurrence_Vendors'>>;
    updateEventOccurrenceVendor(vendorId: number, eventOccurrenceId: number, eventOccurrenceVendor: TablesUpdate<'Event_Occurrence_Vendors'>): Promise<Tables<'Event_Occurrence_Vendors'>>
    deleteEventOccurrenceVendor(vendorId: number, eventOccurrenceId: number): Promise<void>
    getVendorsByEventOccurrenceId(eventOccurrenceId: number): Promise<Tables<'Vendors'>[]>
    getEventOccurrencesByVendorId(vendorId: number): Promise<({ eventOccurrence: Tables<'Event_Occurrences'>, event: Tables<'Events'> })[]>}