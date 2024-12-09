import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {UpdateVendorForm} from './updateVendorForm';
import {getVendor, getVendorEvents} from "@/actions/vendor";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {DeleteVendorForm} from "@/app/admin/vendors/[id]/deleteEventForm";
import { getEvents} from "@/actions/event";
import {VendorTabs} from "@/app/admin/vendors/[id]/vendorTabs";
import {getVendorPendingEvents} from "@/actions/applications";
import {Card} from "@/components/util/card";

interface EventDetailsProps {
    params: {
        id: string;
    };
}

export default async function EventDetails({ params }: EventDetailsProps) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    const vendor = await getVendor(parseInt(params.id, 10));

    const events = await getEvents()

    if (!vendor || "error" in vendor) {
        return <div>Error Retrieving Vendor Information</div>;
    }

    let vendorEvents = await getVendorEvents(vendor.id)

    const pendingVendorEvents = await getVendorPendingEvents(vendor.id)

    if (data.user.id !== vendor.admin_id) {
        return <div>You do not have permission to view this data</div>
    }

    if (!events || "error" in events) {
        return <div>Error Retrieving Event Information</div>;
    }

    if (!vendorEvents || "error" in vendorEvents) {
        return <div>Error Retrieving Event that you are scheduled for</div>;
    }

    if (!pendingVendorEvents || "error" in pendingVendorEvents) {
        return <div>Error Retrieving Your Pending Applications</div>;
    }


    return (
        <div className="container mx-auto p-4">
            <Link href="/admin/vendors" className="text-blue-500 hover:underline mb-4 block">
                &larr; Back to My Shops
            </Link>
            <div className="flex flex-row space-x-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-4">{vendor.name}</h1>
                    <div className="mb-4">
                        <Image
                            src={vendor.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                            alt={vendor.name ?? "Name Not Found"}
                            width={500}
                            height={300}
                            className="rounded-lg"
                        />
                    </div>
                    <p className="text-gray-700 mb-4">{vendor.description}</p>
                    <p className="text-sm text-gray-500">Admin ID: {vendor.admin_id}</p>
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">Update Vendor</h2>
                    <div className="p-3">
                        <UpdateVendorForm vendor={vendor} />
                    </div>
                    <div className="p-3">
                        <DeleteVendorForm vendor={vendor} />
                    </div>
                </div>
            </div>
            <div className="p-10">
                <h2 className="text-2xl font-bold mb-4 text-center">Apply to Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {events.map(async (event) => {
                        if (event.name) {
                            return (
                                <Link href={`/events/${event.id}`} key={event.id}>
                                    <Card
                                        key={event.id}
                                        title={event.name}
                                        description={event.description ?? "No Description"}
                                        image={event.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                                    />
                                </Link>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
            <VendorTabs vendor={vendor} vendorEvents={vendorEvents} events={events} pendingEvents={pendingVendorEvents}></VendorTabs>
        </div>
    );
}