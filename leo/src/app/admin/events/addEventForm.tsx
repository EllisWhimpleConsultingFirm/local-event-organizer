'use client';

import React, { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { addEvent, FormState } from '@/actions/event';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending} type="submit" className="bg-blue-500 text-white p-2 rounded">
            {pending ? 'Adding...' : 'Add Event'}
        </button>
    );
}

export function EventForm({ onSuccess }: { onSuccess: () => void }) {
    const initialState: FormState = {};
    const [state, action] = useFormState(addEvent, initialState);

    useEffect(() => {
        if (state.message === "Event added successfully!") {
            onSuccess();
        }
    }, [state, onSuccess]);

    return (
        <form action={action} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name</label>
                <input
                    id="name"
                    name="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {state?.errors?.name && <p className="mt-2 text-sm text-red-600">{state.errors.name}</p>}
            </div>
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
                <label htmlFor="admin_id" className="block text-sm font-medium text-gray-700">Admin ID</label>
                <input
                    id="admin_id"
                    name="admin_id"
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {state?.errors?.admin_id && <p className="mt-2 text-sm text-red-600">{state.errors.admin_id}</p>}
            </div>
            <div>
                <label htmlFor="picture" className="block text-sm font-medium text-gray-700">Picture</label>
                <input
                    type="file"
                    id="picture"
                    name="picture"
                    required
                    className="mt-1 block w-full"
                />
                {state?.errors?.picture && <p className="mt-2 text-sm text-red-600">{state.errors.picture}</p>}
            </div>
            <SubmitButton />
            {state?.message && <p className="mt-2 text-sm text-green-600">{state.message}</p>}
        </form>
    );
}