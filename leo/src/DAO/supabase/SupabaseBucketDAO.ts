import { createClient } from "@/utils/supabase/server";
import {BucketDAO} from "@/DAO/interface/BucketDAO";

export class SupabaseBucketDAO implements BucketDAO {
    private supabase = createClient();
    private BUCKET = 'events-pictures'

    getPicture(eventId: number): { publicUrl: string; } {
        const result = this.supabase.storage
            .from(this.BUCKET)
            .getPublicUrl(`${eventId}.png`);

        if (!result?.data?.publicUrl) {
            throw new Error('Failed to get public URL');
        }

        return {publicUrl: result.data.publicUrl};
    }

    async addPicture(eventId: number, file: File): Promise<{ publicUrl: string }> {
        const result = await this.supabase.storage
            .from(this.BUCKET)
            .upload(`${eventId}.png`, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (result.error) { throw result.error }

        return this.getPicture(eventId)
    }

    async updatePicture(eventId: number, file: File): Promise<{ publicUrl: string }> {
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

            return this.getPicture(eventId);
        } catch (error) {
            console.error('Error in updateEventPicture:', error);
            throw error;
        }
    }

    async deletePicture(eventId: number): Promise<void> {
        const result = await this.supabase.storage
            .from(this.BUCKET)
            .remove([`${eventId}.png`])

        if (result.error) { throw result.error }
    }
}