import { addEvent, updateEvent, deleteEvent, getEvent, getEvents, getAdminEvents, getEventOccurrences, getEventOccurrencesByEventId, getEventOccurrence, updateEventOccurrence, deleteEventOccurrence, getEventVendors, getEventOccurrenceVendors, FormState } from '@/actions/event';
import { EventService } from '@/services/events';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SupabaseDAOFactory } from "@/DAO/supabase/SupabaseDAOFactory";
import { createClient } from "@/utils/supabase/server";

jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));
jest.mock('@/utils/supabase/server', () => ({
    createClient: jest.fn(() => ({
        auth: {
            getUser: jest.fn(() => ({
                data: { user: { id: '95d06b81-afdf-4ed5-9409-1137b7cd2238' } }
            }))
        }
    }))
}));
jest.mock('@/services/events');
jest.mock('@/DAO/supabase/SupabaseDAOFactory');

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
            getAllEvents: jest.fn(),
            getAdminEvents: jest.fn(),
            getAllEventOccurrences: jest.fn(),
            getEventOccurrencesByEventId: jest.fn(),
            getEventOccurrence: jest.fn(),
            updateEventOccurrence: jest.fn(),
            getEventVendors: jest.fn(),
            getEventOccurrenceVendors: jest.fn(),
        } as any;

        mockDAOFactory = new SupabaseDAOFactory() as jest.Mocked<SupabaseDAOFactory>;
        (SupabaseDAOFactory as jest.MockedClass<typeof SupabaseDAOFactory>)
            .mockImplementation(() => mockDAOFactory);
        (EventService as jest.MockedClass<typeof EventService>)
            .mockImplementation(() => mockEventService);
    });

    describe('Event CRUD Operations', () => {
        describe('addEvent', () => {
            it('validates and adds event with picture', async () => {
                const formData = new FormData();
                formData.append('name', 'Test Event');
                formData.append('description', 'Test Description');
                formData.append('picture', new File(['test'], 'test.png', { type: 'image/png' }));

                const result = await addEvent({}, formData);

                expect(result).toEqual({ message: 'Event added successfully!' });
                expect(mockEventService.addEvent).toHaveBeenCalled();
                expect(revalidatePath).toHaveBeenCalledWith('/events');
            });

            it('returns validation errors for invalid input', async () => {
                const formData = new FormData();
                formData.append('name', '');
                formData.append('description', '');

                const result = await addEvent({}, formData);

                expect(result.errors).toBeDefined();
                expect(mockEventService.addEvent).not.toHaveBeenCalled();
            });
        });

        describe('updateEvent', () => {
            it('validates and updates event', async () => {
                const formData = new FormData();
                formData.append('id', '1');
                formData.append('name', 'Updated Event');
                formData.append('description', 'Updated Description');

                const result = await updateEvent({} as FormState, formData);

                expect(result).toEqual({ message: 'Event updated successfully!' });
                expect(mockEventService.updateEvent).toHaveBeenCalled();
            });

            it('handles optional picture update', async () => {
                const formData = new FormData();
                formData.append('id', '1');
                formData.append('name', 'Updated Event');
                formData.append('description', 'Updated Description');
                formData.append('picture', new File(['test'], 'test.png'));

                await updateEvent({} as FormState, formData);

                expect(mockEventService.updateEvent).toHaveBeenCalledWith(
                    1,
                    expect.any(Object),
                    expect.any(File)
                );
            });
        });

        describe('deleteEvent', () => {
            it('deletes event and redirects', async () => {
                const formData = new FormData();
                formData.append('id', '1');

                await deleteEvent({}, formData);

                expect(mockEventService.deleteEvent).toHaveBeenCalledWith(1);
                expect(redirect).toHaveBeenCalledWith('/admin/events');
            });

            it('handles invalid ID', async () => {
                const formData = new FormData();
                formData.append('id', 'invalid');

                await expect(deleteEvent({}, formData)).rejects.toThrow('Invalid event ID');
            });
        });
    });

    describe('Event Occurrence Operations', () => {
        describe('updateEventOccurrence', () => {
            it('validates and updates occurrence', async () => {
                const formData = new FormData();
                formData.append('id', '1');
                formData.append('description', 'Updated Description');
                formData.append('startTime', '2024-01-01T10:00:00Z');
                formData.append('endTime', '2024-01-01T12:00:00Z');

                const result = await updateEventOccurrence({} as FormState, formData);

                expect(result).toEqual({ message: 'Event updated successfully!' });
                expect(mockEventService.updateEventOccurrence).toHaveBeenCalled();
            });
        });

        describe('deleteEventOccurrence', () => {
            it('deletes occurrence and redirects', async () => {
                const formData = new FormData();
                formData.append('id', '1');
                formData.append('eventId', '2');

                await deleteEventOccurrence({}, formData);

                expect(mockEventService.deleteEvent).toHaveBeenCalledWith(1);
                expect(redirect).toHaveBeenCalledWith('/admin/events/2');
            });
        });
    });

    describe('Query Operations', () => {
        const mockEvent = {
            id: 1,
            name: 'Test Event',
            description: 'Test Description'
        };

        it('gets single event', async () => {
            mockEventService.getEvent.mockResolvedValue(mockEvent);
            const result = await getEvent(1);
            expect(result).toEqual(mockEvent);
        });

        it('gets all events', async () => {
            mockEventService.getAllEvents.mockResolvedValue([mockEvent]);
            const result = await getEvents();
            expect(result).toEqual([mockEvent]);
        });

        it('gets admin events', async () => {
            mockEventService.getAdminEvents.mockResolvedValue([mockEvent]);
            const result = await getAdminEvents('admin-id');
            expect(result).toEqual([mockEvent]);
        });

        it('gets event occurrences', async () => {
            const mockOccurrence = { id: 1, event_id: 1 };
            mockEventService.getAllEventOccurrences.mockResolvedValue([mockOccurrence]);
            const result = await getEventOccurrences();
            expect(result).toEqual([mockOccurrence]);
        });

        it('gets event vendors', async () => {
            const mockVendor = { id: 1, name: 'Vendor' };
            mockEventService.getEventVendors.mockResolvedValue([mockVendor]);
            const result = await getEventVendors(1);
            expect(result).toEqual([mockVendor]);
        });

        it('gets occurrence vendors', async () => {
            const mockVendor = { id: 1, name: 'Vendor' };
            mockEventService.getEventOccurrenceVendors.mockResolvedValue([mockVendor]);
            const result = await getEventOccurrenceVendors(1);
            expect(result).toEqual([mockVendor]);
        });
    });
});