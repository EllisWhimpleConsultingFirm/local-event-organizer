import { EventService, EventWithPicture } from '@/services/events';
import { EventsDAO } from "@/DAO/interface/EventsDAO";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";
import {BucketDAO} from "@/DAO/interface/BucketDAO";

// Mock EventsDAO
const mockEventsDAO: jest.Mocked<EventsDAO> = {
    getEvents: jest.fn(),
    addEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
};

const mockBucketDAO: jest.Mocked<BucketDAO> = {
    getPicture: jest.fn(),
    addPicture: jest.fn(),
    updatePicture: jest.fn(),
    deletePicture: jest.fn(),
};


describe('EventService', () => {
    let eventService: EventService;

    beforeEach(() => {
        eventService = new EventService(mockEventsDAO, mockBucketDAO);

        jest.clearAllMocks();
    });

    describe('getEvent', () => {
        it('should return an event with picture URL', async () => {
            const mockEvent: Tables<'Events'> = { id: 1, name: 'Test Event', description: 'Test Description', admin_id: 1 };
            mockEventsDAO.getEvents.mockResolvedValue([mockEvent]);
            mockBucketDAO.getPicture.mockReturnValue({ publicUrl: 'http://test.com/image.jpg' });

            const result = await eventService.getEvent(1);

            expect(result).toEqual({ ...mockEvent, pictureUrl: 'http://test.com/image.jpg' });
            expect(mockEventsDAO.getEvents).toHaveBeenCalled();
            expect(mockBucketDAO.getPicture).toHaveBeenCalledWith(1);
        });

        it('should throw an error if event is not found', async () => {
            mockEventsDAO.getEvents.mockResolvedValue([]);

            await expect(eventService.getEvent(1)).rejects.toThrow('Event with id 1 not found');
        });
    });

    describe('getAllEvents', () => {
        it('should return all events with picture URLs', async () => {
            const mockEvents: Tables<'Events'>[] = [
                { id: 1, name: 'Event 1', description: 'Description 1', admin_id: 1 },
                { id: 2, name: 'Event 2', description: 'Description 2', admin_id: 1 },
            ];
            mockEventsDAO.getEvents.mockResolvedValue(mockEvents);
            mockBucketDAO.getPicture.mockReturnValue({ publicUrl: 'http://test.com/image.jpg' });

            const result = await eventService.getAllEvents();

            expect(result).toEqual(mockEvents.map(event => ({ ...event, pictureUrl: 'http://test.com/image.jpg' })));
            expect(mockEventsDAO.getEvents).toHaveBeenCalled();
            expect(mockBucketDAO.getPicture).toHaveBeenCalledTimes(2);
        });
    });

    describe('addEvent', () => {
        it('should add an event with picture', async () => {
            const mockEventData: TablesInsert<'Events'> = { name: 'New Event', description: 'New Description', admin_id: 1 };
            const mockNewEvent: Tables<'Events'> = { id: 1, ...mockEventData };
            const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

            mockEventsDAO.addEvent.mockResolvedValue(mockNewEvent);
            mockBucketDAO.addPicture.mockResolvedValue({ publicUrl: 'http://test.com/new-image.jpg' });

            const result = await eventService.addEvent(mockEventData, mockFile);

            expect(result).toEqual({ ...mockNewEvent, pictureUrl: 'http://test.com/new-image.jpg' });
            expect(mockEventsDAO.addEvent).toHaveBeenCalledWith(mockEventData);
            expect(mockBucketDAO.addPicture).toHaveBeenCalledWith(1, mockFile);
        });
    });

    describe('updateEvent', () => {
        it('should update an event with new picture', async () => {
            const mockEventData: TablesUpdate<'Events'> = { name: 'Updated Event' };
            const mockUpdatedEvent: Tables<'Events'> = { id: 1, name: 'Updated Event', description: 'Description', admin_id: 1 };
            const mockFile = new File([''], 'new-test.jpg', { type: 'image/jpeg' });

            mockEventsDAO.updateEvent.mockResolvedValue(mockUpdatedEvent);
            mockBucketDAO.updatePicture.mockResolvedValue({ publicUrl: 'http://test.com/updated-image.jpg' });

            const result = await eventService.updateEvent(1, mockEventData, mockFile);

            expect(result).toEqual({ ...mockUpdatedEvent, pictureUrl: 'http://test.com/updated-image.jpg' });
            expect(mockEventsDAO.updateEvent).toHaveBeenCalledWith(1, mockEventData);
            expect(mockBucketDAO.updatePicture).toHaveBeenCalledWith(1, mockFile);
        });

        it('should update an event without changing the picture', async () => {
            const mockEventData: TablesUpdate<'Events'> = { name: 'Updated Event' };
            const mockUpdatedEvent: Tables<'Events'> = { id: 1, name: 'Updated Event', description: 'Description', admin_id: 1 };

            mockEventsDAO.updateEvent.mockResolvedValue(mockUpdatedEvent);
            mockBucketDAO.getPicture.mockReturnValue({ publicUrl: 'http://test.com/existing-image.jpg' });

            const result = await eventService.updateEvent(1, mockEventData);

            expect(result).toEqual({ ...mockUpdatedEvent, pictureUrl: 'http://test.com/existing-image.jpg' });
            expect(mockEventsDAO.updateEvent).toHaveBeenCalledWith(1, mockEventData);
            expect(mockBucketDAO.updatePicture).not.toHaveBeenCalled();
            expect(mockBucketDAO.getPicture).toHaveBeenCalledWith(1);
        });
    });

    describe('deleteEvent', () => {
        it('should delete an event and its picture', async () => {
            await eventService.deleteEvent(1);

            expect(mockEventsDAO.deleteEvent).toHaveBeenCalledWith(1);
            expect(mockBucketDAO.deletePicture).toHaveBeenCalledWith(1);
        });
    });
});