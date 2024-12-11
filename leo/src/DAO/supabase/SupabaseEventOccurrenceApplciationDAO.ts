import { EventOccurrenceApplicationDAO } from "@/DAO/interface/EventOccurrenceApplicationDAO";
import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export class SupabaseEventOccurrenceApplicationDAO implements EventOccurrenceApplicationDAO {
    private supabase = createClient();
    private TABLE = 'Event_Occurrence_Applications'

    async getEventApplications(): Promise<Tables<'Event_Occurrence_Applications'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select()

        if (error) { throw error }
        return data ?? []
    }

    async addEventApplication(eventOccurrenceApplication: TablesInsert<'Event_Occurrence_Applications'>): Promise<Tables<'Event_Occurrence_Applications'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .insert(eventOccurrenceApplication)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to add event occurrence application') }
        return data
    }

    async updateEventApplication(
        vendorId: number,
        eventOccurrenceId: number,
        eventOccurrenceApplication: TablesUpdate<'Event_Occurrence_Applications'>
    ): Promise<Tables<'Event_Occurrence_Applications'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .update(eventOccurrenceApplication)
            .eq('vendor_id', vendorId)
            .eq('event_occurrence_id', eventOccurrenceId)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to update event occurrence application') }
        return data
    }

    async deleteEventApplication(vendorId: number, eventOccurrenceId: number): Promise<void> {
        const { error } = await this.supabase
            .from(this.TABLE)
            .delete()
            .eq('vendor_id', vendorId)
            .eq('event_occurrence_id', eventOccurrenceId)

        if (error) { throw error }
    }

    async getVendorEventApplications(vendorId: number): Promise<Tables<'Event_Occurrence_Applications'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Event_Occurrences(*)')
            .eq('vendor_id', vendorId)

        if (error) { throw error }
        return data ?? []
    }

    async getEventsApplications(eventOccurrenceId: number): Promise<Tables<'Event_Occurrence_Applications'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Vendors(*)')
            .eq('event_occurrence_id', eventOccurrenceId)

        if (error) { throw error }
        return data ?? []
    }

    async getPendingEventsApplications(eventOccurrenceId: number): Promise<{application: Tables<'Event_Occurrence_Applications'>, vendor: Tables<'Vendors'>}[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Vendors!inner(*)')
            .eq('event_occurrence_id', eventOccurrenceId)
            .eq('status', 'PENDING')

        if (error) { throw error }
        return data?.map(row => ({
            application: row,
            vendor: row.Vendors
        })) ?? []
    }
    async getPendingVendorEventOccurrencesApplications(vendorId: number): Promise<{event: Tables<'Events'>, eventOccurrence: Tables<'Event_Occurrences'>, application: Tables<'Event_Occurrence_Applications'>}[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select('*, Event_Occurrences!inner(*, Events!inner(*))')
            .eq('vendor_id', vendorId)
            .eq('status', 'PENDING')

        if (error) { throw error }
        return data?.map(row => {
            const eventOccurrence = row.Event_Occurrences
            const event = row.Event_Occurrences.Events
            const application = row
            return {eventOccurrence, event, application}
        }) ?? []
    }
}