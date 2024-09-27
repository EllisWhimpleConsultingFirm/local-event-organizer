import {DAOFactory} from "@/DAO/interface/Factory";
import {EventsDAO} from "@/DAO/interface/EventsDAO";
import {SupabaseEventsDAO} from "@/DAO/supabase/SupabaseEventsDAO";

export class SupabaseDAOFactory implements DAOFactory {

    getEventsDAO(): EventsDAO {
        return new SupabaseEventsDAO();
    };

}