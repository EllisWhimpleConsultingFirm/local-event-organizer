'use server'
import {DAOFactory} from "@/DAO/interface/Factory";
import {SupabaseDAOFactory} from "@/DAO/supabase/SupabaseDAOFactory";
import {VendorService} from "@/services/vendors";
import {z} from "zod";
import {TablesInsert, TablesUpdate} from "../../types/database.types";
import {revalidatePath} from "next/cache";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

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

const VendorFormSchema = z.object({
    name: z.string().min(1, "Event name is required"),
    description: z.string().min(1, "Description is required"),
    admin_id: z.string().min(36,"Admin ID is not valid"),
});

export async function addVendor(prevState: FormState, formData: FormData): Promise<FormState> {
    'use server'
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    // Validate form fields
    const validatedFields = VendorFormSchema.safeParse({
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
        const vendorDao = daoFactory.getVendorDAO();
        const bucketDao = daoFactory.getBucketDAO();
        const eventVendorDao = daoFactory.getEventVendorDAO();
        const vendorService = new VendorService(vendorDao, bucketDao, eventVendorDao);

        const vendorData: TablesInsert<'Vendors'> = {
            name: validatedFields.data.name,
            description: validatedFields.data.description,
            admin_id: validatedFields.data.admin_id,
        };

        await vendorService.addVendor(vendorData, picture);

        revalidatePath('/admin/vendors');
        revalidatePath('/vendors');

        return { message: "Vendor added successfully!" };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Failed to add vendor. Please try again.",
        };
    }
}

export async function deleteVendor(state : FormState, formData: FormData) {
    'use server';
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const vendorDAO = daoFactory.getVendorDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const vendorService = new VendorService(vendorDAO, bucketDao, eventVendorDao);

    const id = formData.get('id');

    if (id && typeof id === 'string' && !isNaN(parseInt(id, 10))) {
        try {
            const intId = parseInt(id, 10)
            if (intId) {
                await vendorService.deleteVendor(intId);
            }
        } catch (error) {
            return {
                message: 'Failed to delete vendor. Please try again.',
            }
        }
    } else {
        throw new Error('Invalid vendor ID');
    }
    revalidatePath('/admin/vendors');
    redirect('/admin/vendors')
}

const UpdateVendorFormSchema = z.object({
    id: z.string().min(1, "Event ID is required"),
    name: z.string().min(1, "Event name is required"),
    description: z.string().min(1, "Description is required"),
    admin_id: z.string().min(36, "Invalid Admin Id"),
});

export async function updateVendor(prevState: FormState, formData: FormData): Promise<FormState> {
    'use server'
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()

    const validatedFields = UpdateVendorFormSchema.safeParse({
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
        const vendorDAO = daoFactory.getVendorDAO();
        const bucketDao = daoFactory.getBucketDAO();
        const eventVendorDao = daoFactory.getEventVendorDAO();
        const vendorService = new VendorService(vendorDAO, bucketDao, eventVendorDao);

        const vendorData: TablesUpdate<'Vendors'> = {
            name: validatedFields.data.name,
            description: validatedFields.data.description,
            admin_id: validatedFields.data.admin_id,
        };

        await vendorService.updateVendor(parseInt(validatedFields.data.id, 10), vendorData, picture || undefined);

        revalidatePath(`/admin/vendors/${validatedFields.data.id}`);

        return { message: "Vendor updated successfully!" };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Failed to update vendor. Please try again.",
        };
    }
}

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
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred')
        };
    }
}

export async function getVendors() {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const vendorDAO = daoFactory.getVendorDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const vendorService = new VendorService(vendorDAO, bucketDao, eventVendorDao);

    try {
        return await vendorService.getAllVendors();
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getAdminVendors(adminId: string) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const vendorDAO = daoFactory.getVendorDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const vendorService = new VendorService(vendorDAO, bucketDao, eventVendorDao);

    try {
        return await vendorService.getAdminVendors(adminId);
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'An unknown error occurred' };
    }
}

export async function getVendorEvents(vendorId: number) {
    'use server'
    const daoFactory: DAOFactory = new SupabaseDAOFactory();
    const vendorDAO = daoFactory.getVendorDAO();
    const bucketDao = daoFactory.getBucketDAO();
    const eventVendorDao = daoFactory.getEventVendorDAO();
    const vendorService = new VendorService(vendorDAO, bucketDao, eventVendorDao);

    try {
        return await vendorService.getVendorEvents(vendorId);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred')
        };
    }
}