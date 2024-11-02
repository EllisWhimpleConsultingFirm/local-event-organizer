import { EventService } from '@/services/events';
import { EventsDAO } from "@/DAO/interface/EventsDAO";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";
import { BucketDAO } from "@/DAO/interface/BucketDAO";
import { EventOccurrenceDAO } from "@/DAO/interface/EventOccurrenceDAO";
import { EventVendorDAO } from "@/DAO/interface/EventVendorDAO";

const mockEventsDAO: jest.Mocked<EventsDAO> = {
    getEvents: jest.fn(),
    getEvent: jest.fn(),
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

describe('EventService', () => {
    let eventService: EventService;

    beforeEach(() => {
        jest.clearAllMocks();
        eventService = new EventService(mockEventsDAO, mockBucketDAO, mockEventOccurrenceDAO, mockEventVendorDAO);
    });

    describe('getEvent', () => {
        it('should return an event', async () => {
            const mockEvent: Tables<'Events'> = {
                id: 1,
                name: 'Test Event',
                description: 'Test Description',
                admin_id: 1,
                photo_url: 'http://test.com/image.jpg',
                is_recurring: false,
                recurrence_pattern: null
            };
            mockEventsDAO.getEvent.mockResolvedValue(mockEvent);

            const result = await eventService.getEvent(1);

            expect(result).toEqual(mockEvent);
            expect(mockEventsDAO.getEvent).toHaveBeenCalledWith(1);
        });

        it('should throw an error if event is not found', async () => {
            mockEventsDAO.getEvent.mockResolvedValue(null);

            await expect(eventService.getEvent(1)).rejects.toThrow('Event with id 1 not found');
        });
    });

    describe('getAllEvents', () => {
        it('should return all events', async () => {
            const mockEvents: Tables<'Events'>[] = [
                {
                    id: 1,
                    name: 'Event 1',
                    description: 'Description 1',
                    admin_id: 1,
                    photo_url: 'http://test.com/image1.jpg',
                    is_recurring: false,
                    recurrence_pattern: null
                },
                {
                    id: 2,
                    name: 'Event 2',
                    description: 'Description 2',
                    admin_id: 1,
                    photo_url: 'http://test.com/image2.jpg',
                    is_recurring: false,
                    recurrence_pattern: null
                },
            ];
            mockEventsDAO.getEvents.mockResolvedValue(mockEvents);

            const result = await eventService.getAllEvents();

            expect(result).toEqual(mockEvents);
            expect(mockEventsDAO.getEvents).toHaveBeenCalled();
        });
    });

    describe('addEvent', () => {
        it('should add an event with picture', async () => {
            const mockEventData: TablesInsert<'Events'> = {
                name: 'New Event',
                description: 'New Description',
                admin_id: 1,
                is_recurring: false,
                recurrence_pattern: null
            };
            const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
            const mockPhotoUrl = 'http://test.com/new-image.jpg';
            const mockNewEvent: Tables<'Events'> = {
                id: 1,
                ...mockEventData,
                photo_url: mockPhotoUrl
            };

            mockBucketDAO.addFile.mockResolvedValue({ publicUrl: mockPhotoUrl });
            mockEventsDAO.addEvent.mockResolvedValue(mockNewEvent);

            const result = await eventService.addEvent(mockEventData, mockFile);

            expect(result).toEqual(mockNewEvent);
            expect(mockBucketDAO.addFile).toHaveBeenCalledWith(mockFile);
            expect(mockEventsDAO.addEvent).toHaveBeenCalledWith({
                ...mockEventData,
                photo_url: mockPhotoUrl
            });
        });
    });

    describe('updateEvent', () => {
        it('should update an event with new picture', async () => {
            const mockEventData: TablesUpdate<'Events'> = { name: 'Updated Event' };
            const mockFile = new File([''], 'new-test.jpg', { type: 'image/jpeg' });
            const mockOldEvent: Tables<'Events'> = {
                id: 1,
                name: 'Old Event',
                description: 'Description',
                admin_id: 1,
                photo_url: 'http://test.com/old-image.jpg',
                is_recurring: false,
                recurrence_pattern: null
            };
            const mockUpdatedEvent: Tables<'Events'> = {
                ...mockOldEvent,
                name: 'Updated Event',
                photo_url: 'http://test.com/new-image.jpg'
            };

            mockEventsDAO.getEvent.mockResolvedValue(mockOldEvent);
            mockBucketDAO.addFile.mockResolvedValue({ publicUrl: 'http://test.com/new-image.jpg' });
            mockEventsDAO.updateEvent.mockResolvedValue(mockUpdatedEvent);

            const result = await eventService.updateEvent(1, mockEventData, mockFile);

            expect(result).toEqual(mockUpdatedEvent);
            expect(mockBucketDAO.deleteFile).toHaveBeenCalledWith('old-image.jpg');
            expect(mockBucketDAO.addFile).toHaveBeenCalledWith(mockFile);
            expect(mockEventsDAO.updateEvent).toHaveBeenCalledWith(1, {
                ...mockEventData,
                photo_url: 'http://test.com/new-image.jpg'
            });
        });

        it('should update an event without changing the picture', async () => {
            const mockEventData: TablesUpdate<'Events'> = { name: 'Updated Event' };
            const mockOldEvent: Tables<'Events'> = {
                id: 1,
                name: 'Old Event',
                description: 'Description',
                admin_id: 1,
                photo_url: 'http://test.com/old-image.jpg',
                is_recurring: false,
                recurrence_pattern: null
            };
            const mockUpdatedEvent: Tables<'Events'> = {
                ...mockOldEvent,
                name: 'Updated Event'
            };

            mockEventsDAO.getEvent.mockResolvedValue(mockOldEvent);
            mockEventsDAO.updateEvent.mockResolvedValue(mockUpdatedEvent);

            const result = await eventService.updateEvent(1, mockEventData);

            expect(result).toEqual(mockUpdatedEvent);
            expect(mockBucketDAO.deleteFile).not.toHaveBeenCalled();
            expect(mockBucketDAO.addFile).not.toHaveBeenCalled();
            expect(mockEventsDAO.updateEvent).toHaveBeenCalledWith(1, mockEventData);
        });
    });

    describe('deleteEvent', () => {
        it('should delete an event and its picture', async () => {
            const mockEvent: Tables<'Events'> = {
                id: 1,
                name: 'Event',
                description: 'Description',
                admin_id: 1,
                photo_url: 'http://test.com/image.jpg',
                is_recurring: false,
                recurrence_pattern: null
            };

            mockEventsDAO.getEvent.mockResolvedValue(mockEvent);
            mockEventOccurrenceDAO.getEventOccurrencesByEventId.mockResolvedValue([]);

            await eventService.deleteEvent(1);

            expect(mockEventsDAO.deleteEvent).toHaveBeenCalledWith(1);
            expect(mockBucketDAO.deleteFile).toHaveBeenCalledWith('image.jpg');
        });

        it('should delete an event without picture', async () => {
            const mockEvent: Tables<'Events'> = {
                id: 1,
                name: 'Event',
                description: 'Description',
                admin_id: 1,
                photo_url: null,
                is_recurring: false,
                recurrence_pattern: null
            };

            mockEventsDAO.getEvent.mockResolvedValue(mockEvent);
            mockEventOccurrenceDAO.getEventOccurrencesByEventId.mockResolvedValue([]);

            await eventService.deleteEvent(1);

            expect(mockEventsDAO.deleteEvent).toHaveBeenCalledWith(1);
            expect(mockBucketDAO.deleteFile).not.toHaveBeenCalled();
        });

        it('should delete an event, its occurrences, vendor associations and picture', async () => {
            const mockEvent: Tables<'Events'> = {
                id: 1,
                name: 'Event',
                description: 'Description',
                admin_id: 1,
                photo_url: 'http://test.com/image.jpg',
                is_recurring: false,
                recurrence_pattern: null
            };

            const mockOccurrences: Tables<'Event_Occurrences'>[] = [
                {
                    id: 1,
                    event_id: 1,
                    start_time: '2024-01-01',
                    end_time: '2024-01-02',
                    created_at: '2024-01-01',
                    description: null,
                    latitude: null,
                    longitude: null
                },
                {
                    id: 2,
                    event_id: 1,
                    start_time: '2024-02-01',
                    end_time: '2024-02-02',
                    created_at: '2024-01-01',
                    description: null,
                    latitude: null,
                    longitude: null
                }
            ];

            const mockVendors = [
                { vendor_id: 1, event_occurence_id: 1, booth_number: 101 },
                { vendor_id: 2, event_occurence_id: 1, booth_number: 102 }
            ];

            mockEventsDAO.getEvent.mockResolvedValue(mockEvent);
            mockEventOccurrenceDAO.getEventOccurrencesByEventId.mockResolvedValue(mockOccurrences);
            mockEventVendorDAO.getVendorsByEventId.mockResolvedValue(mockVendors);

            await eventService.deleteEvent(1);

            // Verify vendor deletions
            expect(mockEventVendorDAO.deleteEventVendor).toHaveBeenCalledTimes(4);
            expect(mockEventVendorDAO.deleteEventVendor).toHaveBeenNthCalledWith(1, 1, 1);
            expect(mockEventVendorDAO.deleteEventVendor).toHaveBeenNthCalledWith(2, 2, 1);

            // Verify occurrence deletions
            expect(mockEventOccurrenceDAO.deleteEventOccurrence).toHaveBeenCalledTimes(2);
            expect(mockEventOccurrenceDAO.deleteEventOccurrence).toHaveBeenCalledWith(1);
            expect(mockEventOccurrenceDAO.deleteEventOccurrence).toHaveBeenCalledWith(2);

            // Verify event and photo deletion
            expect(mockEventsDAO.deleteEvent).toHaveBeenCalledWith(1);
            expect(mockBucketDAO.deleteFile).toHaveBeenCalledWith('image.jpg');
        });
    });

    describe('Event Occurrence Management', () => {
        describe('getAllEventOccurrences', () => {
            it('should return all event occurrences', async () => {
                const mockOccurrences: Tables<'Event_Occurrences'>[] = [
                    {
                        id: 1,
                        event_id: 1,
                        start_time: '2024-01-01',
                        end_time: '2024-01-02',
                        created_at: '2024-01-01',
                        description: null,
                        latitude: null,
                        longitude: null
                    },
                    {
                        id: 2,
                        event_id: 2,
                        start_time: '2024-02-01',
                        end_time: '2024-02-02',
                        created_at: '2024-01-01',
                        description: null,
                        latitude: null,
                        longitude: null
                    }
                ];

                mockEventOccurrenceDAO.getEventOccurrences.mockResolvedValue(mockOccurrences);

                const result = await eventService.getAllEventOccurrences();
                expect(result).toEqual(mockOccurrences);
                expect(mockEventOccurrenceDAO.getEventOccurrences).toHaveBeenCalled();
            });
        });

        describe('addEventOccurrence', () => {
            it('should add an event occurrence', async () => {
                const mockOccurrence: TablesInsert<'Event_Occurrences'> = {
                    event_id: 1,
                    start_time: '2024-01-01T10:00:00Z',
                    end_time: '2024-01-01T12:00:00Z',
                    description: 'Test occurrence'
                };

                mockEventsDAO.getEvent.mockResolvedValue({
                    id: 1,
                    name: 'Test Event',
                    admin_id: 1,
                    is_recurring: false,
                    recurrence_pattern: null
                });

                mockEventOccurrenceDAO.addEventOccurrence.mockResolvedValue({
                    ...mockOccurrence,
                    id: 1,
                    created_at: '2024-01-01T00:00:00Z',
                    latitude: null,
                    longitude: null
                });

                const result = await eventService.addEventOccurrence(mockOccurrence);

                expect(result).toBeDefined();
                expect(result.event_id).toBe(1);
                expect(mockEventOccurrenceDAO.addEventOccurrence).toHaveBeenCalled();
            });

            it('should throw error if end time is before start time', async () => {
                const mockOccurrence: TablesInsert<'Event_Occurrences'> = {
                    event_id: 1,
                    start_time: '2024-01-01T12:00:00Z',
                    end_time: '2024-01-01T10:00:00Z',
                    description: 'Test occurrence'
                };

                mockEventsDAO.getEvent.mockResolvedValue({
                    id: 1,
                    name: 'Test Event',
                    admin_id: 1,
                    is_recurring: false,
                    recurrence_pattern: null
                });

                await expect(eventService.addEventOccurrence(mockOccurrence))
                    .rejects.toThrow('End time must be after start time');
                expect(mockEventOccurrenceDAO.addEventOccurrence).not.toHaveBeenCalled();
            });

            it('should throw error if event does not exist', async () => {
                const mockOccurrence: TablesInsert<'Event_Occurrences'> = {
                    event_id: 999,
                    start_time: '2024-01-01T10:00:00Z',
                    end_time: '2024-01-01T12:00:00Z',
                    description: 'Test occurrence'
                };

                mockEventsDAO.getEvent.mockResolvedValue(null);

                await expect(eventService.addEventOccurrence(mockOccurrence))
                    .rejects.toThrow('Event with id 999 not found');
                expect(mockEventOccurrenceDAO.addEventOccurrence).not.toHaveBeenCalled();
            });
        });

        describe('updateEventOccurrence', () => {
            it('should update an event occurrence', async () => {
                const mockUpdate: TablesUpdate<'Event_Occurrences'> = {
                    start_time: '2024-01-01T14:00:00Z',
                    end_time: '2024-01-01T16:00:00Z',
                    description: 'Updated occurrence'
                };

                const mockExisting: Tables<'Event_Occurrences'> = {
                    id: 1,
                    event_id: 1,
                    start_time: '2024-01-01T10:00:00Z',
                    end_time: '2024-01-01T12:00:00Z',
                    created_at: '2024-01-01T00:00:00Z',
                    description: 'Original occurrence',
                    latitude: null,
                    longitude: null
                };

                const mockUpdated: Tables<'Event_Occurrences'> = {
                    ...mockExisting,
                    ...mockUpdate
                };

                mockEventOccurrenceDAO.getEventOccurrences.mockResolvedValue([mockExisting]);
                mockEventOccurrenceDAO.updateEventOccurrence.mockResolvedValue(mockUpdated);

                const result = await eventService.updateEventOccurrence(1, mockUpdate);

                expect(result).toEqual(mockUpdated);
                expect(mockEventOccurrenceDAO.updateEventOccurrence).toHaveBeenCalledWith(1, mockUpdate);
            });

            it('should throw error if updating to invalid time range', async () => {
                const mockUpdate: TablesUpdate<'Event_Occurrences'> = {
                    start_time: '2024-01-01T16:00:00Z',
                    end_time: '2024-01-01T14:00:00Z'
                };

                await expect(eventService.updateEventOccurrence(1, mockUpdate))
                    .rejects.toThrow('End time must be after start time');
                expect(mockEventOccurrenceDAO.updateEventOccurrence).not.toHaveBeenCalled();
            });
        });

        describe('deleteEventOccurrence', () => {
            it('should delete an event occurrence and its vendor associations', async () => {
                const mockVendors = [
                    { vendor_id: 1, event_occurence_id: 1, booth_number: 101 },
                    { vendor_id: 2, event_occurence_id: 1, booth_number: 102 }
                ];

                mockEventVendorDAO.getVendorsByEventId.mockResolvedValue(mockVendors);

                await eventService.deleteEventOccurrence(1);

                expect(mockEventVendorDAO.deleteEventVendor).toHaveBeenCalledTimes(2);
                expect(mockEventVendorDAO.deleteEventVendor).toHaveBeenNthCalledWith(1, 1, 1);
                expect(mockEventVendorDAO.deleteEventVendor).toHaveBeenNthCalledWith(2, 2, 1);
                expect(mockEventOccurrenceDAO.deleteEventOccurrence).toHaveBeenCalledWith(1);
            });
        });
    });

    describe('Event Vendor Management', () => {
        describe('addVendorToEvent', () => {
            it('should add a vendor to an event', async () => {
                const mockEventVendor = {
                    vendor_id: 1,
                    event_occurence_id: 1,
                    booth_number: 101
                };

                mockEventVendorDAO.addEventVendor.mockResolvedValue(mockEventVendor);

                const result = await eventService.addVendorToEvent(1, 1, 101);

                expect(result).toEqual(mockEventVendor);
                expect(mockEventVendorDAO.addEventVendor).toHaveBeenCalledWith(mockEventVendor);
            });
        });

        describe('updateVendorInEvent', () => {
            it('should update a vendor in an event', async () => {
                const mockUpdate = {
                    booth_number: 102
                };

                const mockUpdated = {
                    vendor_id: 1,
                    event_occurence_id: 1,
                    booth_number: 102
                };

                mockEventVendorDAO.updateEventVendor.mockResolvedValue(mockUpdated);

                const result = await eventService.updateVendorInEvent(1, 1, mockUpdate);

                expect(result).toEqual(mockUpdated);
                expect(mockEventVendorDAO.updateEventVendor).toHaveBeenCalledWith(1, 1, mockUpdate);
            });
        });

        describe('removeVendorFromEvent', () => {
            it('should remove a vendor from an event', async () => {
                await eventService.removeVendorFromEvent(1, 1);

                expect(mockEventVendorDAO.deleteEventVendor).toHaveBeenCalledWith(1, 1);
            });
        });
    });
});