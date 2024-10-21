import { addEvent, updateEvent, deleteEvent, getEvent, FormState } from '@/actions/event';
import { EventService } from '@/services/events';
import { TablesInsert, TablesUpdate } from '../../../types/database.types';
import {SupabaseDAOFactory} from "@/DAO/supabase/SupabaseDAOFactory";

// Mock Next.js modules and functions
jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));

jest.mock('next/headers', () => ({
    cookies: () => ({
        get: jest.fn(),
        set: jest.fn(),
    }),
}));

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
    createServerClient: jest.fn(() => ({
        // Add mock methods as needed
    })),
}));

// Mock the EventService
jest.mock('@/services/events');

// Mock the DAO factory
jest.mock('@/DAO/supabase/SupabaseDAOFactory', () => ({
    SupabaseDAOFactory: jest.fn().mockImplementation(() => ({
        getEventsDAO: jest.fn().mockReturnValue({
            // Mock DAO methods as needed
        }),
        getBucketsDAO: jest.fn().mockReturnValue({
            // Mock DAO methods as needed
        }),
    })),
}));

describe('Event Actions', () => {
    let mockEventService: jest.Mocked<EventService>;
    let mockDAOFactory: jest.Mocked<SupabaseDAOFactory>;

    beforeEach(() => {
        mockEventService = {
            addEvent: jest.fn(),
            updateEvent: jest.fn(),
            deleteEvent: jest.fn(),
            getEvent: jest.fn(),
        } as any;

        mockDAOFactory = {
            getEventsDAO: jest.fn(),
            getBucketDAO: jest.fn(),
        } as any;

        (SupabaseDAOFactory as jest.MockedClass<typeof SupabaseDAOFactory>).mockImplementation(() => mockDAOFactory);
        (EventService as jest.MockedClass<typeof EventService>).mockImplementation(() => mockEventService);
    });

    describe('addEvent', () => {
        it('should add an event successfully', async () => {
            const formData = new FormData();
            formData.append('name', 'Test Event');
            formData.append('description', 'Test Description');
            formData.append('admin_id', '1');

            const file = new File(['test'], 'test.png', { type: 'image/png' });
            formData.append('picture', file);

            mockEventService.addEvent.mockResolvedValue({ id: 1, name: 'Test Event' });

            const result = await addEvent({} as FormState, formData);

            expect(result.message).toBe('Event added successfully!');
            expect(mockEventService.addEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Test Event',
                    description: 'Test Description',
                    admin_id: 1,
                }),
                expect.any(File)
            );
        });

        it('should handle errors when adding an event', async () => {
            const formData = new FormData();
            // Intentionally missing required fields

            const result = await addEvent({} as FormState, formData);

            expect(result.errors).toBeDefined();
            expect(mockEventService.addEvent).not.toHaveBeenCalled();
        });
    });

    describe('updateEvent', () => {
        it('should update an event successfully', async () => {
            const formData = new FormData();
            formData.append('id', '1');
            formData.append('name', 'Updated Event');
            formData.append('description', 'Updated Description');
            formData.append('admin_id', '2');

            mockEventService.updateEvent.mockResolvedValue({ id: 1, name: 'Updated Event' });

            const result = await updateEvent({} as FormState, formData);

            expect(result.message).toBe('Event updated successfully!');
            expect(mockEventService.updateEvent).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    name: 'Updated Event',
                    description: 'Updated Description',
                    admin_id: 2,
                }),
                undefined
            );
        });

        it('should handle errors when updating an event', async () => {
            const formData = new FormData();
            formData.append('id', 'invalid');

            const result = await updateEvent({} as FormState, formData);

            expect(result.errors).toBeDefined();
            expect(mockEventService.updateEvent).not.toHaveBeenCalled();
        });
    });

    describe('deleteEvent', () => {
        it('should delete an event successfully', async () => {
            const formData = new FormData();
            formData.append('id', '1');

            await deleteEvent(null, formData);

            expect(mockEventService.deleteEvent).toHaveBeenCalledWith(1);
        });

        it('should handle errors when deleting an event', async () => {
            const formData = new FormData();
            formData.append('id', 'invalid');

            await expect(deleteEvent(null, formData)).rejects.toThrow();
            expect(mockEventService.deleteEvent).not.toHaveBeenCalled();
        });
    });

    describe('getEvent', () => {
        it('should get an event successfully', async () => {
            const mockEvent = {
                id: 1,
                name: 'Test Event',
                description: 'Test Description',
                admin_id: 1,
                pictureUrl: 'http://test.com/image.jpg'
            };

            mockEventService.getEvent.mockResolvedValue(mockEvent);

            const result = await getEvent(1);

            expect(result).toEqual(mockEvent);
            expect(mockEventService.getEvent).toHaveBeenCalledWith(1);
        });

        it('should handle errors when getting an event', async () => {
            mockEventService.getEvent.mockRejectedValue(new Error('Event not found'));

            const result = await getEvent(999);

            expect(result).toEqual({ error: 'Event not found' });
            expect(mockEventService.getEvent).toHaveBeenCalledWith(999);
        });
    });
});