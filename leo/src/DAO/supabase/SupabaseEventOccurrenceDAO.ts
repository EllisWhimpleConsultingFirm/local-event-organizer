import { EventOccurrenceDAO } from "@/DAO/interface/EventOccurrenceDAO";
import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export class SupabaseEventOccurrenceDAO implements EventOccurrenceDAO {
    private supabase = createClient();
    private TABLE = 'EventOccurrences'

    async getEventOccurrences(): Promise<Tables<'EventOccurrences'>[]> {
        const { data, error } = await this.supabase.from(this.TABLE).select()
        if (error) { throw error }
        return data ?? []
    }

    async getEventOccurrencesByEventId(eventId: number): Promise<Tables<'EventOccurrences'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select()
            .eq('event_id', eventId);

        if (error) { throw error }
        return data ?? []
    }

    async addEventOccurrence(eventOccurrence: TablesInsert<'EventOccurrences'>): Promise<Tables<'EventOccurrences'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .insert(eventOccurrence)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to add event occurrence') }
        return data
    }

    async updateEventOccurrence(id: number, eventOccurrence: TablesUpdate<'EventOccurrences'>): Promise<Tables<'EventOccurrences'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .update(eventOccurrence)
            .eq('id', id)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to update event occurrence') }
        return data
    }

    async deleteEventOccurrence(id: number): Promise<void> {
        const { error } = await this.supabase
            .from(this.TABLE)
            .delete()
            .eq('id', id)

        if (error) { throw error }
    }
}