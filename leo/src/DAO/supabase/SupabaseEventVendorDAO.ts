import { EventVendorDAO } from "@/DAO/interface/EventVendorDAO";
import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export class SupabaseEventVendorDAO implements EventVendorDAO {
    private supabase = createClient();
    private TABLE = 'EventVendors'

    async getEventVendors(): Promise<Tables<'EventVendors'>[]> {
        const { data, error } = await this.supabase.from(this.TABLE).select()
        if (error) { throw error }
        return data ?? []
    }

    async getVendorsByEventId(eventId: number): Promise<Tables<'EventVendors'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Vendors(*)')
            .eq('event_id', eventId)

        if (error) { throw error }
        return data ?? []
    }

    async getEventsByVendorId(vendorId: number): Promise<Tables<'EventVendors'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Events(*)')
            .eq('vendor_id', vendorId)

        if (error) { throw error }
        return data ?? []
    }

    async addEventVendor(eventVendor: TablesInsert<'EventVendors'>): Promise<Tables<'EventVendors'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .insert(eventVendor)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to add event vendor') }
        return data
    }

    async updateEventVendor(id: number, eventVendor: TablesUpdate<'EventVendors'>): Promise<Tables<'EventVendors'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .update(eventVendor)
            .eq('id', id)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to update event vendor') }
        return data
    }

    async deleteEventVendor(id: number): Promise<void> {
        const { error } = await this.supabase
            .from(this.TABLE)
            .delete()
            .eq('id', id)

        if (error) { throw error }
    }
}