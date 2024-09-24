import React from 'react';
import { Search } from 'lucide-react';
import homePagePicture from '../public/home_page.png'
import Image from 'next/image'

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="relative">
                <Image
                    src={homePagePicture}
                    alt="Event background"
                    className="w-full h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                    <h1 className="text-6xl font-bold text-white mb-2">leo</h1>
                    <p className="text-xl text-white mb-6">local event organizer</p>
                    <div className="relative w-3/4 max-w-2xl">
                        <input
                            type="text"
                            placeholder="find an event or vendor"
                            className="w-full py-3 px-12 rounded-full text-lg"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </header>

            <div className="flex-grow bg-white p-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Browse Events</h2>
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">Provo, UT</h3>
                        <div className="flex space-x-2">
                            <button className="px-4 py-2 border border-gray-300 rounded-full">Change Location</button>
                            <button className="px-4 py-2 border border-gray-300 rounded-full">Filter By Date</button>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Events</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <EventCard
                            image="/api/placeholder/400/300"
                            title="ROC Concert"
                            description="Location Date & Time"
                        />
                        <EventCard
                            image="/api/placeholder/400/300"
                            title="Y Serve Event"
                            description="Location Date & Time"
                        />
                        <EventCard
                            image="/api/placeholder/400/300"
                            title="Farmer's Market"
                            description="Location Date & Time"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}


type EventCardProps = {
    image: string,
    title: string,
    description: string
}
const EventCard = ({ image, title, description }: EventCardProps) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h4 className="text-lg font-semibold mb-2">{title}</h4>
            <p className="text-gray-600">{description}</p>
            <button className="mt-2 p-2 border border-gray-300 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
            </button>
        </div>
    </div>
);