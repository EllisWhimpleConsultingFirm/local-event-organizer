import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export interface EventVendorDAO {
    getEventVendors(): Promise<Tables<'Event_Vendors'>[]>;
    addEventVendor(eventVendor: TablesInsert<'Event_Vendors'>): Promise<Tables<'Event_Vendors'>>;
    updateEventVendor(id: number, eventVendor: TablesUpdate<'Event_Vendors'>): Promise<Tables<'Event_Vendors'>>;
    deleteEventVendor(id: number): Promise<void>;
    getVendorsByEventId(eventId: number): Promise<Tables<'EventVendors'>[]>
    getEventsByVendorId(vendorId: number): Promise<Tables<'EventVendors'>[]>
}