import React from "react";

type EventCardProps = {
    image: string,
    title: string,
    description: string
}
export const EventCard = ({image, title, description}: EventCardProps) => (

    <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <img src={image} alt={title} className="w-full h-48 object-cover"/>
        <div className="p-4">
            <h4 className="text-lg font-semibold mb-2">{title}</h4>
            <p className="text-gray-600">{description}</p>
            <button className="mt-2 p-2 border border-gray-300 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                </svg>
            </button>
        </div>
    </div>
);
