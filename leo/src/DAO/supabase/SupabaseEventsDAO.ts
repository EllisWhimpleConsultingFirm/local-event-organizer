import { EventsDAO } from "@/DAO/interface/EventsDAO";
import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export class SupabaseEventsDAO implements EventsDAO {
    private supabase = createClient();
    private TABLE = 'Events'

    async getEvent(id: number): Promise<Tables<'Events'> | null> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select()
            .eq('id', id)
            .single()

        if (error) { throw error }
        return data
    }

    async getEvents(): Promise<Tables<'Events'>[]> {
        const { data, error } = await this.supabase.from(this.TABLE).select()
        if (error) { throw error }
        return data ?? []
    }

    async addEvent(event: TablesInsert<'Events'>): Promise<Tables<'Events'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .insert(event)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to add event') }
        return data
    }

    async updateEvent(id: number, event: TablesUpdate<'Events'>): Promise<Tables<'Events'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .update(event)
            .eq('id', id)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to update event') }
        return data
    }

    async deleteEvent(id: number): Promise<void> {
        const { error } = await this.supabase
            .from(this.TABLE)
            .delete()
            .eq('id', id)

        if (error) { throw error }
    }
}