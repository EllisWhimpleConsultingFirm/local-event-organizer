import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

export interface VendorDAO {
    getVendors(): Promise<Tables<'Vendors'>[]>;
    getVendorById(id: number): Promise<Tables<'Vendors'> | null>
    addVendor(vendor: TablesInsert<'Vendors'>): Promise<Tables<'Vendors'>>;
    updateVendor(id: number, vendor: TablesUpdate<'Vendors'>): Promise<Tables<'Vendors'>>;
    deleteVendor(id: number): Promise<void>;
}