'use client';

import React from 'react';
import {useFormState, useFormStatus} from 'react-dom';
import {Tables} from "../../../../../types/supabase";
import {deleteEvent, FormState} from "@/actions/event";

interface UpdateEventFormProps {
    event: Tables<'Events'>;
}

function DeleteButton() {
    const {pending} = useFormStatus();

    return (
        <button
            disabled={pending}
            type="submit"
            className="bg-red hover:bg-darkred text-white p-2 rounded"
        >
            {pending ? 'Deleting...' : 'Delete Event'}
        </button>
    );
}

export function DeleteEventForm({event}: UpdateEventFormProps) {
    const [state, action] = useFormState<FormState, FormData>(deleteEvent, {} as FormState);

    return (
        <form action={action}>
            <input type="hidden" name="id" value={event.id} />
            <DeleteButton />
        </form>
    );
}