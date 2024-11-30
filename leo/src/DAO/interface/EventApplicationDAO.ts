import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export interface EventApplicationDAO {
    getEventApplications(): Promise<Tables<'Event_Applications'>[]>;
    addEventApplication(eventVendor: TablesInsert<'Event_Applications'>): Promise<Tables<'Event_Applications'>>;
    updateEventApplication(vendorId: number, eventId: number, eventVendor: TablesUpdate<'Event_Applications'>): Promise<Tables<'Event_Applications'>>
    deleteEventApplication(vendorId: number, eventId: number): Promise<void>
    getVendorEventApplications(vendorId: number): Promise<Tables<'Event_Applications'>[]>
    getEventsApplications(eventId: number): Promise<Tables<'Event_Applications'>[]>
    getPendingVendorEventApplications(vendorId: number): Promise<{event: Tables<'Events'>, application: Tables<'Event_Applications'>}[]>
    getPendingEventsApplications(eventId: number): Promise<{application: Tables<'Event_Applications'>, vendor: Tables<'Vendors'>}[]>
}