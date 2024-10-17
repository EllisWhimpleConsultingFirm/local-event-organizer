import { EventsDAO } from "@/DAO/interface/EventsDAO";
import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export class SupabaseEventsDAO implements EventsDAO {
    private supabase = createClient();
    private TABLE = 'Events'
    private BUCKET = 'events-pictures'

    getEventPicture(eventId: number): { publicUrl: string; } {
        const result = this.supabase.storage
            .from(this.BUCKET)
            .getPublicUrl(`${eventId}.png`);

        if (!result?.data?.publicUrl) {
            throw new Error('Failed to get public URL');
        }

        return { publicUrl: result.data.publicUrl };
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

    async addEventPicture(eventId: number, file: File): Promise<{ publicUrl: string }> {
        const result = await this.supabase.storage
            .from(this.BUCKET)
            .upload(`${eventId}.png`, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (result.error) { throw result.error }

        return this.getEventPicture(eventId)
    }

    async updateEventPicture(eventId: number, file: File): Promise<{ publicUrl: string }> {
        const fileName = `${eventId}.png`;

        try {
            const result = await this.supabase.storage
                .from(this.BUCKET)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (result.error) {
                throw result.error;
            }

            return this.getEventPicture(eventId);
        } catch (error) {
            console.error('Error in updateEventPicture:', error);
            throw error;
        }
    }

    async deleteEventPicture(eventId: number): Promise<void> {
        const result = await this.supabase.storage
            .from(this.BUCKET)
            .remove([`${eventId}.png`])

        if (result.error) { throw result.error }
    }
}