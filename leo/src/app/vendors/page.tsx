import {Button} from "@/components/util/button";
import {Tables} from "../../../types/database.types";

const vendors : (Tables<'Vendors'>)[] = [
    {
        id : 1,
        created_at : "2024-10-09 21:36:30.851+00",
        name : "Testers of Patience",
        phone_number: 123456789,
        email : "testyMcTesterson@gmail.com",
        photo_url : "https://rnjoinjtiwtrnpwlvkeu.supabase.co/storage/v1/object/public/events-pictures/10.png",
        description : "Test Description"
    },
    {
        id : 2,
        created_at : "2024-10-09 21:36:30.851+00",
        name : "Testers of Patience II",
        phone_number: 123456789,
        email : "testyMcTesterson@gmail.com",
        photo_url : "https://rnjoinjtiwtrnpwlvkeu.supabase.co/storage/v1/object/public/events-pictures/10.png",
        description : "Test Description II"
    },
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

const VendorCard = ({ vendor }: { vendor: Tables<'Vendors'> }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold mb-2">{vendor.name}</h2>
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
