import { SupabaseEventVendorDAO } from '@/DAO/supabase/SupabaseEventVendorDAO';
import { createClient } from '@/utils/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '../../../../types/database.types';

jest.mock('@/utils/supabase/server');

describe('SupabaseEventVendorDAO', () => {
    let eventVendorDAO: SupabaseEventVendorDAO;
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
        eventVendorDAO = new SupabaseEventVendorDAO();
    });

    describe('getEventVendors', () => {
        it('should return all event vendors', async () => {
            const mockEventVendors: Tables<'EventVendors'>[] = [
                { event_occurence_id: 1, vendor_id: 1, booth_number: 1 },
                { event_occurence_id: 2, vendor_id: 2, booth_number: 2 },
            ];
            mockChain.select.mockResolvedValue({ data: mockEventVendors, error: null });

            const result = await eventVendorDAO.getEventVendors();

            expect(result).toEqual(mockEventVendors);
            expect(mockSupabase.from).toHaveBeenCalledWith('EventVendors');
            expect(mockChain.select).toHaveBeenCalled();
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error('Database error');
            mockChain.select.mockResolvedValue({ data: null, error: mockError });

            await expect(eventVendorDAO.getEventVendors()).rejects.toThrow('Database error');
        });
    });

    describe('getVendorsByEventId', () => {
        it('should return vendors for a specific event', async () => {
            const mockVendors: Tables<'EventVendors'>[] = [
                { event_occurence_id: 1, vendor_id: 1, booth_number: 1, Vendors: { id: 1, name: 'Vendor 1' } },
                { event_occurence_id: 1, vendor_id: 2, booth_number: 2, Vendors: { id: 2, name: 'Vendor 2' } },
            ];
            mockChain.eq.mockResolvedValue({ data: mockVendors, error: null });

            const result = await eventVendorDAO.getVendorsByEventId(1);

            expect(result).toEqual(mockVendors);
            expect(mockSupabase.from).toHaveBeenCalledWith('EventVendors');
            expect(mockChain.select).toHaveBeenCalledWith('*, Vendors(*)');
            expect(mockChain.eq).toHaveBeenCalledWith('event_id', 1);
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error('Database error');
            mockChain.eq.mockResolvedValue({ data: null, error: mockError });

            await expect(eventVendorDAO.getVendorsByEventId(1)).rejects.toThrow('Database error');
        });
    });

    describe('getEventsByVendorId', () => {
        it('should return events for a specific vendor', async () => {
            const mockEvents: Tables<'EventVendors'>[] = [
                { event_occurence_id: 1, vendor_id: 1, booth_number: 1, Events: { id: 1, name: 'Event 1' } },
                { event_occurence_id: 2, vendor_id: 1, booth_number: 2, Events: { id: 2, name: 'Event 2' } },
            ];
            mockChain.eq.mockResolvedValue({ data: mockEvents, error: null });

            const result = await eventVendorDAO.getEventsByVendorId(1);

            expect(result).toEqual(mockEvents);
            expect(mockSupabase.from).toHaveBeenCalledWith('EventVendors');
            expect(mockChain.select).toHaveBeenCalledWith('*, Events(*)');
            expect(mockChain.eq).toHaveBeenCalledWith('vendor_id', 1);
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error('Database error');
            mockChain.eq.mockResolvedValue({ data: null, error: mockError });

            await expect(eventVendorDAO.getEventsByVendorId(1)).rejects.toThrow('Database error');
        });
    });

    describe('addEventVendor', () => {
        it('should add a new event vendor', async () => {
            const newEventVendor: TablesInsert<'EventVendors'> = { event_occurence_id: 1, vendor_id: 1, booth_number: 1 };
            const insertedEventVendor: Tables<'EventVendors'> = { ...newEventVendor };
            mockChain.single.mockResolvedValue({ data: insertedEventVendor, error: null });

            const result = await eventVendorDAO.addEventVendor(newEventVendor);

            expect(result).toEqual(insertedEventVendor);
            expect(mockSupabase.from).toHaveBeenCalledWith('EventVendors');
            expect(mockChain.insert).toHaveBeenCalledWith(newEventVendor);
            expect(mockChain.select).toHaveBeenCalled();
            expect(mockChain.single).toHaveBeenCalled();
        });

        it('should throw an error if the insert fails', async () => {
            const newEventVendor: TablesInsert<'EventVendors'> = { event_occurence_id: 1, vendor_id: 1, booth_number: 1 };
            const mockError = new Error('Insert failed');
            mockChain.single.mockResolvedValue({ data: null, error: mockError });

            await expect(eventVendorDAO.addEventVendor(newEventVendor)).rejects.toThrow('Insert failed');
        });
    });

    describe('updateEventVendor', () => {
        it('should update an existing event vendor', async () => {
            const updatedEventVendor: TablesUpdate<'EventVendors'> = { booth_number: 2 };
            const resultEventVendor: Tables<'EventVendors'> = { event_occurence_id: 1, vendor_id: 1, booth_number: 2 };
            mockChain.single.mockResolvedValue({ data: resultEventVendor, error: null });

            const result = await eventVendorDAO.updateEventVendor(1, updatedEventVendor);

            expect(result).toEqual(resultEventVendor);
            expect(mockSupabase.from).toHaveBeenCalledWith('EventVendors');
            expect(mockChain.update).toHaveBeenCalledWith(updatedEventVendor);
            expect(mockChain.eq).toHaveBeenCalledWith('id', 1);
            expect(mockChain.select).toHaveBeenCalled();
            expect(mockChain.single).toHaveBeenCalled();
        });

        it('should throw an error if the update fails', async () => {
            const updatedEventVendor: TablesUpdate<'EventVendors'> = { booth_number: 2 };
            const mockError = new Error('Update failed');
            mockChain.single.mockResolvedValue({ data: null, error: mockError });

            await expect(eventVendorDAO.updateEventVendor(1, updatedEventVendor)).rejects.toThrow('Update failed');
        });
    });

    describe('deleteEventVendor', () => {
        it('should delete an event vendor', async () => {
            mockChain.eq.mockResolvedValue({ error: null });

            await expect(eventVendorDAO.deleteEventVendor(1)).resolves.not.toThrow();

            expect(mockSupabase.from).toHaveBeenCalledWith('EventVendors');
            expect(mockChain.delete).toHaveBeenCalled();
            expect(mockChain.eq).toHaveBeenCalledWith('id', 1);
        });

        it('should throw an error if the delete fails', async () => {
            const mockError = new Error('Delete failed');
            mockChain.eq.mockResolvedValue({ error: mockError });

            await expect(eventVendorDAO.deleteEventVendor(1)).rejects.toThrow('Delete failed');
        });
    });
});