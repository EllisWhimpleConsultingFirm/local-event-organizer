'use server'

import {DAOFactory} from "@/DAO/interface/Factory";
import {SupabaseDAOFactory} from "@/DAO/supabase/SupabaseDAOFactory";
import {EventService} from "@/services/events";
import {revalidatePath} from "next/cache";
import {z} from 'zod';
import {Tables, TablesInsert, TablesUpdate} from "../../types/database.types";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Filters} from "@/utils/filter-models";

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
    admin_id: z.string().min(36,"Admin ID is not valid"),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addEvent(prevState: any, formData: FormData): Promise<FormState> {
    'use server'
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    // Validate form fields
    const validatedFields = EventFormSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        admin_id: data.user?.id,
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
        const bucketDao = daoFactory.getBucketDAO();
        const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
        const eventVendorDao = daoFactory.getEventVendorDAO();
        const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO();
        const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

        const eventData: TablesInsert<'Events'> = {
            name: validatedFields.data.name,
            description: validatedFields.data.description,
            admin_id: validatedFields.data.admin_id,
        };

        await eventService.addEvent(eventData, picture);

        revalidatePath('/events');

        return {message: "Event added successfully!"};
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Failed to add event. Please try again.",
        };
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteEvent(state: any, formData: FormData) {
    'use server';
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO();
    const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

    const id = formData.get('id');

    if (id && typeof id === 'string' && !isNaN(parseInt(id, 10))) {
        try {
            const intId = parseInt(id, 10)
            if (intId )
            await eventService.deleteEvent(intId);
            revalidatePath('/admin/events');
        } catch (error) {
            return {
                message: 'Failed to delete event. Please try again.',
            }
        }
    } else {
        throw new Error('Invalid event ID');
    }

    redirect("/admin/events")
}

const UpdateEventFormSchema = z.object({
    id: z.string().min(1, "Event ID is required"),
    name: z.string().min(1, "Event name is required"),
    description: z.string().min(1, "Description is required"),
    admin_id: z.string().min(36, "Invalid Admin Id"),
});

export async function updateEvent(prevState: FormState, formData: FormData): Promise<FormState> {
    'use server'
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()

    const validatedFields = UpdateEventFormSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        description: formData.get('description'),
        admin_id: data.user?.id,
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
        const bucketDao = daoFactory.getBucketDAO();
        const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
        const eventVendorDao = daoFactory.getEventVendorDAO();
        const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO();
        const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

        const eventData: TablesUpdate<'Events'> = {
            name: validatedFields.data.name,
            description: validatedFields.data.description,
            admin_id: validatedFields.data.admin_id,
        };

        await eventService.updateEvent(parseInt(validatedFields.data.id, 10), eventData, picture || undefined);

        revalidatePath(`/events/${validatedFields.data.id}`);

        return {message: "Event updated successfully!"};
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Failed to update event. Please try again.",
        };
    }
}

export async function getEvent(id: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO();
    const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

    try {
        return await eventService.getEvent(id);
    } catch (error) {
        console.error((error as Error).message)
        return null
    }
}

export async function getEvents() {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO();
    const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

    try {
        return await eventService.getAllEvents();
    } catch (error) {
        // Error object is created, so we can check it in the components
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getAdminEvents(adminId: string) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO();
    const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

    try {
        return await eventService.getAdminEvents(adminId);
    } catch (error) {
        // Error object is created, so we can check it in the components
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getEventOccurrences() {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO();
    const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

    try {
        return await eventService.getAllEventOccurrences();
    } catch (error) {
        // Error object is created, so we can check it in the components
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getEventOccurrencesWithEvent(filters?: Filters): Promise<{ event: Tables<'Events'>, eventOccurrence: Tables<'Event_Occurrences'> }[] | null> {
    console.log("here")
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO();
    const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

    console.log("fetching new events:", filters)
    try {
        const eventOccurrences = await eventService.getAllEventOccurrences(filters);
        const eventArray = []
        for (const occurrence of eventOccurrences) {
            if (!occurrence || !occurrence.event_id) continue; // Skip invalid occurrences
            try {
                const event = await eventService.getEvent(occurrence.event_id);
                eventArray.push({ eventOccurrence: occurrence, event });
            } catch (e) {}
        }
        return eventArray
    } catch (error) {
        console.error(error);
        return null
    }
}

export async function getEventOccurrencesByEventId(id: number, filters?: Filters): Promise<Tables<'Event_Occurrences'>[] | null> {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO();
    const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

    try {
        return await eventService.getEventOccurrencesByEventId(id, filters);
    } catch (error) {
        console.error((error as Error).message)
        return null
    }
}

export async function getEventOccurrence(id: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO();
    const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

    try {
        return await eventService.getEventOccurrence(id);
    } catch (error) {
        console.error((error as Error).message)
        return null
    }
}

export async function getEventOccurrenceVendors(eventOccurrenceId: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO();
    const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

    try {
        return await eventService.getEventOccurrenceVendors(eventOccurrenceId);
    } catch (error) {
        console.error((error as Error).message)
        return null
    }
}
