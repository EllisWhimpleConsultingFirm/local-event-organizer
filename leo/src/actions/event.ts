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

const EventOccurrenceFormSchema = z.object({
    description: z.string().min(1, "Description is required"),
    event_id: z.string().min(1,"Event ID is required"),
    start_time: z.string().min(1,"Start Time is required"),
    end_time: z.string().min(1,"Start End is required")
});

export type EventOccurrenceFormState = {
    errors?: {
        event_id?: string[];
        description?: string[];
        end_time?: string[];
        start_time?: string[];
    };
    message?: string;
};

export async function addEventOccurrence(prevState: any, formData: FormData): Promise<EventOccurrenceFormState> {
    'use server'
    // Validate form fields
    const validatedFields = EventOccurrenceFormSchema.safeParse({
        description: formData.get('description'),
        event_id: formData.get('event_id'),
        start_time: formData.get('start_time'),
        end_time: formData.get('end_time')
    });

    // If form validation fails, return errors early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
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

        const eventOccurrenceData: TablesInsert<'Event_Occurrences'> = {
            event_id: parseInt(validatedFields.data.event_id, 10),
            description: validatedFields.data.description,
            start_time: validatedFields.data.start_time,
            end_time: validatedFields.data.end_time,
            latitude: 40.241164,
            longitude: -111.648022
        };

        await eventService.addEventOccurrence(eventOccurrenceData);

        revalidatePath(`/admin/events/${validatedFields.data.event_id}`);

        return {message: "Event Occurrence added successfully!"};
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Failed to add event occurrence. Please try again.",
        };
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteEventOccurrence(state : any, formData: FormData) {
    'use server';
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO()
    const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

    const id = formData.get('id');
    const eventId = formData.get('eventId')

    if (id && eventId && typeof id === 'string' && !isNaN(parseInt(id, 10))) {
        try {
            const intId = parseInt(id, 10)
            if (intId )
                await eventService.deleteEvent(intId);
            revalidatePath(`/admin/events/${eventId}`);
        } catch (error) {
            return {
                message: 'Failed to delete event. Please try again.',
            }
        }
    } else {
        throw new Error('Invalid event ID');
    }

    redirect(`/admin/events/${eventId}`)
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

const UpdateEventOccurrenceFormSchema = z.object({
    id: z.string().min(1, "Event ID is required"),
    description: z.string().min(1, "Description is required"),
    start_time: z.string().min(1, "Start Time is required"),
    end_time: z.string().min(1, "End Time is required"),
});

export async function updateEventOccurrence(prevState: FormState, formData: FormData): Promise<FormState> {
    'use server'

    const validatedFields = UpdateEventOccurrenceFormSchema.safeParse({
        id: formData.get('id'),
        description: formData.get('description'),
        start_time: formData.get('startTime'),
        end_time: formData.get('endTime'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const daoFactory: DAOFactory = new SupabaseDAOFactory();
        const eventsDao = daoFactory.getEventsDAO();
        const bucketDao = daoFactory.getBucketDAO();
        const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
        const eventVendorDao = daoFactory.getEventVendorDAO();
        const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO()
        const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

        const eventData: TablesUpdate<'Event_Occurrences'> = {
            description: validatedFields.data.description,
            start_time: validatedFields.data.start_time,
            end_time: validatedFields.data.end_time
        };

        await eventService.updateEventOccurrence(parseInt(validatedFields.data.id, 10), eventData);

        revalidatePath(`/events/${validatedFields.data.id}`);

        return { message: "Event updated successfully!" };
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
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred')
        };
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
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred')
        };
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
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred')
        };
    }
}

export async function getEventOccurrencesWithEvent(filters?: Filters): Promise<{ event: Tables<'Events'>, eventOccurrence: Tables<'Event_Occurrences'> }[] | null> {
    console.log("here")
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();

    console.log("fetching new events:", filters)
    try {
        return await eventOccurrenceDao.getEventOccurrencesWithEvents(filters);
    } catch (error) {
        console.error(error);
        return null
    }
}

export async function getEventOccurrencesByEventId(id: number, filters?: Filters): Promise<Tables<'Event_Occurrences'>[]> {
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
    }
}

export async function getEventOccurrence(id: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO()
    const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

    try {
        return await eventService.getEventOccurrence(id);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred')
        };
    }
}

export async function getEventVendors(eventId: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventsDao = daoFactory.getEventsDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventOccurrenceDao = daoFactory.getEventOccurrencesDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const eventOccurrenceVendorDao = daoFactory.getEventOccurrenceVendorDAO();
    const eventService = new EventService(eventsDao, bucketDao, eventOccurrenceDao, eventVendorDao, eventOccurrenceVendorDao);

    try {
        return await eventService.getEventVendors(eventId);
    } catch (error) {
        console.error((error as Error).message)
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
