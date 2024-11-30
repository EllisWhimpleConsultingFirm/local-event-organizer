import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export interface EventOccurrenceApplicationDAO {
    getEventApplications(): Promise<Tables<'Event_Occurrence_Applications'>[]>;
    addEventApplication(eventVendor: TablesInsert<'Event_Occurrence_Applications'>): Promise<Tables<'Event_Occurrence_Applications'>>;
    updateEventApplication(vendorId: number, eventId: number, eventVendor: TablesUpdate<'Event_Occurrence_Applications'>): Promise<Tables<'Event_Occurrence_Applications'>>
    deleteEventApplication(vendorId: number, eventId: number): Promise<void>
    getVendorEventApplications(vendorId: number): Promise<Tables<'Event_Occurrence_Applications'>[]>
    getEventsApplications(eventId: number): Promise<Tables<'Event_Occurrence_Applications'>[]>
    getPendingEventsApplications(eventOccurrenceId: number): Promise<{application: Tables<'Event_Occurrence_Applications'>, vendor: Tables<'Vendors'>}[]>
    getPendingVendorEventOccurrencesApplications(vendorId: number): Promise<{event: Tables<'Events'>, eventOccurrence: Tables<'Event_Occurrences'>, application: Tables<'Event_Occurrence_Applications'>}[]>
}