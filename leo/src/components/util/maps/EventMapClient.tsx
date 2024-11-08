'use client';

import React from 'react';
import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";

type MapOption = { id: string | number; latitude: number | null; longitude: number | null }

type EventMapClientProps<T extends MapOption> = {
    markers: T[];
    addresses: { [key: string]: string };
    apiKey: string;
    onMarkerClicked?: () => void
};


export const EventMapClient = <T extends MapOption>({ markers, addresses, apiKey, onMarkerClicked }: EventMapClientProps<T>) => {
    const mapCenter = {
        lat: markers[0]?.latitude || 0,
        lng: markers[0]?.longitude || 0,
    };

    return (
        <div className="flex justify-center items-center mt-6">
            <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-lg">
                <LoadScript googleMapsApiKey={apiKey}>
                    <GoogleMap
                        mapContainerStyle={{width: '100%', height: '100%'}}
                        center={mapCenter}
                        zoom={12}
                        options={{streetViewControl: false}}
                    >
                        {markers.map((event) => (
                            event.latitude !== null && event.longitude !== null ? (
                                <Marker
                                    onClick={onMarkerClicked ? () => onMarkerClicked(): () => console.log("clicked")}
                                    key={event.id}
                                    position={{ lat: event.latitude, lng: event.longitude }}
                                    title={addresses[event.id] || 'Fetching address...'}
                                />
                            ) : null
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
};

