import { EventVendorDAO } from "@/DAO/interface/EventVendorDAO";
import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export class SupabaseEventVendorDAO implements EventVendorDAO{
    private supabase = createClient();
    private TABLE = 'Event_Vendors'

    async getEventVendors(): Promise<Tables<'Event_Vendors'>[]> {
        const { data, error } = await this.supabase.from(this.TABLE).select()
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
        eventId: number,
        eventVendor: TablesUpdate<'Event_Vendors'>
    ): Promise<Tables<'Event_Vendors'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .update(eventVendor)
            .eq('vendor_id', vendorId)
            .eq('event_id', eventId)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to update event vendor') }
        return data
    }

    async deleteEventVendor(vendorId: number, eventId: number): Promise<void> {
        const { error } = await this.supabase
            .from(this.TABLE)
            .delete()
            .eq('vendor_id', vendorId)
            .eq('event_id', eventId)

        if (error) { throw error }
    }

    async getEventsByVendorId(vendorId: number): Promise<Tables<"Events">[]> {
        const { data, error } = await this.supabase
                .from(this.TABLE)
                .select('Events!inner(*)')
                .eq('vendor_id', vendorId)

            if (error) { throw error }
            return data?.map(row => row.Events as unknown as Tables<'Events'>) ?? []
    }

    async getVendorsByEventId(eventId: number): Promise<Tables<'Vendors'>[]> {
        const { data, error } = await this.supabase
                .from(this.TABLE)
                .select('Vendors!inner(*)')
                .eq('event_id', eventId)

        if (error) { throw error }
        return data?.map(row => row.Vendors as unknown as Tables<'Vendors'>) ?? []
    }
}