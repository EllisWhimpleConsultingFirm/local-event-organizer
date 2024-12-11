import {useFormState, useFormStatus} from "react-dom";
import React, {useEffect, useState} from "react";
import {
    addEventApplication,
    addEventOccurrenceApplication,
    ApplicationFormState,
} from "@/actions/applications";
import {Tables} from "../../../../../types/supabase";
import {getEventOccurrencesByEventId} from "@/actions/event";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/util/tabs";
import {EventOccurrencesCarousel} from "@/components/eventOccurrence/eventOccurrencesCarousel";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending} type="submit" className="bg-blue-500 text-white p-2 rounded">
            {pending ? 'Submitting...' : 'Submit Application'}
        </button>
    );
}

interface CreateApplicationFormProps {
    event: Tables<'Events'>;
    vendor: Tables<'Vendors'>;
    onSuccess: () => void
}

export function CreateApplicationForm({ event, vendor, onSuccess }: CreateApplicationFormProps) {
    const [eventOccurrences, setEventOccurrences] = useState<Tables<'Event_Occurrences'>[]>([]);
    const [selectedOccurrence, setSelectedOccurrence] = useState<Tables<'Event_Occurrences'> | null>(null);

    useEffect(() => {
        const loadEventOccurrences = async () => {
            let occurrences = await getEventOccurrencesByEventId(event.id);

            if (!occurrences || "error" in occurrences) {
                occurrences = []
            }

            setEventOccurrences(occurrences);
        };
        loadEventOccurrences();
    }, [event.id]);

    return (
        <div className="space-y-6">
            <Tabs defaultValue="event" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="event">Apply to all Occurrences</TabsTrigger>
                    <TabsTrigger value="occurrences">Apply to Specific Occurrence</TabsTrigger>
                </TabsList>

                <TabsContent value="event" className="mt-6">
                    <ApplicationForm
                        event={event}
                        vendor={vendor}
                        onSuccess={onSuccess}
                        eventOccurrence={selectedOccurrence}
                        actionFunction={addEventApplication}
                    />
                </TabsContent>

                <TabsContent value="occurrences" className="mt-6 space-y-6">
                    <EventOccurrencesCarousel
                        eventOccurrences={eventOccurrences}
                        selectedOccurrence={selectedOccurrence}
                        onSelect={setSelectedOccurrence}
                    />

                    {(selectedOccurrence) && (
                        <div className="mt-6">
                            <ApplicationForm
                                event={event}
                                vendor={vendor}
                                onSuccess={onSuccess}
                                eventOccurrence={selectedOccurrence}
                                actionFunction={addEventOccurrenceApplication}
                            />
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}


function ApplicationForm({
                             event,
                             vendor,
                             onSuccess,
                             eventOccurrence = null,
                             actionFunction
                         }: {
    event: Tables<'Events'>,
    vendor: Tables<'Vendors'>,
    onSuccess: () => void,
    eventOccurrence: Tables<'Event_Occurrences'> | null,
    actionFunction: (prevState: ApplicationFormState, formData: FormData) => Promise<ApplicationFormState>
}) {
    const initialState: ApplicationFormState = {};
    const [state, action] = useFormState(actionFunction, initialState);

    useEffect(() => {
        if (state.message === "Application submitted successfully!") {
            onSuccess();
        }
    }, [state, onSuccess]);

    return (
        <form action={action} className="space-y-4">
            <input type="hidden" name="event_id" value={event.id}/>
            <input type="hidden" name="vendor_id" value={vendor.id}/>
            <input type="hidden" name="status" value="PENDING"/>
            {eventOccurrence && (
                <input type="hidden" name="event_occurrence_id" value={eventOccurrence.id}/>
            )}
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Send a message to the Event Admin
                </label>
                <input
                    id="message"
                    name="message"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {state?.errors?.message && (
                    <p className="mt-2 text-sm text-red-600">{state.errors.message}</p>
                )}
            </div>
            <SubmitButton />
            {state?.message && (
                <p className="mt-2 text-sm text-green-600">{state.message}</p>
            )}
        </form>
    );
}
