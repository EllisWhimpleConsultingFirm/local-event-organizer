import {FormEvent, useState} from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { updateEvent, FormState } from '@/actions/event';
import { EventWithPicture } from "@/services/events";

interface UpdateEventFormProps {
    event: EventWithPicture;
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending} type="submit" className="bg-blue-500 text-white p-2 rounded">
            {pending ? 'Updating...' : 'Update Event'}
        </button>
    );
}



export function UpdateEventForm({ event }: UpdateEventFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [state, action] = useFormState<FormState, FormData>(updateEvent, {} as FormState);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null) // Clear previous errors when a new request starts

        try {
            const formData = new FormData(event.currentTarget)
            const response = await fetch('/api/submit', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to submit the data. Please try again.')
            }

            // Handle response if necessary
            const data = await response.json()
            // ...
        } catch (error : unknown) {
            // Capture the error message to display to the user
            if (error instanceof Error) {
                setError(error.message)
                console.error(error)
            }
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <input type="hidden" name="id" value={event.id} />
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name</label>
                <input
                    id="name"
                    name="name"
                    defaultValue={event.name ?? "Name Not Found"}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {state?.errors?.name && <p className="mt-2 text-sm text-red-600">{state.errors.name}</p>}
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={event.description ?? "Description Not Found"}
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
                    defaultValue={event.admin_id}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {state?.errors?.admin_id && <p className="mt-2 text-sm text-red-600">{state.errors.admin_id}</p>}
            </div>
            <div>
                <label htmlFor="picture" className="block text-sm font-medium text-gray-700">New Picture (optional)</label>
                <input
                    type="file"
                    id="picture"
                    name="picture"
                    className="mt-1 block w-full"
                />
                {state?.errors?.picture && <p className="mt-2 text-sm text-red-600">{state.errors.picture}</p>}
            </div>
            <SubmitButton />
            {state?.message && <p className="mt-2 text-sm text-green-600">{state.message}</p>}
        </form>
    );
}