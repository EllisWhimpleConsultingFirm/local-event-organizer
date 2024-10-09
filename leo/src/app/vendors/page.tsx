import {Button} from "@/components/util/button";
import {CategoryTag} from "@/app/vendors/components/category-tag";

const vendors = [
    {
        id: 1,
        name: "Vendor A",
        category: "Catering",
        contact: "contact@vendor-a.com",
        events: ["Wedding", "Corporate Party", "Concert"],
    },
    {
        id: 2,
        name: "Vendor B",
        category: "Music",
        contact: "music@vendor-b.com",
        events: ["Wedding", "Festival", "Birthday Party"],
    },
    // Add more vendors
];

const VendorsPage = () => {
    return (
        <div className="container mx-auto p-6 text-gray-700">
            <h1 className="text-3xl font-bold mb-4">Vendors</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                ))}
            </div>
        </div>
    );
};

const VendorCard = ({ vendor }: { vendor: any }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold mb-2">{vendor.name}</h2>
                <p className="text-gray-600 mb-2">Category: {vendor.category}</p>
                <p className="text-gray-600 mb-4">Contact: {vendor.contact}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {vendor.events.map((event: string) => (
                        CategoryTag({tagName: event})
                    ))}
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between">
                <Button style={'px-4'}>Edit</Button>
                <Button style={'px-4'}>Remove</Button>
            </div>
        </div>
    );
};

export default VendorsPage;
