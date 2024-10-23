import { createClient } from "@/utils/supabase/server";
import {BucketDAO} from "@/DAO/interface/BucketDAO";

export class SupabaseBucketDAO implements BucketDAO {
    private supabase = createClient();
    private BUCKET = 'events-pictures'

    getFile(fileName: string): { publicUrl: string; } {
        const result = this.supabase.storage
            .from(this.BUCKET)
            .getPublicUrl(`${fileName}`);

        if (!result?.data?.publicUrl) {
            throw new Error('Failed to get public URL');
        }

        return {publicUrl: result.data.publicUrl};
    }

    async addFile(file: File): Promise<{ publicUrl: string }> {
        const uuid = crypto.randomUUID();
        const result = await this.supabase.storage
            .from(this.BUCKET)
            .upload(`${uuid}.png`, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (result.error) { throw result.error }

        return this.getFile(`${uuid}.png`)
    }

    async updateFile(fileName: string, file: File): Promise<{ publicUrl: string }> {
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

            return this.getFile(fileName);
        } catch (error) {
            throw error;
        }
    }

    async deleteFile(fileId: string): Promise<void> {
        const result = await this.supabase.storage
            .from(this.BUCKET)
            .remove([`${fileId}`])

        if (result.error) { throw result.error }
    }
}