import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";
import {EventOccurrenceVendorDAO} from "@/DAO/interface/EventOccurrenceVendorDAO";

export class SupabaseEventOccurrenceVendorDAO implements EventOccurrenceVendorDAO {
    private supabase = createClient();
    private TABLE = 'Event_Occurrence_Vendors'

    async getEventOccurrenceVendors(): Promise<Tables<'Event_Occurrence_Vendors'>[]> {
        const { data, error } = await this.supabase.from(this.TABLE).select()
        if (error) { throw error }
        return data ?? []
    }

    async getVendorsByEventOccurrenceId(eventOccurrenceId: number): Promise<Tables<'Event_Occurrence_Vendors'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Vendors(*)')
            .eq('event_occurrence_id', eventOccurrenceId)

        if (error) { throw error }
        return data ?? []
    }

    async getEventOccurrencesByVendorId(vendorId: number): Promise<Tables<'Event_Occurrence_Vendors'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Event_Occurrences(*)')
            .eq('vendor_id', vendorId)

        if (error) { throw error }
        return data ?? []
    }

    async addEventOccurrenceVendor(eventOccurrenceVendor: TablesInsert<'Event_Occurrence_Vendors'>): Promise<Tables<'Event_Occurrence_Vendors'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .insert(eventOccurrenceVendor)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to add event vendor') }
        return data
    }

    async updateEventOccurrenceVendor(
        vendorId: number,
        eventOccurrenceId: number,
        eventOccurrenceVendor: TablesUpdate<'Event_Occurrence_Vendors'>
    ): Promise<Tables<'Event_Occurrence_Vendors'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .update(eventOccurrenceVendor)
            .eq('vendor_id', vendorId)
            .eq('event_occurrence_id', eventOccurrenceId)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to update event vendor') }
        return data
    }

    async deleteEventOccurrenceVendor(vendorId: number, eventOccurrenceId: number): Promise<void> {
        const { error } = await this.supabase
            .from(this.TABLE)
            .delete()
            .eq('vendor_id', vendorId)
            .eq('event_occurrence_id', eventOccurrenceId)

        if (error) { throw error }
    }
}