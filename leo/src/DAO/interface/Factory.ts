import {EventsDAO} from "@/DAO/interface/EventsDAO";
import {BucketDAO} from "@/DAO/interface/BucketDAO";
import {EventVendorDAO} from "@/DAO/interface/EventVendorDAO";
import {VendorDAO} from "@/DAO/interface/VendorDAO";
import {EventOccurrenceDAO} from "@/DAO/interface/EventOccurrenceDAO";
import {EventOccurrenceVendorDAO} from "@/DAO/interface/EventOccurrenceVendorDAO";
import {EventApplicationDAO} from "@/DAO/interface/EventApplicationDAO";
import {EventOccurrenceApplicationDAO} from "@/DAO/interface/EventOccurrenceApplicationDAO";

export interface DAOFactory {
    getEventsDAO(): EventsDAO
    getVendorDAO(): VendorDAO
    getBucketDAO(): BucketDAO
    getEventVendorDAO(): EventVendorDAO
    getEventOccurrenceVendorDAO(): EventOccurrenceVendorDAO
    getEventOccurrencesDAO(): EventOccurrenceDAO
    getEventApplicationDAO(): EventApplicationDAO
    getEventOccurrenceApplicationDAO(): EventOccurrenceApplicationDAO
}