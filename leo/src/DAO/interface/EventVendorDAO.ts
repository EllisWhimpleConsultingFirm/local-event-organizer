import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export interface EventVendorDAO {
    getEventVendors(): Promise<Tables<'Event_Vendors'>[]>;
    addEventVendor(eventVendor: TablesInsert<'Event_Vendors'>): Promise<Tables<'Event_Vendors'>>;
    updateEventVendor(vendorId: number, eventOccurrenceId: number, eventVendor: TablesUpdate<'Event_Vendors'>): Promise<Tables<'Event_Vendors'>>
    deleteEventVendor(vendorId: number, eventOccurrenceId: number): Promise<void>
    getVendorsByEventId(eventId: number): Promise<Tables<'Event_Vendors'>[]>
    getEventsByVendorId(vendorId: number): Promise<Tables<'Event_Vendors'>[]>
}