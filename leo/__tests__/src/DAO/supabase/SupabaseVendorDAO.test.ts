import { SupabaseVendorDAO } from '@/DAO/supabase/SupabaseVendorDAO';
import { createClient } from '@/utils/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '../../../../types/database.types';

jest.mock('@/utils/supabase/server');

describe('SupabaseVendorDAO', () => {
    let vendorDAO: SupabaseVendorDAO;
    let mockSupabase: any;
    let mockChain: any;

    beforeEach(() => {
        mockChain = {
            select: jest.fn(() => mockChain),
            eq: jest.fn(() => mockChain),
            insert: jest.fn(() => mockChain),
            update: jest.fn(() => mockChain),
            delete: jest.fn(() => mockChain),
            single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        };

        mockSupabase = {
            from: jest.fn(() => mockChain),
        };

        (createClient as jest.Mock).mockReturnValue(mockSupabase);
        vendorDAO = new SupabaseVendorDAO();
    });

    describe('getVendors', () => {
        it('should return all vendors', async () => {
            const mockVendors: Tables<'Vendors'>[] = [
                { id: 1, name: 'Vendor 1', created_at: '2023-01-01T00:00:00' },
                { id: 2, name: 'Vendor 2', created_at: '2023-01-02T00:00:00' },
            ];
            mockChain.select.mockResolvedValue({ data: mockVendors, error: null });

            const result = await vendorDAO.getVendors();

            expect(result).toEqual(mockVendors);
            expect(mockSupabase.from).toHaveBeenCalledWith('Vendors');
            expect(mockChain.select).toHaveBeenCalled();
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error('Database error');
            mockChain.select.mockResolvedValue({ data: null, error: mockError });

            await expect(vendorDAO.getVendors()).rejects.toThrow('Database error');
        });
    });

    describe('getVendorById', () => {
        it('should return a vendor by id', async () => {
            const mockVendor: Tables<'Vendors'> = { id: 1, name: 'Vendor 1', created_at: '2023-01-01T00:00:00' };
            mockChain.single.mockResolvedValue({ data: mockVendor, error: null });

            const result = await vendorDAO.getVendorById(1);

            expect(result).toEqual(mockVendor);
            expect(mockSupabase.from).toHaveBeenCalledWith('Vendors');
            expect(mockChain.select).toHaveBeenCalled();
            expect(mockChain.eq).toHaveBeenCalledWith('id', 1);
            expect(mockChain.single).toHaveBeenCalled();
        });

        it('should return null if vendor is not found', async () => {
            mockChain.single.mockResolvedValue({ data: null, error: null });

            const result = await vendorDAO.getVendorById(999);

            expect(result).toBeNull();
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error('Database error');
            mockChain.single.mockResolvedValue({ data: null, error: mockError });

            await expect(vendorDAO.getVendorById(1)).rejects.toThrow('Database error');
        });
    });

    describe('addVendor', () => {
        it('should add a new vendor', async () => {
            const newVendor: TablesInsert<'Vendors'> = { name: 'New Vendor' };
            const insertedVendor: Tables<'Vendors'> = { id: 3, name: 'New Vendor', created_at: '2023-01-03T00:00:00' };
            mockChain.single.mockResolvedValue({ data: insertedVendor, error: null });

            const result = await vendorDAO.addVendor(newVendor);

            expect(result).toEqual(insertedVendor);
            expect(mockSupabase.from).toHaveBeenCalledWith('Vendors');
            expect(mockChain.insert).toHaveBeenCalledWith(newVendor);
            expect(mockChain.select).toHaveBeenCalled();
            expect(mockChain.single).toHaveBeenCalled();
        });

        it('should throw an error if the insert fails', async () => {
            const newVendor: TablesInsert<'Vendors'> = { name: 'New Vendor' };
            const mockError = new Error('Insert failed');
            mockChain.single.mockResolvedValue({ data: null, error: mockError });

            await expect(vendorDAO.addVendor(newVendor)).rejects.toThrow('Insert failed');
        });
    });

    describe('updateVendor', () => {
        it('should update an existing vendor', async () => {
            const updatedVendor: TablesUpdate<'Vendors'> = { name: 'Updated Vendor' };
            const resultVendor: Tables<'Vendors'> = { id: 1, name: 'Updated Vendor', created_at: '2023-01-01T00:00:00' };
            mockChain.single.mockResolvedValue({ data: resultVendor, error: null });

            const result = await vendorDAO.updateVendor(1, updatedVendor);

            expect(result).toEqual(resultVendor);
            expect(mockSupabase.from).toHaveBeenCalledWith('Vendors');
            expect(mockChain.update).toHaveBeenCalledWith(updatedVendor);
            expect(mockChain.eq).toHaveBeenCalledWith('id', 1);
            expect(mockChain.select).toHaveBeenCalled();
            expect(mockChain.single).toHaveBeenCalled();
        });

        it('should throw an error if the update fails', async () => {
            const updatedVendor: TablesUpdate<'Vendors'> = { name: 'Updated Vendor' };
            const mockError = new Error('Update failed');
            mockChain.single.mockResolvedValue({ data: null, error: mockError });

            await expect(vendorDAO.updateVendor(1, updatedVendor)).rejects.toThrow('Update failed');
        });
    });

    describe('deleteVendor', () => {
        it('should delete a vendor', async () => {
            mockChain.eq.mockResolvedValue({ error: null });

            await expect(vendorDAO.deleteVendor(1)).resolves.not.toThrow();

            expect(mockSupabase.from).toHaveBeenCalledWith('Vendors');
            expect(mockChain.delete).toHaveBeenCalled();
            expect(mockChain.eq).toHaveBeenCalledWith('id', 1);
        });

        it('should throw an error if the delete fails', async () => {
            const mockError = new Error('Delete failed');
            mockChain.eq.mockResolvedValue({ error: mockError });

            await expect(vendorDAO.deleteVendor(1)).rejects.toThrow('Delete failed');
        });
    });
});