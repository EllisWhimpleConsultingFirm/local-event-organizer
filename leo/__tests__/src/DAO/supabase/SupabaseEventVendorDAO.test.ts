import { SupabaseEventVendorDAO } from '@/DAO/supabase/SupabaseEventVendorDAO';
import { createClient } from '@/utils/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '../../../../types/database.types';

jest.mock('@/utils/supabase/server');

describe('SupabaseEventVendorDAO', () => {
    let eventVendorDAO: SupabaseEventVendorDAO;
    let mockSupabase: any;
    let mockQuery: any;

    beforeEach(() => {
        // Create a new mock query chain for each test
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

        // Setup the chainable methods
        mockQuery.select.mockReturnValue(mockQuery);
        mockQuery.eq.mockReturnValue(mockQuery);
        mockQuery.insert.mockReturnValue(mockQuery);
        mockQuery.update.mockReturnValue(mockQuery);
        mockQuery.delete.mockReturnValue(mockQuery);
        mockQuery.single.mockReturnValue(mockQuery);

        // Setup the final promise resolution
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
        it('should return all event vendors', async () => {
            const mockEventVendors: Tables<'Event_Vendors'>[] = [
                { event_occurence_id: 1, vendor_id: 1, booth_number: 1 },
                { event_occurence_id: 2, vendor_id: 2, booth_number: 2 },
            ];

            mockQuery.data = mockEventVendors;
            mockQuery.error = null;

            const result = await eventVendorDAO.getEventVendors();

            expect(result).toEqual(mockEventVendors);
            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Vendors');
            expect(mockQuery.select).toHaveBeenCalled();
        });

        it('should throw an error if the query fails', async () => {
            mockQuery.data = null;
            mockQuery.error = new Error('Database error');

            await expect(eventVendorDAO.getEventVendors()).rejects.toThrow('Database error');
        });
    });

    describe('getVendorsByEventId', () => {
        it('should return vendors for a specific event', async () => {
            const mockVendors: Tables<'Event_Vendors'>[] = [
                {
                    event_occurence_id: 1,
                    vendor_id: 1,
                    booth_number: 1,
                    Vendors: {
                        id: 1,
                        name: 'Vendor 1',
                        description: null,
                        email: null,
                        phone_number: null,
                        photo_url: null,
                        created_at: '2024-01-01'
                    }
                },
                {
                    event_occurence_id: 1,
                    vendor_id: 2,
                    booth_number: 2,
                    Vendors: {
                        id: 2,
                        name: 'Vendor 2',
                        description: null,
                        email: null,
                        phone_number: null,
                        photo_url: null,
                        created_at: '2024-01-01'
                    }
                },
            ];

            mockQuery.data = mockVendors;
            mockQuery.error = null;

            const result = await eventVendorDAO.getVendorsByEventId(1);

            expect(result).toEqual(mockVendors);
            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Vendors');
            expect(mockQuery.select).toHaveBeenCalledWith('*, Vendors(*)');
            expect(mockQuery.eq).toHaveBeenCalledWith('event_occurence_id', 1);
        });

        it('should throw an error if the query fails', async () => {
            mockQuery.data = null;
            mockQuery.error = new Error('Database error');

            await expect(eventVendorDAO.getVendorsByEventId(1)).rejects.toThrow('Database error');
        });
    });

    describe('getEventsByVendorId', () => {
        it('should return events for a specific vendor', async () => {
            const mockEvents: Tables<'Event_Vendors'>[] = [
                {
                    event_occurence_id: 1,
                    vendor_id: 1,
                    booth_number: 1,
                    Events: {
                        id: 1,
                        name: 'Event 1',
                        description: null,
                        admin_id: 1,
                        is_recurring: false,
                        photo_url: null,
                        recurrence_pattern: null
                    }
                },
                {
                    event_occurence_id: 2,
                    vendor_id: 1,
                    booth_number: 2,
                    Events: {
                        id: 2,
                        name: 'Event 2',
                        description: null,
                        admin_id: 1,
                        is_recurring: false,
                        photo_url: null,
                        recurrence_pattern: null
                    }
                },
            ];

            mockQuery.data = mockEvents;
            mockQuery.error = null;

            const result = await eventVendorDAO.getEventsByVendorId(1);

            expect(result).toEqual(mockEvents);
            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Vendors');
            expect(mockQuery.select).toHaveBeenCalledWith('*, Events(*)');
            expect(mockQuery.eq).toHaveBeenCalledWith('vendor_id', 1);
        });

        it('should throw an error if the query fails', async () => {
            mockQuery.data = null;
            mockQuery.error = new Error('Database error');

            await expect(eventVendorDAO.getEventsByVendorId(1)).rejects.toThrow('Database error');
        });
    });

    describe('addEventVendor', () => {
        it('should add a new event vendor', async () => {
            const newEventVendor: TablesInsert<'Event_Vendors'> = {
                event_occurence_id: 1,
                vendor_id: 1,
                booth_number: 1
            };
            const insertedEventVendor: Tables<'Event_Vendors'> = { ...newEventVendor };

            mockQuery.data = insertedEventVendor;
            mockQuery.error = null;

            const result = await eventVendorDAO.addEventVendor(newEventVendor);

            expect(result).toEqual(insertedEventVendor);
            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Vendors');
            expect(mockQuery.insert).toHaveBeenCalledWith(newEventVendor);
            expect(mockQuery.select).toHaveBeenCalled();
            expect(mockQuery.single).toHaveBeenCalled();
        });

        it('should throw an error if the insert fails', async () => {
            const newEventVendor: TablesInsert<'Event_Vendors'> = {
                event_occurence_id: 1,
                vendor_id: 1,
                booth_number: 1
            };

            mockQuery.data = null;
            mockQuery.error = new Error('Insert failed');

            await expect(eventVendorDAO.addEventVendor(newEventVendor)).rejects.toThrow('Insert failed');
        });
    });

    describe('updateEventVendor', () => {
        it('should update an existing event vendor', async () => {
            const updatedEventVendor: TablesUpdate<'Event_Vendors'> = {
                booth_number: 2
            };
            const resultEventVendor: Tables<'Event_Vendors'> = {
                event_occurence_id: 1,
                vendor_id: 1,
                booth_number: 2
            };

            mockQuery.data = resultEventVendor;
            mockQuery.error = null;

            const result = await eventVendorDAO.updateEventVendor(1, 1, updatedEventVendor);

            expect(result).toEqual(resultEventVendor);
            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Vendors');
            expect(mockQuery.update).toHaveBeenCalledWith(updatedEventVendor);
            expect(mockQuery.eq).toHaveBeenCalledTimes(2);
            expect(mockQuery.eq).toHaveBeenNthCalledWith(1, 'vendor_id', 1);
            expect(mockQuery.eq).toHaveBeenNthCalledWith(2, 'event_occurence_id', 1);
            expect(mockQuery.select).toHaveBeenCalled();
            expect(mockQuery.single).toHaveBeenCalled();
        });

        it('should throw an error if the update fails', async () => {
            const updatedEventVendor: TablesUpdate<'Event_Vendors'> = {
                booth_number: 2
            };

            mockQuery.data = null;
            mockQuery.error = new Error('Update failed');

            await expect(eventVendorDAO.updateEventVendor(1, 1, updatedEventVendor))
                .rejects.toThrow('Update failed');
        });
    });

    describe('deleteEventVendor', () => {
        it('should delete an event vendor', async () => {
            mockQuery.data = null;
            mockQuery.error = null;

            await eventVendorDAO.deleteEventVendor(1, 1);

            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Vendors');
            expect(mockQuery.delete).toHaveBeenCalled();
            expect(mockQuery.eq).toHaveBeenCalledTimes(2);
            expect(mockQuery.eq).toHaveBeenNthCalledWith(1, 'vendor_id', 1);
            expect(mockQuery.eq).toHaveBeenNthCalledWith(2, 'event_occurence_id', 1);
        });

        it('should throw an error if the delete fails', async () => {
            mockQuery.data = null;
            mockQuery.error = new Error('Delete failed');

            await expect(eventVendorDAO.deleteEventVendor(1, 1))
                .rejects.toThrow('Delete failed');
        });
    });
});