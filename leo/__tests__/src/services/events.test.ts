import { EventService } from '@/services/events';
import { EventsDAO } from "@/DAO/interface/EventsDAO";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";
import { BucketDAO } from "@/DAO/interface/BucketDAO";
import { EventOccurrenceDAO } from "@/DAO/interface/EventOccurrenceDAO";
import { EventVendorDAO } from "@/DAO/interface/EventVendorDAO";
import { EventOccurrenceVendorDAO } from "@/DAO/interface/EventOccurrenceVendorDAO";

const mockEventsDAO: jest.Mocked<EventsDAO> = {
    getEvents: jest.fn(),
    getEvent: jest.fn(),
    getUserEvents: jest.fn(),
    addEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
};

const mockBucketDAO: jest.Mocked<BucketDAO> = {
    getFile: jest.fn(),
    addFile: jest.fn(),
    updateFile: jest.fn(),
    deleteFile: jest.fn(),
};

const mockEventOccurrenceDAO: jest.Mocked<EventOccurrenceDAO> = {
    getEventOccurrencesByEventId: jest.fn(),
    getEventOccurrences: jest.fn(),
    getEventOccurrence: jest.fn(),
    addEventOccurrence: jest.fn(),
    updateEventOccurrence: jest.fn(),
    deleteEventOccurrence: jest.fn(),
};

const mockEventVendorDAO: jest.Mocked<EventVendorDAO> = {
    getEventVendors: jest.fn(),
    getEventsByVendorId: jest.fn(),
    getVendorsByEventId: jest.fn(),
    addEventVendor: jest.fn(),
    updateEventVendor: jest.fn(),
    deleteEventVendor: jest.fn(),
};

const mockEventOccurrenceVendorDAO: jest.Mocked<EventOccurrenceVendorDAO> = {
    getEventOccurrenceVendors: jest.fn(),
    getVendorsByEventOccurrenceId: jest.fn(),
    addEventOccurrenceVendor: jest.fn(),
    updateEventOccurrenceVendor: jest.fn(),
    deleteEventOccurrenceVendor: jest.fn(),
};

