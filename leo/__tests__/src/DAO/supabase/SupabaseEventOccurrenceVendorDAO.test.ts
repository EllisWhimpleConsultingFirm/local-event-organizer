import { SupabaseEventOccurrenceVendorDAO } from '@/DAO/supabase/SupabaseEventOccurrenceVendorDAO';
import { createClient } from '@/utils/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '../../../types/database.types';

jest.mock('@/utils/supabase/server');

describe('SupabaseEventOccurrenceVendorDAO', () => {
    let eventOccurrenceVendorDAO: SupabaseEventOccurrenceVendorDAO;
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

        mockSupabase = { from: jest.fn(() => mockQuery) };
        (createClient as jest.Mock).mockReturnValue(mockSupabase);
        eventOccurrenceVendorDAO = new SupabaseEventOccurrenceVendorDAO();
    });

    describe('getEventOccurrenceVendors', () => {
        it('returns all vendors', async () => {
            const mockVendors = [{ event_occurrence_id: 1, vendor_id: 1 }];
            mockQuery.data = mockVendors;

            const result = await eventOccurrenceVendorDAO.getEventOccurrenceVendors();

            expect(result).toEqual(mockVendors);
            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Occurrence_Vendors');
        });

        it('returns empty array for no data', async () => {
            mockQuery.data = null;
            const result = await eventOccurrenceVendorDAO.getEventOccurrenceVendors();
            expect(result).toEqual([]);
        });

        it('throws error on query failure', async () => {
            mockQuery.error = new Error('Database error');
            await expect(eventOccurrenceVendorDAO.getEventOccurrenceVendors())
                .rejects.toThrow('Database error');
        });
    });

    describe('getVendorsByEventOccurrenceId', () => {
        it('returns mapped vendors data', async () => {
            const mockVendor = { id: 1, name: 'Vendor 1' };
            mockQuery.data = [{ Vendors: mockVendor }];

            const result = await eventOccurrenceVendorDAO.getVendorsByEventOccurrenceId(1);

            expect(result).toEqual([mockVendor]);
            expect(mockQuery.select).toHaveBeenCalledWith('Vendors!inner(*)');
            expect(mockQuery.eq).toHaveBeenCalledWith('event_occurrence_id', 1);
        });

        it('returns empty array when no vendors found', async () => {
            mockQuery.data = null;
            const result = await eventOccurrenceVendorDAO.getVendorsByEventOccurrenceId(1);
            expect(result).toEqual([]);
        });
    });

    describe('getEventOccurrencesByVendorId', () => {
        it('returns mapped event occurrences', async () => {
            const mockOccurrence = { id: 1, event_id: 1 };
            mockQuery.data = [{ Event_Occurrences: mockOccurrence }];

            const result = await eventOccurrenceVendorDAO.getEventOccurrencesByVendorId(1);

            expect(result).toEqual([mockOccurrence]);
            expect(mockQuery.select).toHaveBeenCalledWith('Event_Occurrences!inner(*)');
            expect(mockQuery.eq).toHaveBeenCalledWith('vendor_id', 1);
        });

        it('returns empty array when no occurrences found', async () => {
            mockQuery.data = null;
            const result = await eventOccurrenceVendorDAO.getEventOccurrencesByVendorId(1);
            expect(result).toEqual([]);
        });
    });

    describe('addEventOccurrenceVendor', () => {
        const newVendor: TablesInsert<'Event_Occurrence_Vendors'> = {
            event_occurrence_id: 1,
            vendor_id: 1,
            booth_number: 1
        };

        it('adds vendor successfully', async () => {
            mockQuery.data = { ...newVendor, id: 1 };
            const result = await eventOccurrenceVendorDAO.addEventOccurrenceVendor(newVendor);
            expect(result).toEqual(expect.objectContaining(newVendor));
            expect(mockQuery.insert).toHaveBeenCalledWith(newVendor);
        });

        it('throws error when no data returned', async () => {
            mockQuery.data = null;
            await expect(eventOccurrenceVendorDAO.addEventOccurrenceVendor(newVendor))
                .rejects.toThrow('Failed to add event vendor');
        });

        it('throws error on insert failure', async () => {
            mockQuery.error = new Error('Insert failed');
            await expect(eventOccurrenceVendorDAO.addEventOccurrenceVendor(newVendor))
                .rejects.toThrow('Insert failed');
        });
    });

    describe('updateEventOccurrenceVendor', () => {
        const updateData: TablesUpdate<'Event_Occurrence_Vendors'> = {
            booth_number: 2
        };

        it('updates vendor successfully', async () => {
            const updatedVendor = { vendor_id: 1, event_occurrence_id: 1, booth_number: 2 };
            mockQuery.data = updatedVendor;

            const result = await eventOccurrenceVendorDAO.updateEventOccurrenceVendor(1, 1, updateData);

            expect(result).toEqual(updatedVendor);
            expect(mockQuery.update).toHaveBeenCalledWith(updateData);
            expect(mockQuery.eq).toHaveBeenCalledWith('vendor_id', 1);
            expect(mockQuery.eq).toHaveBeenCalledWith('event_occurrence_id', 1);
        });

        it('throws error when no data returned', async () => {
            mockQuery.data = null;
            await expect(eventOccurrenceVendorDAO.updateEventOccurrenceVendor(1, 1, updateData))
                .rejects.toThrow('Failed to update event vendor');
        });

        it('throws error on update failure', async () => {
            mockQuery.error = new Error('Update failed');
            await expect(eventOccurrenceVendorDAO.updateEventOccurrenceVendor(1, 1, updateData))
                .rejects.toThrow('Update failed');
        });
    });

    describe('deleteEventOccurrenceVendor', () => {
        it('deletes vendor successfully', async () => {
            await eventOccurrenceVendorDAO.deleteEventOccurrenceVendor(1, 1);
            expect(mockQuery.delete).toHaveBeenCalled();
            expect(mockQuery.eq).toHaveBeenCalledWith('vendor_id', 1);
            expect(mockQuery.eq).toHaveBeenCalledWith('event_occurrence_id', 1);
        });

        it('throws error on delete failure', async () => {
            mockQuery.error = new Error('Delete failed');
            await expect(eventOccurrenceVendorDAO.deleteEventOccurrenceVendor(1, 1))
                .rejects.toThrow('Delete failed');
        });
    });
});