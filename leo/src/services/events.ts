import { EventsDAO } from "@/DAO/interface/EventsDAO";
import { Tables, TablesInsert, TablesUpdate } from "../../types/database.types";

export interface EventWithPicture extends Tables<'Events'> {
    pictureUrl: string;
}

export class EventService {
    constructor(private eventsDAO: EventsDAO) {}

    async getEvent(id: number): Promise<EventWithPicture> {
        const event = await this.eventsDAO.getEvents().then(events =>
            events.find(event => event.id === id)
        );
        if (!event) {
            throw new Error(`Event with id ${id} not found`);
        }
        const { publicUrl: pictureUrl } = this.eventsDAO.getEventPicture(id);
        return { ...event, pictureUrl };
    }

    async getAllEvents(): Promise<EventWithPicture[]> {
        const events = await this.eventsDAO.getEvents();
        return Promise.all(events.map(async (event) => {
            const { publicUrl: pictureUrl } = this.eventsDAO.getEventPicture(event.id);
            return { ...event, pictureUrl };
        }));
    }

    async addEvent(eventData: TablesInsert<'Events'>, picture: File): Promise<EventWithPicture> {
        const newEvent = await this.eventsDAO.addEvent(eventData);
        const { publicUrl: pictureUrl } = await this.eventsDAO.addEventPicture(newEvent.id, picture);
        return { ...newEvent, pictureUrl };
    }

    async updateEvent(id: number, eventData: TablesUpdate<'Events'>, picture?: File): Promise<EventWithPicture> {
        const updatedEvent = await this.eventsDAO.updateEvent(id, eventData);
        let pictureUrl: string;
        if (picture) {
            const result = await this.eventsDAO.updateEventPicture(id, picture);
            pictureUrl = result.publicUrl;
        } else {
            const result = this.eventsDAO.getEventPicture(id);
            pictureUrl = result.publicUrl;
        }
        return { ...updatedEvent, pictureUrl };
    }

    async deleteEvent(id: number): Promise<void> {
        await this.eventsDAO.deleteEvent(id);
        await this.eventsDAO.deleteEventPicture(id);
    }
}