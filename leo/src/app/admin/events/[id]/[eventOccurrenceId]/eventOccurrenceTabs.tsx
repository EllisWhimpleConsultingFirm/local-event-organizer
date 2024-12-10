'use client'

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/util/tabs";
import {BasicCard} from "@/components/util/basicCard";
import {CardContent} from "@/components/util/cardContent";
import Image from "next/image";
import React from "react";
import {Tables} from "../../../../../../types/supabase";
import {VendorApplicationButtonModal} from "@/app/admin/events/[id]/vendorApplicationButtonModal";

interface eventOccurrenceTabsProps {
    eventVendors: Tables<'Vendors'>[]
    pendingVendors : { vendor: Tables<"Vendors">, application: Tables<"Event_Occurrence_Applications">}[]
    event: Tables<"Events">
}

export async function EventOccurrenceTabs({eventVendors, pendingVendors, event}: eventOccurrenceTabsProps) {
    return (
        <Tabs defaultValue="currentVendors" className="w-full pt-5">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="currentVendors">Current Vendors</TabsTrigger>
                <TabsTrigger value="vendorApplications">Vendor Applications</TabsTrigger>
            </TabsList>
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