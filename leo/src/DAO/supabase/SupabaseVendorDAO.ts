import { VendorDAO } from "@/DAO/interface/VendorDAO";
import { createClient } from "@/utils/supabase/server";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export class SupabaseVendorDAO implements VendorDAO {
    private supabase = createClient();
    private TABLE = 'Vendors'

    async getVendors(): Promise<Tables<'Vendors'>[]> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select()

        if (error) { throw error }
        return data ?? []
    }

    async getVendorById(id: number): Promise<Tables<'Vendors'> | null> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select()
            .eq('id', id)
            .single()

        if (error) { throw error }
        return data
    }

    async addVendor(vendor: TablesInsert<'Vendors'>): Promise<Tables<'Vendors'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .insert(vendor)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to add vendor') }
        return data
    }

    async updateVendor(id: number, vendor: TablesUpdate<'Vendors'>): Promise<Tables<'Vendors'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .update(vendor)
            .eq('id', id)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to update vendor') }
        return data
    }

    async deleteVendor(id: number): Promise<void> {
        const { error } = await this.supabase
            .from(this.TABLE)
            .delete()
            .eq('id', id)

        if (error) { throw error }
    }
}