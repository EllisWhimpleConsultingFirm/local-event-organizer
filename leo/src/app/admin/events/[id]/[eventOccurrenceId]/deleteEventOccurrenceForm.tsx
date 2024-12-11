'use client';

import React from 'react';
import {useFormState, useFormStatus} from 'react-dom';
import {Tables} from "../../../../../../types/supabase";
import { deleteEventOccurrence, FormState} from "@/actions/event";

interface DeleteEventOccurrenceFormProps {
    eventOccurrence: Tables<'Event_Occurrences'>;
}

function DeleteButton() {
    const {pending} = useFormStatus();

    return (
        <button
            disabled={pending}
            type="submit"
            className="bg-red hover:bg-darkred text-white p-2 rounded"
        >
            {pending ? 'Deleting...' : 'Delete Event Occurrence'}
        </button>
    );
}

export function DeleteEventOccurrenceForm({eventOccurrence}: DeleteEventOccurrenceFormProps) {
    const [state, action] = useFormState<FormState, FormData>(deleteEventOccurrence, {} as FormState);

    return (
        <form className="flex flex-col gap-4 pt-4" action={action}>
            <input type="hidden" name="id" value={eventOccurrence.id} />
            <input type="hidden" name="eventId" value={eventOccurrence.id} />
            <DeleteButton />
            {state?.message && <p className="mt-2 text-sm text-green-600">{state.message}</p>}
        </form>
    );
}