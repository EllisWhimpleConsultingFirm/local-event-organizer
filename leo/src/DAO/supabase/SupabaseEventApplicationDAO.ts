import { EventApplicationDAO } from "@/DAO/interface/EventApplicationDAO";
import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export class SupabaseEventApplicationDAO implements EventApplicationDAO {
    private supabase = createClient();
    private TABLE = 'Event_Applications'

    async getEventApplications(): Promise<Tables<'Event_Applications'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select()

        if (error) { throw error }
        return data ?? []
    }

    async addEventApplication(eventApplication: TablesInsert<'Event_Applications'>): Promise<Tables<'Event_Applications'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .insert(eventApplication)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to add event application') }
        return data
    }

    async updateEventApplication(
        vendorId: number,
        eventId: number,
        eventApplication: TablesUpdate<'Event_Applications'>
    ): Promise<Tables<'Event_Applications'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .update(eventApplication)
            .eq('vendor_id', vendorId)
            .eq('event_id', eventId)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to update event application') }
        return data
    }

    async deleteEventApplication(vendorId: number, eventId: number): Promise<void> {
        const { error } = await this.supabase
            .from(this.TABLE)
            .delete()
            .eq('vendor_id', vendorId)
            .eq('event_id', eventId)

        if (error) { throw error }
    }

    async getVendorEventApplications(vendorId: number): Promise<Tables<'Event_Applications'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Events(*)')
            .eq('vendor_id', vendorId)

        if (error) { throw error }
        return data ?? []
    }

    async getEventsApplications(eventId: number): Promise<Tables<'Event_Applications'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Vendors(*)')
            .eq('event_id', eventId)

        if (error) { throw error }
        return data ?? []
    }

    async getPendingVendorEventApplications(vendorId: number): Promise<{event: Tables<'Events'>, application: Tables<'Event_Applications'>}[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Events!inner(*)')
            .eq('vendor_id', vendorId)
            .eq('status', 'PENDING')

        if (error) { throw error }
        return data?.map(row => ({
            event: row.Events,
            application: row
        })) ?? []
    }

    async getPendingEventsApplications(eventId: number): Promise<{application: Tables<'Event_Applications'>, vendor: Tables<'Vendors'>}[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Vendors!inner(*)')
            .eq('event_id', eventId)
            .eq('status', 'PENDING')

        if (error) { throw error }
        return data?.map(row => ({
            application: row,
            vendor: row.Vendors
        })) ?? []
    }
}