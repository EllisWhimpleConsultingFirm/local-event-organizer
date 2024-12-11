import { addVendor, updateVendor, deleteVendor, getVendor, getVendors, getAdminVendors, getVendorEvents, FormState } from '@/actions/vendor';
import { VendorService } from '@/services/vendors';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SupabaseDAOFactory } from "@/DAO/supabase/SupabaseDAOFactory";
import { createClient } from "@/utils/supabase/server";

jest.mock('next/cache');
jest.mock('next/navigation');
jest.mock('@/utils/supabase/server', () => ({
    createClient: jest.fn(() => ({
        auth: { getUser: jest.fn(() => ({ data: { user: { id: 'test-admin-id' } } })) }
    }))
}));
jest.mock('@/services/vendors');
jest.mock('@/DAO/supabase/SupabaseDAOFactory');

describe('Vendor Actions', () => {
    let mockVendorService: jest.Mocked<VendorService>;
    let mockDAOFactory: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockVendorService = {
            addVendor: jest.fn(),
            updateVendor: jest.fn(),
            deleteVendor: jest.fn(),
            getVendor: jest.fn(),
            getAllVendors: jest.fn(),
            getAdminVendors: jest.fn(),
            getVendorEvents: jest.fn()
        } as any;

        mockDAOFactory = {
            getVendorDAO: jest.fn(),
            getBucketDAO: jest.fn(),
            getEventVendorDAO: jest.fn()
        };

        (SupabaseDAOFactory as jest.MockedClass<typeof SupabaseDAOFactory>)
            .mockImplementation(() => mockDAOFactory);
        (VendorService as jest.MockedClass<typeof VendorService>)
            .mockImplementation(() => mockVendorService);
    });

    describe('addVendor', () => {
        it('returns validation errors for invalid input', async () => {
            const formData = new FormData();
            const result = await addVendor({}, formData);
            expect(result.errors).toBeDefined();
        });
    });

    describe('deleteVendor', () => {
        it('deletes vendor and redirects', async () => {
            const formData = new FormData();
            formData.append('id', '1');

            await deleteVendor({}, formData);

            expect(mockVendorService.deleteVendor).toHaveBeenCalledWith(1);
            expect(redirect).toHaveBeenCalledWith('/admin/vendors');
        });

        it('handles invalid ID', async () => {
            const formData = new FormData();
            formData.append('id', 'invalid');

            await expect(deleteVendor({}, formData)).rejects.toThrow('Invalid vendor ID');
        });
    });

    describe('Query Operations', () => {
        const mockVendor = { id: 1, name: 'Test Vendor' };

        it('gets single vendor', async () => {
            mockVendorService.getVendor.mockResolvedValue(mockVendor);
            const result = await getVendor(1);
            expect(result).toEqual(mockVendor);
        });

        it('gets all vendors', async () => {
            mockVendorService.getAllVendors.mockResolvedValue([mockVendor]);
            const result = await getVendors();
            expect(result).toEqual([mockVendor]);
        });

        it('gets admin vendors', async () => {
            mockVendorService.getAdminVendors.mockResolvedValue([mockVendor]);
            const result = await getAdminVendors('admin-id');
            expect(result).toEqual([mockVendor]);
        });

        it('gets vendor events', async () => {
            const mockEvent = { id: 1, name: 'Test Event' };
            mockVendorService.getVendorEvents.mockResolvedValue([mockEvent]);
            const result = await getVendorEvents(1);
            expect(result).toEqual([mockEvent]);
        });

        it('handles query errors', async () => {
            mockVendorService.getVendor.mockRejectedValue(new Error('Not found'));
            await expect(getVendor(999)).rejects.toThrow('Not found');
        });
    });
});