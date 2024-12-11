import {Tables} from "../../../types/supabase";
import {BasicCard} from "@/components/util/basicCard";
import {CardContent} from "@/components/util/cardContent";

export function EventOccurrenceCard({
                                 eventOccurrence,
                                 isSelected,
                                 onClick
                             }: {
    eventOccurrence: Tables<'Event_Occurrences'>,
    isSelected: boolean,
    onClick: () => void
}) {
    return (
        <div onClick={onClick}>
            <BasicCard className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
                <CardContent className="p-6">
                    <div className="flex justify-between mb-4">
                        <h2 className="text font-semibold">{eventOccurrence.start_time}</h2>
                        <h2 className="text font-semibold">-</h2>
                        <h2 className="text font-semibold">{eventOccurrence.end_time}</h2>
                    </div>
                    <p className="text-gray-600">{eventOccurrence.description}</p>
                </CardContent>
            </BasicCard>
        </div>
    );
}