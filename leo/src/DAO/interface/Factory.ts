import {EventsDAO} from "@/DAO/interface/EventsDAO";

export interface DAOFactory {
    getEventsDAO(): EventsDAO
}