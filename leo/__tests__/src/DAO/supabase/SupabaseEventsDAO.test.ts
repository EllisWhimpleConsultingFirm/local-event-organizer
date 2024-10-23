import { SupabaseEventsDAO } from '@/DAO/supabase/SupabaseEventsDAO';
import { createClient } from '@/utils/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '../../../../types/database.types';

jest.mock('@/utils/supabase/server');

describe('SupabaseEventsDAO', () => {
    let eventsDAO: SupabaseEventsDAO;
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
        eventsDAO = new SupabaseEventsDAO();
    });

    describe('getEvents', () => {
        it('should return all events', async () => {
            const mockEvents: Tables<'Events'>[] = [
                { id: 1, name: 'Event 1', admin_id: 1, description: 'Description 1', is_recurring: false },
                { id: 2, name: 'Event 2', admin_id: 2, description: 'Description 2', is_recurring: true },
            ];
            mockChain.select.mockResolvedValue({ data: mockEvents, error: null });

            const result = await eventsDAO.getEvents();

            expect(result).toEqual(mockEvents);
            expect(mockSupabase.from).toHaveBeenCalledWith('Events');
            expect(mockChain.select).toHaveBeenCalled();
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error('Database error');
            mockChain.select.mockResolvedValue({ data: null, error: mockError });

            await expect(eventsDAO.getEvents()).rejects.toThrow('Database error');
        });
    });

    describe('addEvent', () => {
        it('should add a new event', async () => {
            const newEvent: TablesInsert<'Events'> = {
                name: 'New Event',
                admin_id: 1,
                description: 'New Description',
                is_recurring: false
            };
            const insertedEvent: Tables<'Events'> = { id: 3, ...newEvent };
            mockChain.single.mockResolvedValue({ data: insertedEvent, error: null });

            const result = await eventsDAO.addEvent(newEvent);

            expect(result).toEqual(insertedEvent);
            expect(mockSupabase.from).toHaveBeenCalledWith('Events');
            expect(mockChain.insert).toHaveBeenCalledWith(newEvent);
            expect(mockChain.select).toHaveBeenCalled();
            expect(mockChain.single).toHaveBeenCalled();
        });

        it('should throw an error if the insert fails', async () => {
            const newEvent: TablesInsert<'Events'> = {
                name: 'New Event',
                admin_id: 1,
                description: 'New Description',
                is_recurring: false
            };
            const mockError = new Error('Insert failed');
            mockChain.single.mockResolvedValue({ data: null, error: mockError });

            await expect(eventsDAO.addEvent(newEvent)).rejects.toThrow('Insert failed');
        });

        it('should throw an error if no data is returned after insert', async () => {
            const newEvent: TablesInsert<'Events'> = {
                name: 'New Event',
                admin_id: 1,
                description: 'New Description',
                is_recurring: false
            };
            mockChain.single.mockResolvedValue({ data: null, error: null });

            await expect(eventsDAO.addEvent(newEvent)).rejects.toThrow('Failed to add event');
        });
    });

    describe('updateEvent', () => {
        it('should update an existing event', async () => {
            const updatedEvent: TablesUpdate<'Events'> = { name: 'Updated Event' };
            const resultEvent: Tables<'Events'> = {
                id: 1,
                name: 'Updated Event',
                admin_id: 1,
                description: 'Description',
                is_recurring: false
            };
            mockChain.single.mockResolvedValue({ data: resultEvent, error: null });

            const result = await eventsDAO.updateEvent(1, updatedEvent);

            expect(result).toEqual(resultEvent);
            expect(mockSupabase.from).toHaveBeenCalledWith('Events');
            expect(mockChain.update).toHaveBeenCalledWith(updatedEvent);
            expect(mockChain.eq).toHaveBeenCalledWith('id', 1);
            expect(mockChain.select).toHaveBeenCalled();
            expect(mockChain.single).toHaveBeenCalled();
        });

        it('should throw an error if the update fails', async () => {
            const updatedEvent: TablesUpdate<'Events'> = { name: 'Updated Event' };
            const mockError = new Error('Update failed');
            mockChain.single.mockResolvedValue({ data: null, error: mockError });

            await expect(eventsDAO.updateEvent(1, updatedEvent)).rejects.toThrow('Update failed');
        });

        it('should throw an error if no data is returned after update', async () => {
            const updatedEvent: TablesUpdate<'Events'> = { name: 'Updated Event' };
            mockChain.single.mockResolvedValue({ data: null, error: null });

            await expect(eventsDAO.updateEvent(1, updatedEvent)).rejects.toThrow('Failed to update event');
        });
    });

    describe('deleteEvent', () => {
        it('should delete an event', async () => {
            mockChain.eq.mockResolvedValue({ error: null });

            await expect(eventsDAO.deleteEvent(1)).resolves.not.toThrow();

            expect(mockSupabase.from).toHaveBeenCalledWith('Events');
            expect(mockChain.delete).toHaveBeenCalled();
            expect(mockChain.eq).toHaveBeenCalledWith('id', 1);
        });

        it('should throw an error if the delete fails', async () => {
            const mockError = new Error('Delete failed');
            mockChain.eq.mockResolvedValue({ error: mockError });

            await expect(eventsDAO.deleteEvent(1)).rejects.toThrow('Delete failed');
        });
    });
});