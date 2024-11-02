import {EventsDAO} from "@/DAO/interface/EventsDAO";
import {BucketDAO} from "@/DAO/interface/BucketDAO";
import {EventVendorDAO} from "@/DAO/interface/EventVendorDAO";
import {VendorDAO} from "@/DAO/interface/VendorDAO";
import {EventOccurrenceDAO} from "@/DAO/interface/EventOccurrenceDAO";

export interface DAOFactory {
    getEventsDAO(): EventsDAO
    getVendorDAO(): VendorDAO
    getBucketDAO(): BucketDAO
    getEventVendorDAO(): EventVendorDAO
    getEventOccurrencesDAO(): EventOccurrenceDAO
}