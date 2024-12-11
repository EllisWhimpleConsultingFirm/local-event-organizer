import {Tables} from "../../../../types/database.types";
import {Button} from "@/components/util/button";

export default function EventOccurrenceCard({ eventOccurrence }: { eventOccurrence: Tables<'Event_Occurrences'> }) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);

    const startTime = formatter.format(new Date(eventOccurrence.start_time.toString()));
    const endTime = formatter.format(new Date(eventOccurrence.end_time.toString()));
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div className="flex justify-between">
                {startTime === endTime ? (
                    <h2 className="text-xl font-bold mb-2">{startTime}</h2>
                    ) : (
                    <>
                        <h2 className="text-xl font-bold mb-2">{startTime}</h2>
                        <h2 className="text-xl font-bold mb-2">-</h2>
                        <h2 className="text-xl font-bold mb-2">{endTime}</h2>
                    </>
                )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-between gap-4">
                <Button style={'px-4'}>Edit</Button>
                <Button style={'px-4'}>Remove</Button>
            </div>
        </div>
    );
};