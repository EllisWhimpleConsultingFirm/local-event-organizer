import Link from "next/link";
import {Card} from "@/components/util/card";
import React from "react";
import {getAdminVendors} from "@/actions/vendor";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {AddVendorButtonModal} from "@/app/admin/vendors/addVendorButtonModal";

export default async function Events() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }
    const vendors = await getAdminVendors(data.user.id)

    return (
        <div className="container mx-auto p-10">
            <div className="flex justify-between items-center mb-4 p-20">
                <h1 className="text-5xl font-bold">My Shops</h1>
                <AddVendorButtonModal/>
            </div>
            {!vendors || "error" in vendors || vendors.length === 0 ? (
                    <div className="text-center text-2xl text-red-600 mt-10">No Vendors Found</div>
            )
            :
            (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map(async (currentVendor) => {
                    return (
                        <Link href={`/admin/vendors/${currentVendor.id}`} key={currentVendor.id}>
                            <Card
                                title={currentVendor.name}
                                description={currentVendor.description ?? "VENDOR DESCRIPTION"}
                                image={currentVendor.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                            />
                        </Link>
                    );
                })}
            </div>)}
        </div>
    )
}