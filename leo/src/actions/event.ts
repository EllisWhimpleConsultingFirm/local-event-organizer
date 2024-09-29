'use server'

import { DAOFactory } from "@/DAO/interface/Factory";
import { SupabaseDAOFactory } from "@/DAO/supabase/SupabaseDAOFactory";
import { EventService } from "@/services/events";
import { revalidatePath } from "next/cache";
import { z } from 'zod';
import {TablesInsert, TablesUpdate} from "../../types/database.types";

export type FormState = {
    errors?: {
        id?: string[];
        name?: string[];
        description?: string[];
        admin_id?: string[];
        picture?: string[];
    };
    message?: string;
};

// Define the schema for event form validation
const EventFormSchema = z.object({
    name: z.string().min(1, "Event name is required"),
    description: z.string().min(1, "Description is required"),
    admin_id: z.number().int().positive("Admin ID must be a positive integer"),
});

export async function addEvent(prevState: FormState, formData: FormData): Promise<FormState> {
    // Validate form fields
    const validatedFields = EventFormSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        admin_id: Number(formData.get('admin_id')),
    });

    // If form validation fails, return errors early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const picture = formData.get('picture');
    if (!(picture instanceof File) || picture.size === 0) {
        return {
            errors: {
                picture: ["Picture is required"],
            },
        };
    }

    try {
        const daoFactory: DAOFactory = new SupabaseDAOFactory();
        const eventsDao = daoFactory.getEventsDAO();
        const eventService = new EventService(eventsDao);

        const eventData: TablesInsert<'Events'> = {
            name: validatedFields.data.name,
            description: validatedFields.data.description,
            admin_id: validatedFields.data.admin_id,
        };

        await eventService.addEvent(eventData, picture);

        revalidatePath('/events');

        return { message: "Event added successfully!" };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Failed to add event. Please try again.",
        };
    }
}

export async function deleteEvent(state: any, formData: FormData) {
    'use server';
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const eventService = new EventService(eventsDao);

    const id = formData.get('id');
    if (id && typeof id === 'string') {
        try {
            await eventService.deleteEvent(parseInt(id, 10));
            revalidatePath('/events');
        } catch (error) {
            return {
                message: 'Failed to delete event. Please try again.',
            }
        }
    }
}

const UpdateEventFormSchema = z.object({
    id: z.string().min(1, "Event ID is required"),
    name: z.string().min(1, "Event name is required"),
    description: z.string().min(1, "Description is required"),
    admin_id: z.number().int().positive("Admin ID must be a positive integer"),
});

export async function updateEvent(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = UpdateEventFormSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        description: formData.get('description'),
        admin_id: Number(formData.get('admin_id')),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    let picture = formData.get('picture') as File | null;
    if (picture?.name === "undefined") {
        picture = null
    }
    try {
        const daoFactory: DAOFactory = new SupabaseDAOFactory();
        const eventsDao = daoFactory.getEventsDAO();
        const eventService = new EventService(eventsDao);

        const eventData: TablesUpdate<'Events'> = {
            name: validatedFields.data.name,
            description: validatedFields.data.description,
            admin_id: validatedFields.data.admin_id,
        };

        await eventService.updateEvent(parseInt(validatedFields.data.id, 10), eventData, picture || undefined);

        revalidatePath(`/events/${validatedFields.data.id}`);

        return { message: "Event updated successfully!" };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Failed to update event. Please try again.",
        };
    }
}