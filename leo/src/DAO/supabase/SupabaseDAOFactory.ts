import {DAOFactory} from "@/DAO/interface/Factory";
import {EventsDAO} from "@/DAO/interface/EventsDAO";
import {SupabaseEventsDAO} from "@/DAO/supabase/SupabaseEventsDAO";
import {BucketDAO} from "@/DAO/interface/BucketDAO";
import {SupabaseBucketDAO} from "@/DAO/supabase/SupabaseBucketDAO";
import {EventOccurrenceDAO} from "@/DAO/interface/EventOccurrenceDAO";
import {EventVendorDAO} from "@/DAO/interface/EventVendorDAO";
import {VendorDAO} from "@/DAO/interface/VendorDAO";
import {SupabaseEventOccurrenceDAO} from "@/DAO/supabase/SupabaseEventOccurrenceDAO";
import {SupabaseEventVendorDAO} from "@/DAO/supabase/SupabaseEventVendorDAO";
import {SupabaseVendorDAO} from "@/DAO/supabase/SupabaseVendorDAO";
import {EventApplicationDAO} from "@/DAO/interface/EventApplicationDAO";
import {SupabaseEventApplicationDAO} from "@/DAO/supabase/SupabaseEventApplicationDAO";
import {EventOccurrenceApplicationDAO} from "@/DAO/interface/EventOccurrenceApplicationDAO";
import {SupabaseEventOccurrenceApplicationDAO} from "@/DAO/supabase/SupabaseEventOccurrenceApplciationDAO";
import {EventOccurrenceVendorDAO} from "@/DAO/interface/EventOccurrenceVendorDAO";
import {SupabaseEventOccurrenceVendorDAO} from "@/DAO/supabase/SupabaseEventOccurrenceVendorDAO";

export class SupabaseDAOFactory implements DAOFactory {

    getEventsDAO(): EventsDAO {
        return new SupabaseEventsDAO();
    };

    getBucketDAO(): BucketDAO {
        return new SupabaseBucketDAO();
    }

    getEventOccurrencesDAO(): EventOccurrenceDAO {
        return new SupabaseEventOccurrenceDAO();
    }

    getEventVendorDAO(): EventVendorDAO {
        return new SupabaseEventVendorDAO();
    }

    getVendorDAO(): VendorDAO {
        return new SupabaseVendorDAO();
    }

    getEventApplicationDAO(): EventApplicationDAO {
        return new SupabaseEventApplicationDAO()
    }

    getEventOccurrenceApplicationDAO(): EventOccurrenceApplicationDAO {
        return new SupabaseEventOccurrenceApplicationDAO()
    }

    getEventOccurrenceVendorDAO(): EventOccurrenceVendorDAO {
        return new SupabaseEventOccurrenceVendorDAO()
    }
}