import { SupabaseEventOccurrenceDAO } from '@/DAO/supabase/SupabaseEventOccurrenceDAO';
import { createClient } from '@/utils/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '../../../../types/database.types';

jest.mock('@/utils/supabase/server');

describe('SupabaseEventOccurrenceDAO', () => {
    let eventOccurrenceDAO: SupabaseEventOccurrenceDAO;
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
        eventOccurrenceDAO = new SupabaseEventOccurrenceDAO();
    });

    describe('getEventOccurrences', () => {
        it('should return all event occurrences', async () => {
            const mockData: Tables<'EventOccurrences'>[] = [
                { id: 1, event_id: 1, start_time: '2023-01-01T10:00:00', end_time: '2023-01-01T12:00:00', created_at: '2023-01-01T00:00:00' },
                { id: 2, event_id: 2, start_time: '2023-01-02T14:00:00', end_time: '2023-01-02T16:00:00', created_at: '2023-01-02T00:00:00' },
            ];
            mockChain.select.mockResolvedValue({ data: mockData, error: null });

            const result = await eventOccurrenceDAO.getEventOccurrences();

            expect(result).toEqual(mockData);
            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Occurrences');
            expect(mockChain.select).toHaveBeenCalled();
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error('Database error');
            mockChain.select.mockResolvedValue({ data: null, error: mockError });

            await expect(eventOccurrenceDAO.getEventOccurrences()).rejects.toThrow('Database error');
        });
    });

    describe('getEventOccurrencesByEventId', () => {
        it('should return event occurrences for a specific event', async () => {
            const mockData: Tables<'EventOccurrences'>[] = [
                { id: 1, event_id: 1, start_time: '2023-01-01T10:00:00', end_time: '2023-01-01T12:00:00', created_at: '2023-01-01T00:00:00' },
                { id: 2, event_id: 1, start_time: '2023-01-02T10:00:00', end_time: '2023-01-02T12:00:00', created_at: '2023-01-02T00:00:00' },
            ];
            mockChain.eq.mockResolvedValue({ data: mockData, error: null });

            const result = await eventOccurrenceDAO.getEventOccurrencesByEventId(1);

            expect(result).toEqual(mockData);
            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Occurrences');
            expect(mockChain.select).toHaveBeenCalled();
            expect(mockChain.eq).toHaveBeenCalledWith('event_id', 1);
        });

        it('should return an empty array if no occurrences are found', async () => {
            mockChain.eq.mockResolvedValue({ data: [], error: null });

            const result = await eventOccurrenceDAO.getEventOccurrencesByEventId(999);

            expect(result).toEqual([]);
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error('Database error');
            mockChain.eq.mockResolvedValue({ data: null, error: mockError });

            await expect(eventOccurrenceDAO.getEventOccurrencesByEventId(1)).rejects.toThrow('Database error');
        });
    });

    describe('addEventOccurrence', () => {
        it('should add a new event occurrence', async () => {
            const newEventOccurrence: TablesInsert<'EventOccurrences'> = {
                event_id: 1,
                start_time: '2023-01-03T10:00:00',
                end_time: '2023-01-03T12:00:00',
            };
            const insertedEventOccurrence: Tables<'EventOccurrences'> = {
                id: 3,
                ...newEventOccurrence,
                created_at: '2023-01-03T00:00:00',
            };
            mockChain.single.mockResolvedValue({ data: insertedEventOccurrence, error: null });

            const result = await eventOccurrenceDAO.addEventOccurrence(newEventOccurrence);

            expect(result).toEqual(insertedEventOccurrence);
            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Occurrences');
            expect(mockChain.insert).toHaveBeenCalledWith(newEventOccurrence);
            expect(mockChain.select).toHaveBeenCalled();
            expect(mockChain.single).toHaveBeenCalled();
        });

        it('should throw an error if the insert fails', async () => {
            const newEventOccurrence: TablesInsert<'EventOccurrences'> = {
                event_id: 1,
                start_time: '2023-01-03T10:00:00',
                end_time: '2023-01-03T12:00:00',
            };
            const mockError = new Error('Insert failed');
            mockChain.single.mockResolvedValue({ data: null, error: mockError });

            await expect(eventOccurrenceDAO.addEventOccurrence(newEventOccurrence)).rejects.toThrow('Insert failed');
        });
    });

    describe('updateEventOccurrence', () => {
        it('should update an existing event occurrence', async () => {
            const updatedEventOccurrence: TablesUpdate<'EventOccurrences'> = {
                start_time: '2023-01-03T11:00:00',
                end_time: '2023-01-03T13:00:00',
            };
            const resultEventOccurrence: Tables<'EventOccurrences'> = {
                id: 1,
                event_id: 1,
                ...updatedEventOccurrence,
                created_at: '2023-01-01T00:00:00',
            };
            mockChain.single.mockResolvedValue({ data: resultEventOccurrence, error: null });

            const result = await eventOccurrenceDAO.updateEventOccurrence(1, updatedEventOccurrence);

            expect(result).toEqual(resultEventOccurrence);
            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Occurrences');
            expect(mockChain.update).toHaveBeenCalledWith(updatedEventOccurrence);
            expect(mockChain.eq).toHaveBeenCalledWith('id', 1);
            expect(mockChain.select).toHaveBeenCalled();
            expect(mockChain.single).toHaveBeenCalled();
        });

        it('should throw an error if the update fails', async () => {
            const updatedEventOccurrence: TablesUpdate<'EventOccurrences'> = {
                start_time: '2023-01-03T11:00:00',
                end_time: '2023-01-03T13:00:00',
            };
            const mockError = new Error('Update failed');
            mockChain.single.mockResolvedValue({ data: null, error: mockError });

            await expect(eventOccurrenceDAO.updateEventOccurrence(1, updatedEventOccurrence)).rejects.toThrow('Update failed');
        });
    });

    describe('deleteEventOccurrence', () => {
        it('should delete an event occurrence', async () => {
            mockChain.eq.mockResolvedValue({ error: null });

            await expect(eventOccurrenceDAO.deleteEventOccurrence(1)).resolves.not.toThrow();

            expect(mockSupabase.from).toHaveBeenCalledWith('Event_Occurrences');
            expect(mockChain.delete).toHaveBeenCalled();
            expect(mockChain.eq).toHaveBeenCalledWith('id', 1);
        });

        it('should throw an error if the delete fails', async () => {
            const mockError = new Error('Delete failed');
            mockChain.eq.mockResolvedValue({ error: mockError });

            await expect(eventOccurrenceDAO.deleteEventOccurrence(1)).rejects.toThrow('Delete failed');
        });
    });
});