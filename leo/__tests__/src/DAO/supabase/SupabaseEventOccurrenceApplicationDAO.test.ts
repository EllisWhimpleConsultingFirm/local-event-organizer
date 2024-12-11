import { SupabaseEventOccurrenceApplicationDAO } from '@/DAO/supabase/SupabaseEventOccurrenceApplciationDAO';
import { createClient } from '@/utils/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '../../../../types/database.types';

jest.mock('@/utils/supabase/server');

describe('SupabaseEventOccurrenceApplicationDAO', () => {
    let eventOccurrenceApplicationDAO: SupabaseEventOccurrenceApplicationDAO;
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
        eventOccurrenceApplicationDAO = new SupabaseEventOccurrenceApplicationDAO();
    });

    describe('getEventApplications', () => {
        it('returns all applications', async () => {
            const mockApplications = [{ event_occurrence_id: 1, vendor_id: 1 }];
            mockQuery.data = mockApplications;

            const result = await eventOccurrenceApplicationDAO.getEventApplications();

            expect(result).toEqual(mockApplications);
            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Occurrence_Applications');
        });

        it('returns empty array for no data', async () => {
            mockQuery.data = null;
            const result = await eventOccurrenceApplicationDAO.getEventApplications();
            expect(result).toEqual([]);
        });

        it('throws error on query failure', async () => {
            mockQuery.error = new Error('Database error');
            await expect(eventOccurrenceApplicationDAO.getEventApplications()).rejects.toThrow('Database error');
        });
    });

    describe('addEventApplication', () => {
        const newApplication: TablesInsert<'Event_Occurrence_Applications'> = {
            event_occurrence_id: 1,
            vendor_id: 1,
            status: 'PENDING'
        };

        it('adds application successfully', async () => {
            mockQuery.data = { ...newApplication, id: 1 };
            const result = await eventOccurrenceApplicationDAO.addEventApplication(newApplication);
            expect(result).toEqual(expect.objectContaining(newApplication));
        });

        it('throws error for missing data', async () => {
            mockQuery.data = null;
            await expect(eventOccurrenceApplicationDAO.addEventApplication(newApplication))
                .rejects.toThrow('Failed to add event occurrence application');
        });
    });

    describe('updateEventApplication', () => {
        const updateData: TablesUpdate<'Event_Occurrence_Applications'> = {
            status: 'APPROVED'
        };

        it('updates application successfully', async () => {
            const updatedApplication = { vendor_id: 1, event_occurrence_id: 1, status: 'APPROVED' };
            mockQuery.data = updatedApplication;

            const result = await eventOccurrenceApplicationDAO.updateEventApplication(1, 1, updateData);
            expect(result).toEqual(updatedApplication);
            expect(mockQuery.eq).toHaveBeenCalledWith('vendor_id', 1);
            expect(mockQuery.eq).toHaveBeenCalledWith('event_occurrence_id', 1);
        });

        it('throws error for update failure', async () => {
            mockQuery.data = null;
            await expect(eventOccurrenceApplicationDAO.updateEventApplication(1, 1, updateData))
                .rejects.toThrow('Failed to update event occurrence application');
        });
    });

    describe('deleteEventApplication', () => {
        it('deletes application successfully', async () => {
            await eventOccurrenceApplicationDAO.deleteEventApplication(1, 1);
            expect(mockQuery.delete).toHaveBeenCalled();
            expect(mockQuery.eq).toHaveBeenCalledWith('vendor_id', 1);
            expect(mockQuery.eq).toHaveBeenCalledWith('event_occurrence_id', 1);
        });

        it('throws error on delete failure', async () => {
            mockQuery.error = new Error('Delete failed');
            await expect(eventOccurrenceApplicationDAO.deleteEventApplication(1, 1))
                .rejects.toThrow('Delete failed');
        });
    });

    describe('getVendorEventApplications', () => {
        it('returns vendor applications with occurrences', async () => {
            const mockData = [{
                vendor_id: 1,
                Event_Occurrences: { id: 1, event_id: 1 }
            }];
            mockQuery.data = mockData;

            const result = await eventOccurrenceApplicationDAO.getVendorEventApplications(1);
            expect(result).toEqual(mockData);
            expect(mockQuery.select).toHaveBeenCalledWith('*, Event_Occurrences(*)');
        });
    });

    describe('getEventsApplications', () => {
        it('returns event applications with vendors', async () => {
            const mockData = [{
                event_occurrence_id: 1,
                Vendors: { id: 1, name: 'Vendor 1' }
            }];
            mockQuery.data = mockData;

            const result = await eventOccurrenceApplicationDAO.getEventsApplications(1);
            expect(result).toEqual(mockData);
            expect(mockQuery.select).toHaveBeenCalledWith('*, Vendors(*)');
        });
    });

    describe('getPendingEventsApplications', () => {
        it('returns mapped pending applications', async () => {
            const mockVendor = { id: 1, name: 'Vendor 1' };
            const mockApplication = {
                event_occurrence_id: 1,
                status: 'PENDING',
                Vendors: mockVendor
            };
            mockQuery.data = [mockApplication];

            const result = await eventOccurrenceApplicationDAO.getPendingEventsApplications(1);
            expect(result).toEqual([{
                vendor: mockVendor,
                application: mockApplication
            }]);
            expect(mockQuery.select).toHaveBeenCalledWith('*, Vendors!inner(*)');
        });
    });

    describe('getPendingVendorEventOccurrencesApplications', () => {
        it('returns complex mapped data structure', async () => {
            const mockEvent = { id: 1, name: 'Event 1' };
            const mockOccurrence = {
                id: 1,
                event_id: 1,
                Events: mockEvent
            };
            const mockApplication = {
                vendor_id: 1,
                status: 'PENDING',
                Event_Occurrences: mockOccurrence
            };
            mockQuery.data = [mockApplication];

            const result = await eventOccurrenceApplicationDAO.getPendingVendorEventOccurrencesApplications(1);
            expect(result).toEqual([{
                event: mockEvent,
                eventOccurrence: mockOccurrence,
                application: mockApplication
            }]);
            expect(mockQuery.select).toHaveBeenCalledWith('*, Event_Occurrences!inner(*, Events!inner(*))');
        });
    });
});