'use client'

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/util/tabs";
import {ApplicationButtonModal} from "@/app/admin/vendors/[id]/applicationButtonModal";
import {BasicCard} from "@/components/util/basicCard";
import {CardContent} from "@/components/util/cardContent";
import Image from "next/image";
import React from "react";
import {Tables} from "../../../../../types/supabase";

interface vendorTabsProps {
    events: Tables<'Events'>[]
    vendorEvents: Tables<'Events'>[]
    vendor: Tables<'Vendors'>
    pendingEvents : {eventOccurrenceApplications: {event: Tables<"Events">, eventOccurrence: Tables<"Event_Occurrences">, application: Tables<"Event_Occurrence_Applications">}[], eventApplications: {event: Tables<"Events">, application: Tables<"Event_Applications">}[]}
}

export async function VendorTabs({events, vendor, vendorEvents, pendingEvents}: vendorTabsProps) {
    return (
        <Tabs defaultValue="event" className="w-full pt-5">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="events">Scheduled Events</TabsTrigger>
                <TabsTrigger value="pending">Pending Application</TabsTrigger>
                <TabsTrigger value="apply">Apply to Events</TabsTrigger>
            </TabsList>
            <TabsContent value="events" className="mt-6">
                <div className="p-10">
                    <h2 className="text-2xl font-bold mb-4 text-center">Events that you are Scheduled for</h2>
                    {!vendorEvents || "error" in vendorEvents || vendorEvents.length === 0 ? (
                            <div className="text-center text-2xl text-red-600 mt-10">No Events Found</div>
                        )
                        :
                        (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {vendorEvents.map(async (event) => {
                                if (event.name) {
                                    return (
                                        <ApplicationButtonModal event={event} vendor={vendor} key={event.id}>
                                            <BasicCard>
                                                <CardContent>
                                                    <Image src={event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!} alt={event.name} width={250} height={250} className="w-full h-48 object-cover" />
                                                    <div className="p-4">
                                                        <h4 className="text-lg font-semibold mb-2">{event.name}</h4>
                                                        <p className="text-gray-600">{event.description}</p>
                                                    </div>
                                                </CardContent>
                                            </BasicCard>
                                        </ApplicationButtonModal>
                                    );
                                }
                                return null;
                            })}
                        </div>)}
                </div>
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
                <div className="p-10">
                    <h2 className="text-2xl font-bold mb-4 text-center">Pending Event Occurrence Applications</h2>
                    {!pendingEvents.eventOccurrenceApplications || pendingEvents.eventOccurrenceApplications.length === 0 ? (
                            <div className="text-center text-2xl text-red-600 mt-10">No Pending Event Occurrence Applications Found</div>
                        )
                        :
                        (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {pendingEvents.eventOccurrenceApplications.map(async (object) => {
                                if (object.event.name) {
                                    return (
                                        <BasicCard>
                                            <CardContent>
                                                <Image src={object.event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!} alt={object.event.description ?? "Description"} width={250} height={250} className="w-full h-48 object-cover" />
                                                <div className="p-4">
                                                    <h4 className="text-lg font-semibold mb-2">{object.event.name}</h4>
                                                    <p className="text-gray-600">{object.event.description}</p>
                                                    <p className="text-gray-600 pt-4">MESSAGE: {object.application.message}</p>
                                                </div>
                                            </CardContent>
                                        </BasicCard>
                                    );
                                }
                                return null;
                            })}
                        </div>)}
                    <h2 className="text-2xl font-bold mb-4 text-center pt-10">Pending Event Applications</h2>
                    {!pendingEvents.eventApplications || pendingEvents.eventApplications.length === 0 ? (
                            <div className="text-center text-2xl text-red-600 mt-10">No Pending Event Applications Found</div>
                        )
                        :
                        (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {pendingEvents.eventApplications.map(async (object) => {
                                if (object.event.name) {
                                    return (
                                        <BasicCard>
                                            <CardContent>
                                                <Image src={object.event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!} alt={object.event.description ?? "Description"} width={250} height={250} className="w-full h-48 object-cover" />
                                                <div className="p-4">
                                                    <h4 className="text-lg font-semibold mb-2">{object.event.name}</h4>
                                                    <p className="text-gray-600">{object.event.description}</p>
                                                    <p className="text-gray-600 pt-4">MESSAGE: {object.application.message}</p>
                                                </div>
                                            </CardContent>
                                        </BasicCard>
                                    );
                                }
                                return null;
                            })}
                        </div>)}
                </div>
            </TabsContent>
            <TabsContent value="apply" className="mt-6">
                <div className="p-10">
                    <h2 className="text-2xl font-bold mb-4 text-center">Apply to Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {events.map(async (event) => {
                            if (event.name) {
                                return (
                                    <ApplicationButtonModal event={event} vendor={vendor} key={event.id}>
                                        <BasicCard>
                                            <CardContent>
                                                <Image src={event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!} alt={event.name} width={250} height={250} className="w-full h-48 object-cover" />
                                                <div className="p-4">
                                                    <h4 className="text-lg font-semibold mb-2">{event.name}</h4>
                                                    <p className="text-gray-600">{event.description}</p>
                                                </div>
                                            </CardContent>
                                        </BasicCard>
                                    </ApplicationButtonModal>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    )
}