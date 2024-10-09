import React from 'react';
import {Search} from 'lucide-react';
import Image from 'next/image'
import {Card} from "@/components/util/card";
import {SupabaseDAOFactory} from "@/DAO/supabase/SupabaseDAOFactory";
import {DAOFactory} from "@/DAO/interface/Factory";
import homepageImage from '../public/icon-home-page.png'
import {Button} from "@/components/util/button";
import {IconFilterFunnel} from "@/public/icon-filter-funnel";
import {Modal} from "@/components/util/modal";
import {FilterModal} from "@/components/filter/FilterModal";

export default async function Home() {
    const daoFactory: DAOFactory = new SupabaseDAOFactory()
    const eventsDao = daoFactory.getEventsDAO()
    const events = await eventsDao.getEvents()

    return (
        <>
        <div className="flex flex-col min-h-screen">
            <header className="relative">
                <Image
                    src={homepageImage}
                    alt="Event background"
                    className="w-full h-[300px] object-cover"
                    width={1920}
                    height={300}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                    <h1 className="text-6xl font-bold text-white mb-2">leo</h1>
                    <p className="text-xl text-white mb-6">local event organizer</p>
                        <div className="relative w-3/4 max-w-2xl flex flex-row align-middle">
                            <input
                                type="text"
                                placeholder="find an event or vendor"
                                className="w-full py-3 px-12 rounded-full text-lg"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                        </div>
                </div>
            </header>

            <div className="flex-grow bg-white p-6 text-gray-700">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Browse Events</h2>
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">Provo, UT</h3>
                        <div className="flex space-x-2">
                            <Button>Change Location</Button>
                            <FilterModal/>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Events</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {events.map(async (event) => {
                            if (event.name && event.description) {
                                const img = eventsDao.getEventPicture(event.id)
                                return (
                                    <Card
                                        key={event.id}
                                        title={event.name}
                                        description={event.description}
                                        image={img.publicUrl}
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
        </div>


    </>
    );
}