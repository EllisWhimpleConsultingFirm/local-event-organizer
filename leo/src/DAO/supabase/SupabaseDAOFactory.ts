import {DAOFactory} from "@/DAO/interface/Factory";
import {EventsDAO} from "@/DAO/interface/EventsDAO";
import {SupabaseEventsDAO} from "@/DAO/supabase/SupabaseEventsDAO";
import {BucketDAO} from "@/DAO/interface/BucketDAO";
import {SupabaseBucketDAO} from "@/DAO/supabase/SupabaseBucketDAO";

export class SupabaseDAOFactory implements DAOFactory {

    getEventsDAO(): EventsDAO {
        return new SupabaseEventsDAO();
    };

    getBucketDAO(): BucketDAO {
        return new SupabaseBucketDAO();
    }

}