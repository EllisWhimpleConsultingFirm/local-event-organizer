import { EventsDAO } from "@/DAO/interface/EventsDAO";
import { Tables, TablesInsert, TablesUpdate } from "../../types/database.types";
import { BucketDAO } from "@/DAO/interface/BucketDAO";
import { EventOccurrenceDAO } from "@/DAO/interface/EventOccurrenceDAO";
import { EventVendorDAO } from "@/DAO/interface/EventVendorDAO";

export class EventService {
    constructor(
        private eventsDAO: EventsDAO,
        private bucketDAO: BucketDAO,
        private eventOccurrenceDAO: EventOccurrenceDAO,
        private eventVendorDAO: EventVendorDAO
    ) {}

    // Event Management Methods
    async getEvent(id: number): Promise<Tables<'Events'>> {
        const event = await this.eventsDAO.getEvent(id)
        if (!event) {
            throw new Error(`Event with id ${id} not found`);
        }
        return event;
    }

    async getAllEvents(): Promise<Tables<'Events'>[]> {
        return await this.eventsDAO.getEvents();
    }

    async addEvent(eventData: TablesInsert<'Events'>, picture: File): Promise<Tables<'Events'>> {
        const { publicUrl: pictureUrl } = await this.bucketDAO.addFile(picture);
        return await this.eventsDAO.addEvent({...eventData, photo_url: pictureUrl});
    }

    async updateEvent(id: number, eventData: TablesUpdate<'Events'>, picture?: File): Promise<Tables<'Events'>> {
        let pictureUrl: string | undefined = undefined;
        const oldEvent = await this.eventsDAO.getEvent(id)
        if (picture && oldEvent && oldEvent.photo_url) {
            await this.deleteFile(oldEvent.photo_url)
            const result = await this.bucketDAO.addFile(picture)
            pictureUrl = result.publicUrl
        }
        return await this.eventsDAO.updateEvent(id, {...eventData, photo_url: pictureUrl});
    }

    async deleteEvent(id: number): Promise<void> {
        const event = await this.eventsDAO.getEvent(id)

        // Get all occurrences for this event
        const occurrences = await this.eventOccurrenceDAO.getEventOccurrencesByEventId(id);

        // Delete all occurrences first
        for (const occurrence of occurrences) {
            await this.deleteEventOccurrence(occurrence.id);
        }

        // Then delete the event and its photo
        await this.eventsDAO.deleteEvent(id);
        if (event && event.photo_url) {
            await this.deleteFile(event.photo_url)
        }
    }

    // Event Occurrence Management Methods
    async getAllEventOccurrences(): Promise<Tables<'Event_Occurrences'>[]> {
        return await this.eventOccurrenceDAO.getEventOccurrences();
    }

    async getEventOccurrencesByEventId(eventId: number): Promise<Tables<'Event_Occurrences'>[]> {
        return await this.eventOccurrenceDAO.getEventOccurrencesByEventId(eventId);
    }

    async addEventOccurrence(occurrenceData: TablesInsert<'Event_Occurrences'>): Promise<Tables<'Event_Occurrences'>> {
        // Validate that the event exists
        await this.getEvent(occurrenceData.event_id);

        // Set created_at if not provided
        const data = {
            ...occurrenceData,
            created_at: occurrenceData.created_at ?? new Date().toISOString()
        };

        // Validate date range
        if (new Date(data.end_time) <= new Date(data.start_time)) {
            throw new Error('End time must be after start time');
        }

        return await this.eventOccurrenceDAO.addEventOccurrence(data);
    }

    async updateEventOccurrence(
        id: number,
        occurrenceData: TablesUpdate<'Event_Occurrences'>
    ): Promise<Tables<'Event_Occurrences'>> {
        // Validate date range if both dates are being updated
        if (occurrenceData.start_time && occurrenceData.end_time) {
            if (new Date(occurrenceData.end_time) <= new Date(occurrenceData.start_time)) {
                throw new Error('End time must be after start time');
            }
        }

        // If only one date is being updated, validate against existing date
        if (occurrenceData.start_time || occurrenceData.end_time) {
            const currentOccurrence = (await this.eventOccurrenceDAO.getEventOccurrences())
                .find(occ => occ.id === id);

            if (!currentOccurrence) {
                throw new Error('Event occurrence not found');
            }

            const newStartTime = occurrenceData.start_time ?? currentOccurrence.start_time;
            const newEndTime = occurrenceData.end_time ?? currentOccurrence.end_time;

            if (new Date(newEndTime) <= new Date(newStartTime)) {
                throw new Error('End time must be after start time');
            }
        }

        return await this.eventOccurrenceDAO.updateEventOccurrence(id, occurrenceData);
    }

    async deleteEventOccurrence(id: number): Promise<void> {
        // Get all vendors associated with this occurrence
        const vendors = await this.eventVendorDAO.getVendorsByEventId(id);

        // Delete all vendor associations first
        for (const vendor of vendors) {
            await this.eventVendorDAO.deleteEventVendor(vendor.vendor_id, id);
        }

        // Then delete the occurrence
        await this.eventOccurrenceDAO.deleteEventOccurrence(id);
    }
    private async deleteFile(fileUrl: string) {
        const filename = fileUrl.split('/').pop() ?? '';
        await this.bucketDAO.deleteFile(filename);
    }

    async addVendorToEvent(
        vendorId: number,
        eventOccurrenceId: number,
        boothNumber: number
    ): Promise<Tables<'Event_Vendors'>> {
        return await this.eventVendorDAO.addEventVendor({
            vendor_id: vendorId,
            event_occurence_id: eventOccurrenceId,
            booth_number: boothNumber
        });
    }

    async updateVendorInEvent(
        vendorId: number,
        eventOccurrenceId: number,
        updates: TablesUpdate<'Event_Vendors'>
    ): Promise<Tables<'Event_Vendors'>> {
        return await this.eventVendorDAO.updateEventVendor(
            vendorId,
            eventOccurrenceId,
            updates
        );
    }

    async removeVendorFromEvent(vendorId: number, eventOccurrenceId: number): Promise<void> {
        await this.eventVendorDAO.deleteEventVendor(vendorId, eventOccurrenceId);
    }
}