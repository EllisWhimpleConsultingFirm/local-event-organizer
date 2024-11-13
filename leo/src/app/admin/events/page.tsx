import React from 'react';
import { AddEventButtonModal } from './AddEventButtonModal';
import Link from "next/link";
import {Card} from "@/components/util/card";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {getAdminEvents} from "@/actions/event";

async function fetchEvents() {
    const response = await fetch('/api/events');
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    return response.json();
}

export default async function EventsManagement() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }
    const events = await getAdminEvents(data.user.id)

    return (
        <div className="container mx-auto p-10">
            <div className="flex justify-between items-center mb-4 p-20">
                <h1 className="text-5xl font-bold">Event Management</h1>
                <AddEventButtonModal />
            </div>
            {!events || "error" in events || events.length === 0 ? (
                <div className="text-center text-2xl text-red-600 mt-10">No Events Found</div>
            )
            :
            (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((currentEvent) => (
                    <Link href={`/admin/events/${currentEvent.id}`} className="block">
                        <Card
                            title={currentEvent.name || ""}
                            description={currentEvent.description || ""}
                            image={currentEvent.photo_url ?? process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!}
                        />
                    </Link>
                ))}
            </div>)}
        </div>
    );
}