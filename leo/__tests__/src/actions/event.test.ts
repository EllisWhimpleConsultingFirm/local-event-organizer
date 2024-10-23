import { addEvent, updateEvent, deleteEvent, getEvent, FormState } from '@/actions/event';
import { EventService } from '@/services/events';
import { revalidatePath } from 'next/cache';
import { SupabaseDAOFactory } from "@/DAO/supabase/SupabaseDAOFactory";

// Mock Next.js cache
jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));

// Mock Next.js headers
jest.mock('next/headers', () => ({
    cookies: () => ({
        get: jest.fn(),
        set: jest.fn(),
    }),
}));

// Mock EventService
jest.mock('@/services/events');

// Mock DAOFactory
jest.mock('@/DAO/supabase/SupabaseDAOFactory', () => ({
    SupabaseDAOFactory: jest.fn().mockImplementation(() => ({
        getEventsDAO: jest.fn(),
        getBucketDAO: jest.fn(),
        getEventOccurrencesDAO: jest.fn(),
        getEventVendorDAO: jest.fn(),
    })),
}));

describe('Event Actions', () => {
    let mockEventService: jest.Mocked<EventService>;
    let mockDAOFactory: jest.Mocked<SupabaseDAOFactory>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockEventService = {
            addEvent: jest.fn(),
            updateEvent: jest.fn(),
            deleteEvent: jest.fn(),
            getEvent: jest.fn(),
            getEventOccurrences: jest.fn(),
        } as any;

        mockDAOFactory = {
            getEventsDAO: jest.fn(),
            getBucketDAO: jest.fn(),
            getEventOccurrencesDAO: jest.fn(),
            getEventVendorDAO: jest.fn(),
        } as any;

        (SupabaseDAOFactory as jest.MockedClass<typeof SupabaseDAOFactory>)
            .mockImplementation(() => mockDAOFactory);
        (EventService as jest.MockedClass<typeof EventService>)
            .mockImplementation(() => mockEventService);
    });

    describe('addEvent', () => {
        it('should add an event successfully', async () => {
            const formData = new FormData();
            formData.append('name', 'Test Event');
            formData.append('description', 'Test Description');
            formData.append('admin_id', '1');
            formData.append('picture', new File(['test'], 'test.png', { type: 'image/png' }));

            const result = await addEvent({}, formData);

            expect(result).toEqual({ message: 'Event added successfully!' });
            expect(mockEventService.addEvent).toHaveBeenCalledWith(
                {
                    name: 'Test Event',
                    description: 'Test Description',
                    admin_id: 1,
                },
                expect.any(File)
            );
            expect(revalidatePath).toHaveBeenCalledWith('/events');
        });

        it('should return validation errors for missing required fields', async () => {
            const formData = new FormData();
            formData.append('name', '');
            formData.append('description', '');
            formData.append('admin_id', 'invalid');

            const result = await addEvent({}, formData);

            expect(result.errors).toBeDefined();
            expect(result.errors).toMatchObject({
                name: expect.any(Array),
                description: expect.any(Array),
                admin_id: expect.any(Array),
            });
            expect(mockEventService.addEvent).not.toHaveBeenCalled();
        });

        it('should return error for missing picture', async () => {
            const formData = new FormData();
            formData.append('name', 'Test Event');
            formData.append('description', 'Test Description');
            formData.append('admin_id', '1');
            // Intentionally not adding picture

            const result = await addEvent({}, formData);

            expect(result.errors).toMatchObject({
                picture: ['Picture is required'],
            });
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
            const picture = new File(['test'], 'test.png', { type: 'image/png' });
            formData.append('picture', picture);

            const result = await updateEvent({} as FormState, formData);

            expect(result).toEqual({ message: 'Event updated successfully!' });
            expect(mockEventService.updateEvent).toHaveBeenCalledWith(
                1,
                {
                    name: 'Updated Event',
                    description: 'Updated Description',
                    admin_id: 2,
                },
                picture
            );
            expect(revalidatePath).toHaveBeenCalledWith('/events/1');
        });

        it('should handle undefined picture correctly', async () => {
            const formData = new FormData();
            formData.append('id', '1');
            formData.append('name', 'Updated Event');
            formData.append('description', 'Updated Description');
            formData.append('admin_id', '2');
            const undefinedPicture = new File([''], 'undefined', { type: 'image/png' });
            formData.append('picture', undefinedPicture);

            const result = await updateEvent({} as FormState, formData);

            expect(result).toEqual({ message: 'Event updated successfully!' });
            expect(mockEventService.updateEvent).toHaveBeenCalledWith(
                1,
                {
                    name: 'Updated Event',
                    description: 'Updated Description',
                    admin_id: 2,
                },
                undefined
            );
        });

        it('should return validation errors for invalid input', async () => {
            const formData = new FormData();
            formData.append('id', '');
            formData.append('name', '');
            formData.append('description', '');
            formData.append('admin_id', 'invalid');

            const result = await updateEvent({} as FormState, formData);

            expect(result.errors).toBeDefined();
            expect(result.errors).toMatchObject({
                id: expect.any(Array),
                name: expect.any(Array),
                description: expect.any(Array),
                admin_id: expect.any(Array),
            });
            expect(mockEventService.updateEvent).not.toHaveBeenCalled();
        });
    });

    describe('deleteEvent', () => {
        it('should delete an event successfully', async () => {
            const formData = new FormData();
            formData.append('id', '1');

            await deleteEvent({}, formData);

            expect(mockEventService.deleteEvent).toHaveBeenCalledWith(1);
            expect(revalidatePath).toHaveBeenCalledWith('/events');
        });

        it('should handle invalid event ID', async () => {
            const formData = new FormData();
            formData.append('id', 'invalid');

            await expect(deleteEvent({}, formData))
                .rejects
                .toThrow('Invalid event ID');

            expect(mockEventService.deleteEvent).not.toHaveBeenCalled();
        });

        it('should return error message when deletion fails', async () => {
            const formData = new FormData();
            formData.append('id', '1');
            mockEventService.deleteEvent.mockRejectedValue(new Error('Delete failed'));

            const result = await deleteEvent({}, formData);

            expect(result).toEqual({
                message: 'Failed to delete event. Please try again.',
            });
        });
    });

    describe('getEvent', () => {
        it('should get an event successfully', async () => {
            const mockEvent = {
                id: 1,
                name: 'Test Event',
                description: 'Test Description',
                admin_id: 1,
                photo_url: 'http://test.com/image.jpg'
            };

            mockEventService.getEvent.mockResolvedValue(mockEvent);

            const result = await getEvent(1);

            expect(result).toEqual(mockEvent);
            expect(mockEventService.getEvent).toHaveBeenCalledWith(1);
        });

        it('should handle errors when getting an event', async () => {
            const errorMessage = 'Event not found';
            mockEventService.getEvent.mockRejectedValue(new Error(errorMessage));

            const result = await getEvent(999);

            expect(result).toEqual({ error: errorMessage });
            expect(mockEventService.getEvent).toHaveBeenCalledWith(999);
        });
    });
});