describe('EventService', () => {
    let eventService: EventService;

    beforeEach(() => {
        jest.clearAllMocks();
        eventService = new EventService(
            mockEventsDAO,
            mockBucketDAO,
            mockEventOccurrenceDAO,
            mockEventVendorDAO,
            mockEventOccurrenceVendorDAO
        );
    });

    describe('Event Management', () => {
        const mockEvent: Tables<'Events'> = {
            id: 1,
            name: 'Test Event',
            description: 'Test Description',
            admin_id: '1',
            photo_url: 'http://test.com/image.jpg',
            is_recurring: false,
            recurrence_pattern: null
        };

        describe('getEvent', () => {
            it('should return an event', async () => {
                mockEventsDAO.getEvent.mockResolvedValue(mockEvent);
                const result = await eventService.getEvent(1);
                expect(result).toEqual(mockEvent);
            });

            it('should throw an error if event is not found', async () => {
                mockEventsDAO.getEvent.mockResolvedValue(null);
                await expect(eventService.getEvent(1)).rejects.toThrow('Event with id 1 not found');
            });
        });

        describe('getAllEvents', () => {
            it('should return all events', async () => {
                const mockEvents = [mockEvent];
                mockEventsDAO.getEvents.mockResolvedValue(mockEvents);
                const result = await eventService.getAllEvents();
                expect(result).toEqual(mockEvents);
            });
        });

        describe('getAdminEvents', () => {
            it('should return events for an admin', async () => {
                const adminId = '1';
                const mockEvents = [mockEvent];
                mockEventsDAO.getUserEvents.mockResolvedValue(mockEvents);
                const result = await eventService.getAdminEvents(adminId);
                expect(result).toEqual(mockEvents);
                expect(mockEventsDAO.getUserEvents).toHaveBeenCalledWith(adminId);
            });
        });

        describe('addEvent', () => {
            it('should add an event with picture', async () => {
                const mockEventData: TablesInsert<'Events'> = {
                    name: 'New Event',
                    description: 'New Description',
                    admin_id: '1',
                    is_recurring: false
                };
                const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
                const mockPhotoUrl = 'http://test.com/new-image.jpg';

                mockBucketDAO.addFile.mockResolvedValue({ publicUrl: mockPhotoUrl });
                mockEventsDAO.addEvent.mockResolvedValue({ ...mockEventData, id: 1, photo_url: mockPhotoUrl });

                const result = await eventService.addEvent(mockEventData, mockFile);
                expect(result.photo_url).toBe(mockPhotoUrl);
                expect(mockBucketDAO.addFile).toHaveBeenCalledWith(mockFile);
            });
        });

        describe('updateEvent', () => {
            it('should update an event with new picture', async () => {
                const mockUpdate: TablesUpdate<'Events'> = { name: 'Updated Event' };
                const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
                const newPhotoUrl = 'http://test.com/new-image.jpg';

                mockEventsDAO.getEvent.mockResolvedValue(mockEvent);
                mockBucketDAO.addFile.mockResolvedValue({ publicUrl: newPhotoUrl });
                mockEventsDAO.updateEvent.mockResolvedValue({ ...mockEvent, ...mockUpdate, photo_url: newPhotoUrl });

                const result = await eventService.updateEvent(1, mockUpdate, mockFile);
                expect(result.photo_url).toBe(newPhotoUrl);
                expect(mockBucketDAO.deleteFile).toHaveBeenCalled();
                expect(mockBucketDAO.addFile).toHaveBeenCalledWith(mockFile);
            });
        });

        describe('deleteEvent', () => {
            it('should handle event deletion with cleanup', async () => {
                const mockOccurrences = [
                    { id: 1, event_id: 1 },
                    { id: 2, event_id: 1 }
                ];

                mockEventsDAO.getEvent.mockResolvedValue(mockEvent);
                mockEventOccurrenceDAO.getEventOccurrencesByEventId.mockResolvedValue(mockOccurrences);

                await eventService.deleteEvent(1);

                expect(mockEventOccurrenceDAO.deleteEventOccurrence).toHaveBeenCalledTimes(2);
                expect(mockEventsDAO.deleteEvent).toHaveBeenCalledWith(1);
                expect(mockBucketDAO.deleteFile).toHaveBeenCalledWith('image.jpg');
            });
        });
    });

    describe('Event Occurrence Management', () => {
        const mockOccurrence: Tables<'Event_Occurrences'> = {
            id: 1,
            event_id: 1,
            start_time: '2024-01-01T10:00:00Z',
            end_time: '2024-01-01T12:00:00Z',
            created_at: '2024-01-01T00:00:00Z',
            description: 'Test occurrence',
            latitude: null,
            longitude: null
        };

        describe('getAllEventOccurrences', () => {
            it('should return all occurrences', async () => {
                mockEventOccurrenceDAO.getEventOccurrences.mockResolvedValue([mockOccurrence]);
                const result = await eventService.getAllEventOccurrences();
                expect(result).toEqual([mockOccurrence]);
            });
        });

        describe('getEventOccurrencesByEventId', () => {
            it('should return occurrences for an event', async () => {
                mockEventOccurrenceDAO.getEventOccurrencesByEventId.mockResolvedValue([mockOccurrence]);
                const result = await eventService.getEventOccurrencesByEventId(1);
                expect(result).toEqual([mockOccurrence]);
            });
        });

        describe('getEventOccurrence', () => {
            it('should return a specific occurrence', async () => {
                mockEventOccurrenceDAO.getEventOccurrence.mockResolvedValue(mockOccurrence);
                const result = await eventService.getEventOccurrence(1);
                expect(result).toEqual(mockOccurrence);
            });

            it('should throw error if occurrence not found', async () => {
                mockEventOccurrenceDAO.getEventOccurrence.mockResolvedValue(null);
                await expect(eventService.getEventOccurrence(1))
                    .rejects.toThrow('EventOccurrence with id 1 not found');
            });
        });

        describe('addEventOccurrence', () => {
            const newOccurrence: TablesInsert<'Event_Occurrences'> = {
                event_id: 1,
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-01T12:00:00Z',
                description: 'New occurrence'
            };

            it('should validate dates and add occurrence', async () => {
                mockEventsDAO.getEvent.mockResolvedValue({ id: 1 });
                mockEventOccurrenceDAO.addEventOccurrence.mockResolvedValue({ ...newOccurrence, id: 1 });

                const result = await eventService.addEventOccurrence(newOccurrence);
                expect(result).toBeDefined();
                expect(mockEventOccurrenceDAO.addEventOccurrence).toHaveBeenCalled();
            });

            it('should reject invalid date range', async () => {
                const invalidOccurrence = {
                    ...newOccurrence,
                    start_time: '2024-01-01T12:00:00Z',
                    end_time: '2024-01-01T10:00:00Z'
                };

                mockEventsDAO.getEvent.mockResolvedValue({ id: 1 });

                await expect(eventService.addEventOccurrence(invalidOccurrence))
                    .rejects.toThrow('End time must be after start time');
            });
        });

        describe('updateEventOccurrence', () => {
            it('should validate and update occurrence', async () => {
                const update: TablesUpdate<'Event_Occurrences'> = {
                    start_time: '2024-01-01T14:00:00Z',
                    end_time: '2024-01-01T16:00:00Z'
                };

                mockEventOccurrenceDAO.getEventOccurrences.mockResolvedValue([mockOccurrence]);
                mockEventOccurrenceDAO.updateEventOccurrence.mockResolvedValue({ ...mockOccurrence, ...update });

                const result = await eventService.updateEventOccurrence(1, update);
                expect(result).toBeDefined();
                expect(mockEventOccurrenceDAO.updateEventOccurrence).toHaveBeenCalled();
            });
        });

        describe('deleteEventOccurrence', () => {
            it('should delete occurrence', async () => {
                await eventService.deleteEventOccurrence(1);
                expect(mockEventOccurrenceDAO.deleteEventOccurrence).toHaveBeenCalledWith(1);
            });
        });
    });

    describe('Vendor Management', () => {
        describe('Event Vendors', () => {
            it('should add vendor to event', async () => {
                const mockEventVendor = { vendor_id: 1, event_id: 1, booth_number: 101 };
                mockEventVendorDAO.addEventVendor.mockResolvedValue(mockEventVendor);

                const result = await eventService.addVendorToEvent(1, 1, 101);
                expect(result).toEqual(mockEventVendor);
            });

            it('should get vendors for event', async () => {
                const mockVendors = [{ id: 1, name: 'Vendor 1' }];
                mockEventVendorDAO.getVendorsByEventId.mockResolvedValue(mockVendors);

                const result = await eventService.getEventVendors(1);
                expect(result).toEqual(mockVendors);
            });

            it('should remove vendor from event', async () => {
                await eventService.removeVendorFromEvent(1, 1);
                expect(mockEventVendorDAO.deleteEventVendor).toHaveBeenCalledWith(1, 1);
            });
        });

        describe('Event Occurrence Vendors', () => {
            it('should add vendor to occurrence', async () => {
                const mockOccurrenceVendor = {
                    vendor_id: 1,
                    event_occurrence_id: 1,
                    booth_number: 101
                };
                mockEventOccurrenceVendorDAO.addEventOccurrenceVendor.mockResolvedValue(mockOccurrenceVendor);

                const result = await eventService.addVendorToEventOccurrence(1, 1, 101);
                expect(result).toEqual(mockOccurrenceVendor);
            });

            it('should get vendors for occurrence', async () => {
                const mockVendors = [{ id: 1, name: 'Vendor 1' }];
                mockEventOccurrenceVendorDAO.getVendorsByEventOccurrenceId.mockResolvedValue(mockVendors);

                const result = await eventService.getEventOccurrenceVendors(1);
                expect(result).toEqual(mockVendors);
            });

            it('should remove vendor from occurrence', async () => {
                await eventService.removeVendorFromEventOccurrence(1, 1);
                expect(mockEventOccurrenceVendorDAO.deleteEventOccurrenceVendor)
                    .toHaveBeenCalledWith(1, 1);
            });
        });
    });
});