import { VendorDAO } from "@/DAO/interface/VendorDAO";
import { Tables, TablesInsert, TablesUpdate } from "../../types/database.types";
import { BucketDAO } from "@/DAO/interface/BucketDAO";
import { EventVendorDAO } from "@/DAO/interface/EventVendorDAO";

export class VendorService {
    constructor(
        private vendorDAO: VendorDAO,
        private bucketDAO: BucketDAO,
        private eventVendorDAO: EventVendorDAO
    ) {}

    async getVendor(id: number): Promise<Tables<'Vendors'>> {
        const vendor = await this.vendorDAO.getVendorById(id);
        if (!vendor) {
            throw new Error(`Vendor with id ${id} not found`);
        }
        return vendor;
    }

    async getAllVendors(): Promise<Tables<'Vendors'>[]> {
        return await this.vendorDAO.getVendors();
    }

    async addVendor(vendorData: TablesInsert<'Vendors'>, picture?: File): Promise<Tables<'Vendors'>> {
        let pictureUrl: string | undefined = undefined;

        if (picture) {
            const { publicUrl } = await this.bucketDAO.addFile(picture);
            pictureUrl = publicUrl;
        }

        return await this.vendorDAO.addVendor({
            ...vendorData,
            photo_url: pictureUrl,
            created_at: new Date().toISOString()
        });
    }

    async updateVendor(id: number, vendorData: TablesUpdate<'Vendors'>, picture?: File): Promise<Tables<'Vendors'>> {
        let pictureUrl: string | undefined = undefined;
        const oldVendor = await this.vendorDAO.getVendorById(id);

        if (picture && oldVendor?.photo_url) {
            await this.deleteFile(oldVendor.photo_url);
            const result = await this.bucketDAO.addFile(picture);
            pictureUrl = result.publicUrl;
        } else if (picture) {
            const result = await this.bucketDAO.addFile(picture);
            pictureUrl = result.publicUrl;
        }

        return await this.vendorDAO.updateVendor(id, {
            ...vendorData,
            photo_url: pictureUrl
        });
    }

    async deleteVendor(id: number): Promise<void> {
        const vendor = await this.vendorDAO.getVendorById(id);

        // Get all event associations
        const eventAssociations = await this.eventVendorDAO.getEventsByVendorId(id);

        // Remove all event associations
        for (const assoc of eventAssociations) {
            await this.eventVendorDAO.deleteEventVendor(id, assoc.event_occurence_id);
        }

        // Delete the vendor
        await this.vendorDAO.deleteVendor(id);

        // Clean up photo if exists
        if (vendor?.photo_url) {
            await this.deleteFile(vendor.photo_url);
        }
    }


    private async deleteFile(fileUrl: string) {
        const filename = fileUrl.split('/').pop() ?? '';
        await this.bucketDAO.deleteFile(filename);
    }

    async getVendorEvents(vendorId: number): Promise<Tables<'Event_Vendors'>[]> {
        return await this.eventVendorDAO.getEventsByVendorId(vendorId);
    }

    async addVendorToEvent(
        vendorId: number,
        eventOccurrenceId: number,
        boothNumber: number
    ): Promise<Tables<'Event_Vendors'>> {
        return await this.eventVendorDAO.addEventVendor({
            vendor_id: vendorId,
            event_occurence_id: eventOccurrenceId,
            booth_number: boothNumber
        });
    }

    async removeVendorFromEvent(vendorId: number, eventOccurrenceId: number): Promise<void> {
        await this.eventVendorDAO.deleteEventVendor(vendorId, eventOccurrenceId);
    }
}