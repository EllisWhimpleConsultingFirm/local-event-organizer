import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Store } from 'lucide-react';
import { UpdateVendorForm } from './updateVendorForm';
import { getVendor, getVendorEvents } from "@/actions/vendor";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getEvents } from "@/actions/event";
import { VendorTabs } from "@/app/admin/vendors/[id]/vendorTabs";
import { getVendorPendingEvents } from "@/actions/applications";

interface EventDetailsProps {
    params: {
        id: string;
    };
}

export default async function VendorDetails({ params }: EventDetailsProps) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        redirect('/login');
    }

    const vendor = await getVendor(parseInt(params.id, 10));
    const events = await getEvents();

    if (data.user.id !== vendor.admin_id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You do not have permission to view this data</p>
                    <Link href="/admin/vendors" className="text-blue-600 hover:text-blue-700 font-medium">
                        Return to My Shops
                    </Link>
                </div>
            </div>
        );
    }

    const vendorEvents = await getVendorEvents(vendor.id);
    const pendingVendorEvents = await getVendorPendingEvents(vendor.id);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <Link href="/admin/vendors">
                        <button
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300
                                     rounded-lg shadow-sm text-gray-700 hover:bg-gray-50
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                     transition-colors duration-200 ease-in-out"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to My Shops
                        </button>
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Store className="w-8 h-8 text-blue-600" />
                                    <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
                                </div>
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                    <Image
                                        src={vendor.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                                        alt={vendor.name ?? "Name Not Found"}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>

                            <div className="prose prose-gray max-w-none">
                                <h2 className="text-xl font-semibold text-gray-800">Description</h2>
                                <p className="text-gray-700">{vendor.description}</p>
                            </div>
                        </div>

                        <div className="md:border-l border-gray-200 md:pl-8">
                            <UpdateVendorForm vendor={vendor} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 px-4 bg-white rounded-xl shadow-lg overflow-hidden">
                    <VendorTabs
                        vendor={vendor}
                        vendorEvents={vendorEvents}
                        events={events}
                        pendingEvents={pendingVendorEvents}
                    />
                </div>
            </div>
        </div>
    );
}