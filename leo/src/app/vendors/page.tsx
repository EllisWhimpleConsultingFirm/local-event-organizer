import { getVendors} from "@/actions/vendor";
import Link from "next/link";
import {Card} from "@/components/util/card";
import React from "react";

const VendorsPage = async () => {
    const vendors = await getVendors()

    return (
        <div className="container mx-auto p-6 text-gray-700">
            <h1 className="text-3xl font-bold mb-4">Vendors</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map(async (currentVendor) => {
                    return (
                        <Link href={`/vendors/${currentVendor.id}`} key={currentVendor.id}>
                            <Card
                                title={currentVendor.name}
                                description={currentVendor.description ?? "VENDOR DESCRIPTION"}
                                image={currentVendor.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
export default VendorsPage;
