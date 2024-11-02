import {DAOFactory} from "@/DAO/interface/Factory";
import {SupabaseDAOFactory} from "@/DAO/supabase/SupabaseDAOFactory";
import {VendorService} from "@/services/vendors";
import { getEventOccurrence} from "@/actions/event";

export async function getVendor(id: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const vendorDAO = daoFactory.getVendorDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const vendorService = new VendorService(vendorDAO, bucketDao, eventVendorDao);

    try {
        return await vendorService.getVendor(id);
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getVendorEventOccurrences(vendorId: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const vendorDAO = daoFactory.getVendorDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const vendorService = new VendorService(vendorDAO, bucketDao, eventVendorDao);

    try {
        const vendorEvents = await vendorService.getVendorEvents(vendorId);
        const eventPromises = vendorEvents.map(async (vendorEvent) => {
            const currentEvent = await getEventOccurrence(vendorEvent.event_occurence_id);
            if (currentEvent && !("error" in currentEvent)) {
                return currentEvent;
            }
            return null;
        });

        // Wait for all promises to resolve
        const resolvedEvents = await Promise.all(eventPromises);

        // Filter out any null values
        return resolvedEvents.map((event) => {
            if (event && !("error" in event)) {
                return event
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}