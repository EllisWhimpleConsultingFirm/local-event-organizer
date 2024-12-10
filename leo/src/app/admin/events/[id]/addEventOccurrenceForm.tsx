'use client';

import React, { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import {addEventOccurrence, EventOccurrenceFormState} from "@/actions/event";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending} type="submit" className="bg-blue-500 text-white p-2 rounded">
            {pending ? 'Adding...' : 'Add Event Occurrence'}
        </button>
    );
}

export function AddEventOccurrenceForm({ onSuccess, eventId }: { onSuccess: () => void, eventId: number }) {
    const initialState: EventOccurrenceFormState = {};
    const [state, action] = useFormState(addEventOccurrence, initialState);

    useEffect(() => {
        if (state.message === "Event Occurrence added successfully!") {
            onSuccess();
        }
    }, [state, onSuccess]);

    return (
        <form action={action} className="space-y-4">
            <input
                type="hidden"
                name="event_id"
                value={eventId}
            />

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {state?.errors?.description && <p className="mt-2 text-sm text-red-600">{state.errors.description}</p>}
            </div>

            <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                    type="datetime-local"
                    id="start_time"
                    name="start_time"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {state?.errors?.start_time && <p className="mt-2 text-sm text-red-600">{state.errors.start_time}</p>}
            </div>

            <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                    type="datetime-local"
                    id="end_time"
                    name="end_time"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {state?.errors?.end_time && <p className="mt-2 text-sm text-red-600">{state.errors.end_time}</p>}
            </div>

            <SubmitButton />
            {state?.message && <p className="mt-2 text-sm text-green-600">{state.message}</p>}
        </form>
    );
}