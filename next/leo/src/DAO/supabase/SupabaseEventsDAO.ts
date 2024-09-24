import {EventsDAO} from "@/DAO/interface/EventsDAO";
import {createClient} from "@/utils/supabase/server";
import {Tables} from "../../../database.types";

export class SupabaseEventsDAO implements EventsDAO {
    private supabase = createClient();
    private TABLE = 'Events'

    getEventPicture(eventId: number): { publicUrl: string; } {
        const { data } = this.supabase.storage
            .from('events-pictures')
            .getPublicUrl(`${eventId}.png`);

        return data;
    }

    async getEvents (): Promise<Tables<'Events'>[]> {
        const { data, error } = await this.supabase.from(this.TABLE).select()
        if (error) {throw error}
        return data
    }
}
