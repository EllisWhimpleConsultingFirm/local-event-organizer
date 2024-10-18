import {EventsDAO} from "@/DAO/interface/EventsDAO";
import {BucketDAO} from "@/DAO/interface/BucketDAO";

export interface DAOFactory {
    getEventsDAO(): EventsDAO
    getBucketDAO(): BucketDAO
}