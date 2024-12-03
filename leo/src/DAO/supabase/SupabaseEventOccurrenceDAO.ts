import {EventOccurrenceDAO} from "@/DAO/interface/EventOccurrenceDAO";
import {createClient} from "@/utils/supabase/server";
import {Tables, TablesInsert, TablesUpdate} from "../../../types/database.types";
import {Filters} from "@/utils/filter-models";
import {haversineDistance} from "@/utils/get-distance";

export class SupabaseEventOccurrenceDAO implements EventOccurrenceDAO {
    private supabase = createClient();
    private TABLE = 'Event_Occurrences'

    async getEventOccurrences(filters?: Filters): Promise<Tables<'Event_Occurrences'>[]> {
        let query = this.supabase.from(this.TABLE).select()

        if (filters && filters.dateRange) {
            query = query.gte('start_time', filters.dateRange[0].toISOString());
            query = query.lte('end_time', filters.dateRange[1].toISOString());
        }

        const { data, error } = await query;

        if (error) { throw error; }

        if (!data) return [];

        return this.filterData(data, filters)
    }

    async getEventOccurrence(id: number): Promise<Tables<'Event_Occurrences'> | null> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .select()
            .eq('id', id)
            .single()

        if (error) { throw error }
        return data
    }

    filterData(data: Tables<'Event_Occurrences'>[], filters?: Filters): Tables<'Event_Occurrences'>[] {
        const filteredData = data.filter((event) => {
            // Apply distance filter
            if (filters?.distance && filters.userLocation && event.longitude && event.latitude) {
                const distance = haversineDistance(
                    filters?.userLocation?.lat,
                    filters?.userLocation?.lng,
                    event?.latitude,
                    event?.longitude
                );
                if (distance > filters.distance) {
                    return false;
                }
            }

            // Apply search filter
            if (filters?.search && !event.description?.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }

            // Apply vendor category filter
            if (filters?.vendorCategory && filters.vendorCategory.length > 0) {
                // if (!filters.vendorCategory.includes(event.vendorCategory)) {
                //     return false;
                // }
            }

            return true;
        });
        return filteredData as Tables<'Event_Occurrences'>[];
    }

    async getEventOccurrencesByEventId(
        eventId: number,
        filters?: Filters
    ): Promise<Tables<'Event_Occurrences'>[]> {
        let query = this.supabase
            .from(this.TABLE)
            .select()
            .eq('event_id', eventId);

        if (filters && filters.dateRange) {
            query = query.gte('start_time', filters.dateRange[0].toISOString());
            query = query.lte('end_time', filters.dateRange[1].toISOString());
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        if (!data) return [];

       return this.filterData(data, filters)
    }

    async addEventOccurrence(eventOccurrence: TablesInsert<'Event_Occurrences'>): Promise<Tables<'Event_Occurrences'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .insert(eventOccurrence)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to add event occurrence') }
        return data
    }

    async updateEventOccurrence(id: number, eventOccurrence: TablesUpdate<'Event_Occurrences'>): Promise<Tables<'Event_Occurrences'>> {
        const { data, error } = await this.supabase
            .from(this.TABLE)
            .update(eventOccurrence)
            .eq('id', id)
            .select()
            .single()

        if (error) { throw error }
        if (!data) { throw new Error('Failed to update event occurrence') }
        return data
    }

    async deleteEventOccurrence(id: number): Promise<void> {
        const { error } = await this.supabase
            .from(this.TABLE)
            .delete()
            .eq('id', id)

        if (error) { throw error }
    }
}