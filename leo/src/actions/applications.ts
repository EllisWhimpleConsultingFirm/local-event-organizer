'use server'

import { DAOFactory } from "@/DAO/interface/Factory";
import { SupabaseDAOFactory } from "@/DAO/supabase/SupabaseDAOFactory";
import { revalidatePath } from "next/cache";
import { z } from 'zod';
import { TablesInsert, TablesUpdate } from "../../types/database.types";
import { redirect } from "next/navigation";
import {EventService} from "@/services/events";

export type ApplicationFormState = {
    errors?: {
        id?: string[];
        event_occurrence_id?: string[];
        event_id?: string[];
        vendor_id?: string[];
        message?: string[];
    };
    message?: string;
};

// Define the schema for application form validation
const ApplicationFormSchema = z.object({
    event_id: z.string().min(1, "Event ID is required"),
    vendor_id: z.string().min(1, "Vendor ID is required"),
    message: z.string().min(1, "Message is required"),
    status: z.string(),
});

export async function addEventApplication(prevState: ApplicationFormState, formData: FormData): Promise<ApplicationFormState> {
    'use server'

    // Validate form fields
    const validatedFields = ApplicationFormSchema.safeParse({
        event_id: formData.get('event_id'),
        vendor_id: formData.get('vendor_id'),
        message: formData.get('message'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const daoFactory: DAOFactory = new SupabaseDAOFactory();
        const eventApplicationDao = daoFactory.getEventApplicationDAO();

        const applicationData: TablesInsert<'Event_Applications'> = {
            event_id: parseInt(validatedFields.data.event_id),
            vendor_id: parseInt(validatedFields.data.vendor_id),
            message: validatedFields.data.message,
        };

        await eventApplicationDao.addEventApplication(applicationData);

        revalidatePath('/applications');
        return { message: "Application submitted successfully!" };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
        };
    }
}

export async function deleteEventApplication(state: ApplicationFormState, formData: FormData) {
    'use server';
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventApplicationDao = daoFactory.getEventApplicationDAO();

    const vendorId = formData.get('vendor_id');
    const eventId = formData.get('event_id');

    if (!vendorId || !eventId ||
        typeof vendorId !== 'string' || typeof eventId !== 'string' ||
        isNaN(parseInt(vendorId)) || isNaN(parseInt(eventId))) {
        throw new Error('Invalid vendor ID or event ID');
    }

    try {
        await eventApplicationDao.deleteEventApplication(parseInt(vendorId), parseInt(eventId));
        revalidatePath('/applications');
    } catch (error) {
        return {
            message: 'Failed to delete application. Please try again.',
        }
    }

    redirect("/applications")
}

export async function updateEventApplication(prevState: ApplicationFormState, formData: FormData): Promise<ApplicationFormState> {
    'use server'
    if (!formData.get('event_occurrence_id')) {
        const validatedFields = ApplicationFormSchema.safeParse({
            event_id: formData.get('event_id'),
            vendor_id: formData.get('vendor_id'),
            message: formData.get('message'),
            status: formData.get('status')
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
            const eventApplicationDao = daoFactory.getEventApplicationDAO();

            const applicationData: TablesUpdate<'Event_Applications'> = {
                message: validatedFields.data.message,
                status: validatedFields.data.status
            };

            await eventApplicationDao.updateEventApplication(
                parseInt(validatedFields.data.vendor_id),
                parseInt(validatedFields.data.event_id),
                applicationData
            );

            if (validatedFields.data.status === 'ACCEPTED') {
                await eventService.addVendorToEvent(parseInt(validatedFields.data.vendor_id), parseInt(validatedFields.data.event_id), 1)
            } else if (validatedFields.data.status === 'REJECTED') {
                await eventService.removeVendorFromEvent(parseInt(validatedFields.data.vendor_id), parseInt(validatedFields.data.event_id))
            }

            revalidatePath(`/admin/events/${validatedFields.data.event_id}`);

            return { message: "Application updated successfully!" };
        } catch (error) {
            return {
                message: error instanceof Error ? error.message : "Failed to update application. Please try again.",
            };
        }
    } else {
        const validatedFields = OccurrenceApplicationFormSchema.safeParse({
            event_occurrence_id: formData.get('event_occurrence_id'),
            vendor_id: formData.get('vendor_id'),
            message: formData.get('message'),
            status: formData.get('status'),
            event_id: formData.get('event_id')
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
            const eventOccurrenceApplicationDao = daoFactory.getEventOccurrenceApplicationDAO();

            const applicationData: TablesUpdate<'Event_Occurrence_Applications'> = {
                message: validatedFields.data.message,
                status: validatedFields.data.status
            };

            await eventOccurrenceApplicationDao.updateEventApplication(
                parseInt(validatedFields.data.vendor_id),
                parseInt(validatedFields.data.event_occurrence_id),
                applicationData
            );

            if (validatedFields.data.status === 'ACCEPTED') {
                await eventService.addVendorToEventOccurrence(parseInt(validatedFields.data.vendor_id), parseInt(validatedFields.data.event_occurrence_id), 1)
            } else if (validatedFields.data.status === 'REJECTED') {
                await eventService.removeVendorFromEventOccurrence(parseInt(validatedFields.data.vendor_id), parseInt(validatedFields.data.event_occurrence_id))
            }

            revalidatePath(`/admin/events/${validatedFields.data.event_id}/${validatedFields.data.event_occurrence_id}`);

            return { message: "Application updated successfully!" };
        } catch (error) {
            return {
                message: error instanceof Error ? error.message : "Failed to update application. Please try again.",
            };
        }
    }
}

export async function getEventApplications() {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventApplicationDao = daoFactory.getEventApplicationDAO();

    try {
        return await eventApplicationDao.getEventApplications();
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getPendingEventApplications() {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventApplicationDao = daoFactory.getEventApplicationDAO();

    try {
        return await eventApplicationDao.getEventApplications();
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getVendorEventApplications(vendorId: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventApplicationDao = daoFactory.getEventApplicationDAO();

    try {
        return await eventApplicationDao.getVendorEventApplications(vendorId);
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getEventsApplications(eventId: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventApplicationDao = daoFactory.getEventApplicationDAO();

    try {
        return await eventApplicationDao.getEventsApplications(eventId);
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

// Define the schema for occurrence application form validation
const OccurrenceApplicationFormSchema = z.object({
    event_occurrence_id: z.string().min(1, "Event Occurrence ID is required"),
    event_id: z.string().min(1, "Event ID is required"),
    vendor_id: z.string().min(1, "Vendor ID is required"),
    message: z.string().min(1, "Message is required"),
    status: z.string().min(1, "Status is required"),
});

export async function addEventOccurrenceApplication(prevState: ApplicationFormState, formData: FormData): Promise<ApplicationFormState> {
    'use server'

    // Validate form fields
    const validatedFields = OccurrenceApplicationFormSchema.safeParse({
        event_occurrence_id: formData.get('event_occurrence_id'),
        vendor_id: formData.get('vendor_id'),
        message: formData.get('message'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const daoFactory: DAOFactory = new SupabaseDAOFactory();
        const eventOccurrenceApplicationDao = daoFactory.getEventOccurrenceApplicationDAO();

        const applicationData: TablesInsert<'Event_Occurrence_Applications'> = {
            event_occurrence_id: parseInt(validatedFields.data.event_occurrence_id),
            vendor_id: parseInt(validatedFields.data.vendor_id),
            message: validatedFields.data.message,
        };

        await eventOccurrenceApplicationDao.addEventApplication(applicationData);

        revalidatePath('/occurrence-applications');
        return { message: "Application submitted successfully!" };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
        };
    }
}

export async function deleteEventOccurrenceApplication(state: ApplicationFormState, formData: FormData) {
    'use server';
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventOccurrenceApplicationDao = daoFactory.getEventOccurrenceApplicationDAO();

    const vendorId = formData.get('vendor_id');
    const eventOccurrenceId = formData.get('event_occurrence_id');

    if (!vendorId || !eventOccurrenceId ||
        typeof vendorId !== 'string' || typeof eventOccurrenceId !== 'string' ||
        isNaN(parseInt(vendorId)) || isNaN(parseInt(eventOccurrenceId))) {
        throw new Error('Invalid vendor ID or event occurrence ID');
    }

    try {
        await eventOccurrenceApplicationDao.deleteEventApplication(parseInt(vendorId), parseInt(eventOccurrenceId));
        revalidatePath('/occurrence-applications');
    } catch (error) {
        return {
            message: 'Failed to delete application. Please try again.',
        }
    }

    redirect("/occurrence-applications")
}

export async function updateEventOccurrenceApplication(prevState: ApplicationFormState, formData: FormData): Promise<OccurrenceApplicationFormState> {
    'use server'

    const validatedFields = OccurrenceApplicationFormSchema.safeParse({
        event_occurrence_id: formData.get('event_occurrence_id'),
        vendor_id: formData.get('vendor_id'),
        message: formData.get('message'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const daoFactory: DAOFactory = new SupabaseDAOFactory();
        const eventOccurrenceApplicationDao = daoFactory.getEventOccurrenceApplicationDAO();

        const applicationData: TablesUpdate<'Event_Occurrence_Applications'> = {
            message: validatedFields.data.message,
        };

        await eventOccurrenceApplicationDao.updateEventApplication(
            parseInt(validatedFields.data.vendor_id),
            parseInt(validatedFields.data.event_occurrence_id),
            applicationData
        );

        revalidatePath('/occurrence-applications');
        return { message: "Application updated successfully!" };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Failed to update application. Please try again.",
        };
    }
}

export async function getEventOccurrenceApplications() {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventOccurrenceApplicationDao = daoFactory.getEventOccurrenceApplicationDAO();

    try {
        return await eventOccurrenceApplicationDao.getEventApplications();
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getVendorEventOccurrenceApplications(vendorId: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventOccurrenceApplicationDao = daoFactory.getEventOccurrenceApplicationDAO();

    try {
        return await eventOccurrenceApplicationDao.getVendorEventApplications(vendorId);
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getEventOccurrencesApplications(eventOccurrenceId: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventOccurrenceApplicationDao = daoFactory.getEventOccurrenceApplicationDAO();

    try {
        return await eventOccurrenceApplicationDao.getEventsApplications(eventOccurrenceId);
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getVendorPendingEvents(vendorId: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventApplicationDao = daoFactory.getEventApplicationDAO();
    const eventOccurrenceApplicationDao = daoFactory.getEventOccurrenceApplicationDAO();

    try {
        const eventApplications = await eventApplicationDao.getPendingVendorEventApplications(vendorId);
        const eventOccurrenceApplications =  await eventOccurrenceApplicationDao.getPendingVendorEventOccurrencesApplications(vendorId);
        return {eventApplications, eventOccurrenceApplications}
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getEventPendingVendors(eventId: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventApplicationDao = daoFactory.getEventApplicationDAO();

    try {
        return await eventApplicationDao.getPendingEventsApplications(eventId);
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getEventOccurrencePendingVendors(eventOccurrenceId: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const eventOccurrenceApplicationDao = daoFactory.getEventOccurrenceApplicationDAO();

    try {
        return await eventOccurrenceApplicationDao.getPendingEventsApplications(eventOccurrenceId);
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}