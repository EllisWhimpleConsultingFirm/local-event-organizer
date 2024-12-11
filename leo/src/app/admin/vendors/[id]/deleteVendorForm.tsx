'use client';

import React from 'react';
import {useFormState, useFormStatus} from 'react-dom';
import {deleteVendor, FormState} from '@/actions/vendor';
import {Tables} from "../../../../../types/supabase";

interface UpdateEventFormProps {
    vendor: Tables<'Vendors'>;
}

function DeleteButton() {
    const {pending} = useFormStatus();

    return (
        <button
            disabled={pending}
            type="submit"
            className="bg-red hover:bg-darkred text-white p-2 rounded"
        >
            {pending ? 'Deleting...' : 'Delete Vendor'}
        </button>
    );
}

export function DeleteVendorForm({vendor}: UpdateEventFormProps) {
    const [state, action] = useFormState<FormState, FormData>(deleteVendor, {} as FormState);

    return (
        <form className="flex flex-col gap-4" action={action}>
            <input type="hidden" name="id" value={vendor.id} />
            <DeleteButton />
            {state?.message && <p className="mt-2 text-sm text-green-600">{state.message}</p>}
        </form>
    );
}