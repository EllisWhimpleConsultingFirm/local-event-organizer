import { SupabaseEventApplicationDAO } from '@/DAO/supabase/SupabaseEventApplicationDAO';
import { createClient } from '@/utils/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '../../../../types/database.types';

jest.mock('@/utils/supabase/server');

describe('SupabaseEventApplicationDAO', () => {
    let eventApplicationDAO: SupabaseEventApplicationDAO;
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
        eventApplicationDAO = new SupabaseEventApplicationDAO();
    });

    describe('getEventApplications', () => {
        it('returns all applications', async () => {
            const mockApplications = [{ event_id: 1, vendor_id: 1 }];
            mockQuery.data = mockApplications;

            const result = await eventApplicationDAO.getEventApplications();

            expect(result).toEqual(mockApplications);
            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Applications');
            expect(mockQuery.select).toHaveBeenCalled();
        });

        it('returns empty array when no data', async () => {
            mockQuery.data = null;
            const result = await eventApplicationDAO.getEventApplications();
            expect(result).toEqual([]);
        });

        it('throws error on query failure', async () => {
            mockQuery.error = new Error('Database error');
            await expect(eventApplicationDAO.getEventApplications()).rejects.toThrow('Database error');
        });
    });

    describe('addEventApplication', () => {
        const newApplication: TablesInsert<'Event_Applications'> = {
            event_id: 1,
            vendor_id: 1,
            status: 'PENDING'
        };

        it('adds application successfully', async () => {
            mockQuery.data = { ...newApplication, id: 1 };
            const result = await eventApplicationDAO.addEventApplication(newApplication);

            expect(result).toEqual(expect.objectContaining(newApplication));
            expect(mockQuery.insert).toHaveBeenCalledWith(newApplication);
            expect(mockQuery.select).toHaveBeenCalled();
            expect(mockQuery.single).toHaveBeenCalled();
        });

        it('throws error when no data returned', async () => {
            mockQuery.data = null;
            await expect(eventApplicationDAO.addEventApplication(newApplication))
                .rejects.toThrow('Failed to add event application');
        });

        it('throws error on insert failure', async () => {
            mockQuery.error = new Error('Insert failed');
            await expect(eventApplicationDAO.addEventApplication(newApplication))
                .rejects.toThrow('Insert failed');
        });
    });

    describe('updateEventApplication', () => {
        const updateData: TablesUpdate<'Event_Applications'> = {
            status: 'APPROVED'
        };

        it('updates application successfully', async () => {
            const updatedApplication = { vendor_id: 1, event_id: 1, status: 'APPROVED' };
            mockQuery.data = updatedApplication;

            const result = await eventApplicationDAO.updateEventApplication(1, 1, updateData);

            expect(result).toEqual(updatedApplication);
            expect(mockQuery.update).toHaveBeenCalledWith(updateData);
            expect(mockQuery.eq).toHaveBeenCalledWith('vendor_id', 1);
            expect(mockQuery.eq).toHaveBeenCalledWith('event_id', 1);
        });

        it('throws error when no data returned', async () => {
            mockQuery.data = null;
            await expect(eventApplicationDAO.updateEventApplication(1, 1, updateData))
                .rejects.toThrow('Failed to update event application');
        });
    });

    describe('deleteEventApplication', () => {
        it('deletes application successfully', async () => {
            await eventApplicationDAO.deleteEventApplication(1, 1);

            expect(mockQuery.delete).toHaveBeenCalled();
            expect(mockQuery.eq).toHaveBeenCalledWith('vendor_id', 1);
            expect(mockQuery.eq).toHaveBeenCalledWith('event_id', 1);
        });

        it('throws error on delete failure', async () => {
            mockQuery.error = new Error('Delete failed');
            await expect(eventApplicationDAO.deleteEventApplication(1, 1))
                .rejects.toThrow('Delete failed');
        });
    });

    describe('getVendorEventApplications', () => {
        it('returns vendor applications with events', async () => {
            const mockData = [{
                vendor_id: 1,
                Events: { id: 1, name: 'Event 1' }
            }];
            mockQuery.data = mockData;

            const result = await eventApplicationDAO.getVendorEventApplications(1);

            expect(result).toEqual(mockData);
            expect(mockQuery.select).toHaveBeenCalledWith('*, Events(*)');
            expect(mockQuery.eq).toHaveBeenCalledWith('vendor_id', 1);
        });
    });

    describe('getEventsApplications', () => {
        it('returns event applications with vendors', async () => {
            const mockData = [{
                event_id: 1,
                Vendors: { id: 1, name: 'Vendor 1' }
            }];
            mockQuery.data = mockData;

            const result = await eventApplicationDAO.getEventsApplications(1);

            expect(result).toEqual(mockData);
            expect(mockQuery.select).toHaveBeenCalledWith('*, Vendors(*)');
            expect(mockQuery.eq).toHaveBeenCalledWith('event_id', 1);
        });
    });

    describe('getPendingVendorEventApplications', () => {
        it('returns pending applications with mapped data', async () => {
            const mockEvent = { id: 1, name: 'Event 1' };
            const mockApplication = {
                vendor_id: 1,
                event_id: 1,
                status: 'PENDING',
                Events: mockEvent
            };
            mockQuery.data = [mockApplication];

            const result = await eventApplicationDAO.getPendingVendorEventApplications(1);

            expect(result).toEqual([{
                event: mockEvent,
                application: mockApplication
            }]);
            expect(mockQuery.select).toHaveBeenCalledWith('*, Events!inner(*)');
            expect(mockQuery.eq).toHaveBeenCalledWith('status', 'PENDING');
        });
    });

    describe('getPendingEventsApplications', () => {
        it('returns pending applications with mapped data', async () => {
            const mockVendor = { id: 1, name: 'Vendor 1' };
            const mockApplication = {
                event_id: 1,
                vendor_id: 1,
                status: 'PENDING',
                Vendors: mockVendor
            };
            mockQuery.data = [mockApplication];

            const result = await eventApplicationDAO.getPendingEventsApplications(1);

            expect(result).toEqual([{
                vendor: mockVendor,
                application: mockApplication
            }]);
            expect(mockQuery.select).toHaveBeenCalledWith('*, Vendors!inner(*)');
            expect(mockQuery.eq).toHaveBeenCalledWith('status', 'PENDING');
        });
    });
});