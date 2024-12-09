'use client';

import React from 'react';
import {useFormState, useFormStatus} from 'react-dom';
import {FormState, updateEventOccurrence} from '@/actions/event';
import {Tables} from "../../../../../../types/supabase";

interface UpdateEventOccurrenceFormProps {
    eventOccurrence: Tables<'Event_Occurrences'>;
}

function SubmitButton() {
    const {pending} = useFormStatus();

    return (
        <button disabled={pending} type="submit" className="bg-blue-500 text-white p-2 rounded">
            {pending ? 'Updating...' : 'Update Event Occurrence'}
        </button>
    );
}

export function UpdateEventOccurrenceForm({eventOccurrence}: UpdateEventOccurrenceFormProps) {
    const [state, action] = useFormState<FormState, FormData>(updateEventOccurrence, {} as FormState);

    return (
        <form action={action} className="space-y-4">
            <input type="hidden" name="id" value={eventOccurrence.id}/>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={eventOccurrence.description ?? "Description Not Found"}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {state?.errors?.description && <p className="mt-2 text-sm text-red-600">{state.errors.description}</p>}
            </div>
            <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                    type={"datetime-local"}
                    id="startTime"
                    name="startTime"
                    defaultValue={eventOccurrence.start_time ?? "Start Time Not Found"}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {state?.errors?.name && <p className="mt-2 text-sm text-red-600">{state.errors.name}</p>}
            </div>
            <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                    type={"datetime-local"}
                    id="endTime"
                    name="endTime"
                    defaultValue={eventOccurrence.end_time ?? "End Time Not Found"}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {state?.errors?.name && <p className="mt-2 text-sm text-red-600">{state.errors.name}</p>}
            </div>
            <SubmitButton/>
            {state?.message && <p className="mt-2 text-sm text-green-600">{state.message}</p>}
        </form>
    );
}