import {Tables} from "../../../types/supabase";
import {useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {EventOccurrenceCard} from "@/components/eventOccurrence/eventOccurrenceCard";

export function EventOccurrencesCarousel({
                                      eventOccurrences,
                                      selectedOccurrence,
                                      onSelect
                                  }: {
    eventOccurrences: Tables<'Event_Occurrences'>[],
    selectedOccurrence: Tables<'Event_Occurrences'> | null,
    onSelect: (occurrence: Tables<'Event_Occurrences'>) => void
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 2;

    const nextSlide = () => {
        if (currentIndex + itemsPerPage < eventOccurrences.length) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center">
                <button
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    className="p-2 disabled:opacity-50"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                <div className="flex gap-4 overflow-hidden">
                    {eventOccurrences
                        .slice(currentIndex, currentIndex + itemsPerPage)
                        .map((occurrence) => (
                            <div key={occurrence.id} className="flex-1 align-center p-1 pt-4 pb-4">
                                <EventOccurrenceCard
                                    eventOccurrence={occurrence}
                                    isSelected={selectedOccurrence?.id === occurrence.id}
                                    onClick={() => onSelect(occurrence)}
                                />
                            </div>
                        ))}
                </div>

                <button
                    onClick={nextSlide}
                    disabled={currentIndex + itemsPerPage >= eventOccurrences.length}
                    className="p-2 disabled:opacity-50"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}