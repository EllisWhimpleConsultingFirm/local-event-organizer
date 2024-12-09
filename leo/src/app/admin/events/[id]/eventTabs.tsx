'use client'

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/util/tabs";
import {BasicCard} from "@/components/util/basicCard";
import {CardContent} from "@/components/util/cardContent";
import Image from "next/image";
import React from "react";
import {Tables} from "../../../../../types/supabase";
import {VendorApplicationButtonModal} from "@/app/admin/events/[id]/vendorApplicationButtonModal";
import Link from "next/link";
import {ArrowRight, Calendar, CalendarDays, Clock} from "lucide-react";
import {formatDate, formatTime, getDurationString, isSameDay} from "@/utils/app/dates";

interface eventTabsProps {
    eventVendors: Tables<'Vendors'>[]
    event: Tables<'Events'>
    pendingVendors : { vendor: Tables<"Vendors">, application: Tables<"Event_Applications">}[]
    eventOccurrences : Tables<'Event_Occurrences'>[]
}

export async function EventTabs({eventVendors, event, pendingVendors, eventOccurrences}: eventTabsProps) {
    return (
        <Tabs defaultValue="eventOccurrences" className="w-full pt-5">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="eventOccurrences">Event Occurrences</TabsTrigger>
                <TabsTrigger value="currentVendors">Current Vendors</TabsTrigger>
                <TabsTrigger value="vendorApplications">Vendor Applications</TabsTrigger>
            </TabsList>
            <TabsContent value="eventOccurrences" className="mt-6">
                <div className="p-10">
                    <h2 className="text-2xl font-bold mb-4 text-center">Your Event Occurrences</h2>
                    {!eventOccurrences || eventOccurrences.length === 0 ? (
                            <div className="text-center text-2xl text-red-600 mt-10">No Event Occurrences Found</div>
                        )
                        :
                        (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {eventOccurrences.map(async (eventOccurrence) => {
                                return (
                                    <Link href={`/admin/events/${eventOccurrence.event_id}/${eventOccurrence.id}`} key={eventOccurrence.id} className="block">
                                        <BasicCard>
                                            <CardContent>
                                                <div className="mt-3 bg-gray-50 rounded-lg p-6 border border-gray-200">
                                                    <div className="space-y-4">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-16 h-16 flex-shrink-0 bg-blue-100 rounded-lg flex flex-col items-center justify-center text-blue-700">
                                                                <Calendar className="w-6 h-6 mb-1" />
                                                                <span className="text-xs font-medium">Date</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                {isSameDay(eventOccurrence.start_time, eventOccurrence.end_time) ? (
                                                                    <p className="text-gray-900 font-medium">
                                                                        {formatDate(eventOccurrence.start_time)}
                                                                    </p>
                                                                ) : (
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="text-gray-900 font-medium">
                                                                                {formatDate(eventOccurrence.start_time)}
                                                                            </p>
                                                                            <ArrowRight className="w-4 h-4 text-gray-400" />
                                                                            <p className="text-gray-900 font-medium">
                                                                                {formatDate(eventOccurrence.end_time)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <p className="text-gray-500 text-sm mt-1">
                                                                    Duration: {getDurationString(eventOccurrence.start_time, eventOccurrence.end_time)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-4">
                                                            <div className="w-16 h-16 flex-shrink-0 bg-green-100 rounded-lg flex flex-col items-center justify-center text-green-700">
                                                                <Clock className="w-6 h-6 mb-1" />
                                                                <span className="text-xs font-medium">Time</span>
                                                            </div>
                                                            <div className="flex-1 flex items-center gap-3">
                                                                <div>
                                                                    <p className="text-gray-900 font-medium">
                                                                        {formatTime(eventOccurrence.start_time)}
                                                                    </p>
                                                                    <p className="text-gray-500 text-sm">Start</p>
                                                                </div>
                                                                <div className="text-gray-400 flex-1 border-t border-dashed border-gray-300 relative top-3">
                                                                    <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2">to</span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-900 font-medium">
                                                                        {formatTime(eventOccurrence.end_time)}
                                                                    </p>
                                                                    <p className="text-gray-500 text-sm">End</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </BasicCard>
                                    </Link>
                                );
                            })}
                        </div>)}
                </div>
            </TabsContent>
            <TabsContent value="currentVendors" className="mt-6">
                <div className="p-10">
                    {!eventVendors || eventVendors.length === 0 ? (
                            <div className="text-center text-2xl text-red-600 mt-10">No Vendors Found</div>
                        )
                        :
                        (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {eventVendors.map(async (vendor) => {
                                return (
                                    <BasicCard>
                                        <CardContent>
                                            <Image src={vendor.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!} alt={vendor.description ?? "DESCRIPTION"} width={250} height={250} className="w-full h-48 object-cover" />
                                            <div className="p-4">
                                                <h4 className="text-lg font-semibold mb-2">{vendor.name}</h4>
                                                <p className="text-gray-600">{vendor.description}</p>
                                            </div>
                                        </CardContent>
                                    </BasicCard>
                                );
                            })}
                        </div>)}
                </div>
            </TabsContent>
            <TabsContent value="vendorApplications" className="mt-6">
                <div className="p-10">
                    {!pendingVendors || pendingVendors.length === 0 ? (
                            <div className="text-center text-2xl text-red-600 mt-10">No Vendors Found</div>
                        )
                        :
                        (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {pendingVendors.map(async (object) => {
                                return (
                                    <VendorApplicationButtonModal vendorApplication={object} event={event}>
                                        <BasicCard>
                                            <CardContent>
                                                <Image src={object.vendor.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!} alt={object.vendor.description ?? "DESCRIPTION"} width={250} height={250} className="w-full h-48 object-cover" />
                                                <div className="p-4">
                                                    <h4 className="text-lg font-semibold mb-2">{object.vendor.name}</h4>
                                                    <p className="text-gray-600">{object.vendor.description}</p>
                                                    <p className="text-gray-600">{object.application.message}</p>
                                                </div>
                                            </CardContent>
                                        </BasicCard>
                                    </VendorApplicationButtonModal>
                                );
                            })}
                        </div>)}
                </div>
            </TabsContent>
        </Tabs>
    )
}