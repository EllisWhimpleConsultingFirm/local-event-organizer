import { EventVendorDAO } from "@/DAO/interface/EventVendorDAO";
import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export class SupabaseEventVendorDAO implements EventVendorDAO {
    private supabase = createClient();
    private TABLE = 'Event_Vendors'

    async getEventVendors(): Promise<Tables<'Event_Vendors'>[]> {
        const { data, error } = await this.supabase.from(this.TABLE).select()
        if (error) { throw error }
        return data ?? []
    }

    async getVendorsByEventId(eventOccurrenceId: number): Promise<Tables<'Event_Vendors'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Vendors(*)')
            .eq('event_occurence_id', eventOccurrenceId)

        if (error) { throw error }
        return data ?? []
    }

    async getEventsByVendorId(vendorId: number): Promise<Tables<'Event_Vendors'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Events(*)')
            .eq('vendor_id', vendorId)

        if (error) { throw error }
        return data ?? []
    }

    async addEventVendor(eventVendor: TablesInsert<'Event_Vendors'>): Promise<Tables<'Event_Vendors'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .insert(eventVendor)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to add event vendor') }
        return data
    }

    async updateEventVendor(
        vendorId: number,
        eventOccurrenceId: number,
        eventVendor: TablesUpdate<'Event_Vendors'>
    ): Promise<Tables<'Event_Vendors'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .update(eventVendor)
            .eq('vendor_id', vendorId)
            .eq('event_occurence_id', eventOccurrenceId)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to update event vendor') }
        return data
    }

    async deleteEventVendor(vendorId: number, eventOccurrenceId: number): Promise<void> {
        const { error } = await this.supabase
            .from(this.TABLE)
            .delete()
            .eq('vendor_id', vendorId)
            .eq('event_occurence_id', eventOccurrenceId)

        if (error) { throw error }
    }
}