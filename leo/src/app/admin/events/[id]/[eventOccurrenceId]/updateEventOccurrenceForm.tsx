'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { FormState, updateEventOccurrence } from '@/actions/event';
import { Clock } from 'lucide-react';
import {DeleteEventOccurrenceForm} from "@/app/admin/events/[id]/[eventOccurrenceId]/deleteEventOccurrenceForm";
import {Tables} from "../../../../../../types/supabase";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg
                       hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {pending ? 'Updating...' : 'Update Event Occurrence'}
        </button>
    );
}

interface UpdateEventOccurrenceFormProps {
    eventOccurrence: Tables<'Event_Occurrences'>
}

export function UpdateEventOccurrenceForm({ eventOccurrence }: UpdateEventOccurrenceFormProps) {
    const [state, action] = useFormState<FormState, FormData>(updateEventOccurrence, {} as FormState);

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800">Update Event Time & Details</h2>
            </div>

            <div className="p-6">
                <form action={action} className="space-y-6">
                    <input type="hidden" name="id" value={eventOccurrence.id} />

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={eventOccurrence.description ?? "Description Not Found"}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                                     focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors
                                     resize-none"
                            placeholder="Enter event description..."
                        />
                        {state?.errors?.description && (
                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                {state.errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                                Start Time
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="datetime-local"
                                    id="startTime"
                                    name="startTime"
                                    defaultValue={eventOccurrence.start_time ?? "Start Time Not Found"}
                                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg
                                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                             outline-none transition-colors"
                                />
                            </div>
                            {state?.errors?.name && (
                                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                    {state.errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                                End Time
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="datetime-local"
                                    id="endTime"
                                    name="endTime"
                                    defaultValue={eventOccurrence.end_time ?? "End Time Not Found"}
                                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg
                                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                             outline-none transition-colors"
                                />
                            </div>
                            {state?.errors?.name && (
                                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                    {state.errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <SubmitButton />
                        {state?.message && (
                            <p className="text-sm text-green-600 bg-green-50 p-4 rounded-lg">
                                {state.message}
                            </p>
                        )}
                    </div>
                </form>
            </div>

            <div className="pl-6 pr-6 pb-6">
                <DeleteEventOccurrenceForm eventOccurrence={eventOccurrence} />
            </div>
        </div>
    );
}