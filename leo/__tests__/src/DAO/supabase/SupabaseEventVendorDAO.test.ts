import { SupabaseEventVendorDAO } from '@/DAO/supabase/SupabaseEventVendorDAO';
import { createClient } from '@/utils/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '../../../types/database.types';

jest.mock('@/utils/supabase/server');

describe('SupabaseEventVendorDAO', () => {
    let eventVendorDAO: SupabaseEventVendorDAO;
    let mockSupabase: any;
    let mockQuery: any;

    beforeEach(() => {
        mockQuery = {
            data: null,
            error: null,
            select: jest.fn(),
            eq: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            single: jest.fn(),
        };

        mockQuery.select.mockReturnValue(mockQuery);
        mockQuery.eq.mockReturnValue(mockQuery);
        mockQuery.insert.mockReturnValue(mockQuery);
        mockQuery.update.mockReturnValue(mockQuery);
        mockQuery.delete.mockReturnValue(mockQuery);
        mockQuery.single.mockReturnValue(mockQuery);

        mockQuery.then = jest.fn().mockImplementation((callback) => {
            return Promise.resolve(callback({ data: mockQuery.data, error: mockQuery.error }));
        });

        mockSupabase = {
            from: jest.fn(() => mockQuery),
        };

        (createClient as jest.Mock).mockReturnValue(mockSupabase);
        eventVendorDAO = new SupabaseEventVendorDAO();
    });

    describe('getEventVendors', () => {
        it('should return empty array when no vendors', async () => {
            mockQuery.data = null;
            const result = await eventVendorDAO.getEventVendors();
            expect(result).toEqual([]);
        });

        it('should return array of vendors', async () => {
            const mockEventVendors = [{ event_id: 1, vendor_id: 1 }];
            mockQuery.data = mockEventVendors;
            const result = await eventVendorDAO.getEventVendors();
            expect(result).toEqual(mockEventVendors);
        });

        it('should throw error on query failure', async () => {
            mockQuery.error = new Error('Database error');
            await expect(eventVendorDAO.getEventVendors()).rejects.toThrow('Database error');
        });
    });

    describe('getVendorsByEventId', () => {
        it('should return empty array when no vendors found', async () => {
            mockQuery.data = null;
            const result = await eventVendorDAO.getVendorsByEventId(1);
            expect(result).toEqual([]);
        });

        it('should return mapped vendor data', async () => {
            const mockVendor = { id: 1, name: 'Test Vendor' };
            mockQuery.data = [{ Vendors: mockVendor }];
            const result = await eventVendorDAO.getVendorsByEventId(1);
            expect(result).toEqual([mockVendor]);
            expect(mockQuery.select).toHaveBeenCalledWith('Vendors!inner(*)');
            expect(mockQuery.eq).toHaveBeenCalledWith('event_id', 1);
        });

        it('should throw error on query failure', async () => {
            mockQuery.error = new Error('Database error');
            await expect(eventVendorDAO.getVendorsByEventId(1)).rejects.toThrow('Database error');
        });
    });

    describe('getEventsByVendorId', () => {
        it('should return empty array when no events found', async () => {
            mockQuery.data = null;
            const result = await eventVendorDAO.getEventsByVendorId(1);
            expect(result).toEqual([]);
        });

        it('should return mapped event data', async () => {
            const mockEvent = { id: 1, name: 'Test Event' };
            mockQuery.data = [{ Events: mockEvent }];
            const result = await eventVendorDAO.getEventsByVendorId(1);
            expect(result).toEqual([mockEvent]);
            expect(mockQuery.select).toHaveBeenCalledWith('Events!inner(*)');
            expect(mockQuery.eq).toHaveBeenCalledWith('vendor_id', 1);
        });

        it('should throw error on query failure', async () => {
            mockQuery.error = new Error('Database error');
            await expect(eventVendorDAO.getEventsByVendorId(1)).rejects.toThrow('Database error');
        });
    });

    describe('addEventVendor', () => {
        const newVendor: TablesInsert<'Event_Vendors'> = {
            event_id: 1,
            vendor_id: 1,
            booth_number: 1
        };

        it('should throw error when insert returns no data', async () => {
            mockQuery.data = null;
            await expect(eventVendorDAO.addEventVendor(newVendor))
                .rejects.toThrow('Failed to add event vendor');
        });

        it('should successfully add vendor', async () => {
            const insertedVendor = { ...newVendor };
            mockQuery.data = insertedVendor;
            const result = await eventVendorDAO.addEventVendor(newVendor);
            expect(result).toEqual(insertedVendor);
            expect(mockQuery.insert).toHaveBeenCalledWith(newVendor);
            expect(mockQuery.select).toHaveBeenCalled();
            expect(mockQuery.single).toHaveBeenCalled();
        });

        it('should throw error on insert failure', async () => {
            mockQuery.error = new Error('Insert failed');
            await expect(eventVendorDAO.addEventVendor(newVendor))
                .rejects.toThrow('Insert failed');
        });
    });

    describe('updateEventVendor', () => {
        const updateData: TablesUpdate<'Event_Vendors'> = {
            booth_number: 2
        };

        it('should throw error when update returns no data', async () => {
            mockQuery.data = null;
            await expect(eventVendorDAO.updateEventVendor(1, 1, updateData))
                .rejects.toThrow('Failed to update event vendor');
        });

        it('should successfully update vendor', async () => {
            const updatedVendor = { vendor_id: 1, event_id: 1, booth_number: 2 };
            mockQuery.data = updatedVendor;
            const result = await eventVendorDAO.updateEventVendor(1, 1, updateData);
            expect(result).toEqual(updatedVendor);
            expect(mockQuery.update).toHaveBeenCalledWith(updateData);
            expect(mockQuery.eq).toHaveBeenCalledWith('vendor_id', 1);
            expect(mockQuery.eq).toHaveBeenCalledWith('event_id', 1);
        });

        it('should throw error on update failure', async () => {
            mockQuery.error = new Error('Update failed');
            await expect(eventVendorDAO.updateEventVendor(1, 1, updateData))
                .rejects.toThrow('Update failed');
        });
    });

    describe('deleteEventVendor', () => {
        it('should successfully delete vendor', async () => {
            mockQuery.data = null;
            await eventVendorDAO.deleteEventVendor(1, 1);
            expect(mockQuery.delete).toHaveBeenCalled();
            expect(mockQuery.eq).toHaveBeenCalledWith('vendor_id', 1);
            expect(mockQuery.eq).toHaveBeenCalledWith('event_id', 1);
        });

        it('should throw error on delete failure', async () => {
            mockQuery.error = new Error('Delete failed');
            await expect(eventVendorDAO.deleteEventVendor(1, 1))
                .rejects.toThrow('Delete failed');
        });
    });
});