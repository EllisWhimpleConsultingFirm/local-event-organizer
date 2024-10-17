import {Tables} from "../../../../types/database.types";
import {Button} from "@/components/util/button";

export default function EventOccurrenceCard({ eventOccurrence }: { eventOccurrence: Tables<'Event_Occurences'> }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold mb-2">{eventOccurrence.start_time}</h2>
                <h2 className="text-xl font-bold mb-2">-</h2>
                <h2 className="text-xl font-bold mb-2">{eventOccurrence.end_time}</h2>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between">
                <Button style={'px-4'}>Edit</Button>
                <Button style={'px-4'}>Remove</Button>
            </div>
        </div>
    );
};