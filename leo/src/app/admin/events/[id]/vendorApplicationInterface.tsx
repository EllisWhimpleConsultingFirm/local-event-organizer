import React from "react";
import {Tables} from "../../../../../types/supabase";
import {CardContent} from "@/components/util/cardContent";
import Image from "next/image";
import {BasicCard} from "@/components/util/basicCard";
import {useFormState, useFormStatus} from "react-dom";
import {ApplicationFormState, updateEventApplication} from "@/actions/applications";

export type VendorApplication = { vendor: Tables<"Vendors">, application: Tables<"Event_Occurrence_Applications">} | { vendor: Tables<"Vendors">, application: Tables<"Event_Applications">}
interface VendorApplicationInterfaceProps {
    onSuccess: () => void,
    vendorApplication: VendorApplication
    event : Tables<"Events">
}

function AcceptButton() {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending} type="submit" className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full">
            {pending ? 'Accepting...' : 'Accept'}
        </button>
    );
}

function RejectButton() {
    const {pending} = useFormStatus();

    return (
        <button disabled={pending} type="submit" className="bg-red hover:bg-darkred text-white rounded p-2 roundedx w-full">
            {pending ? 'Rejecting...' : 'Reject'}
        </button>
    );
}

export function VendorApplicationInterface({vendorApplication, event} : VendorApplicationInterfaceProps) {
    const [acceptState, acceptAction] = useFormState<ApplicationFormState, FormData>(updateEventApplication, {} as ApplicationFormState);
    const [rejectState, rejectAction] = useFormState<ApplicationFormState, FormData>(updateEventApplication, {} as ApplicationFormState);

    return (
        <div className="p-4">
            <BasicCard>
                <CardContent>
                    <Image src={vendorApplication.vendor.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!} alt={vendorApplication.vendor.description ?? "DESCRIPTION"} width={250} height={250} className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <h4 className="text-lg font-semibold mb-2">{vendorApplication.vendor.description}</h4>
                        <p className="text-gray-600">{vendorApplication.application.message}</p>
                    </div>
                </CardContent>
            </BasicCard>
            <div className="flex flex-row justify-evenly p-5">
                <form className="w-1/2 p-2" action={acceptAction}>
                    {"event_occurrence_id" in vendorApplication.application && (
                        <input type="hidden" name="event_occurrence_id" value={vendorApplication.application.event_occurrence_id} />
                    )}
                    <input type="hidden" name="event_id" value={event.id} />
                    <input type="hidden" name="vendor_id" value={vendorApplication.application.vendor_id} />
                    <input type="hidden" name="message" value={vendorApplication.application.message ?? "Message"} />
                    <input type="hidden" name="status" value="ACCEPTED" />
                    <AcceptButton />
                </form>
                <form className="w-1/2 p-2" action={rejectAction}>
                    {"event_occurrence_id" in vendorApplication.application && (
                        <input type="hidden" name="event_occurrence_id" value={vendorApplication.application.event_occurrence_id} />
                    )}
                    <input type="hidden" name="event_id" value={event.id} />
                    <input type="hidden" name="vendor_id" value={vendorApplication.application.vendor_id} />
                    <input type="hidden" name="message" value={vendorApplication.application.message ?? "Message"} />
                    <input type="hidden" name="status" value="REJECTED" />
                    <RejectButton />
                </form>
            </div>
        </div>
    )
}