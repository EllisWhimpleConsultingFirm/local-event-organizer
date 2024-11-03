'use client';

import React, {useRef} from "react";
import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";

type MapOption = { id: string | number; latitude: number; longitude: number }

type EventMapClientProps<T extends MapOption> = {
    markers: T[];
    addresses: { [key: string]: string };
    apiKey: string;
};

export const EventMapClient = <T extends MapOption>({ markers, addresses, apiKey }: EventMapClientProps<T>) => {
    const mapRef = useRef<google.maps.Map | null>(null);

    const mapCenter = {
        lat: markers[0]?.latitude || 0,
        lng: markers[0]?.longitude || 0,
    };

    const handleMarkerClick = (event: T) => {
        if (mapRef.current) {
            mapRef.current.panTo({ lat: event.latitude, lng: event.longitude });
            mapRef.current.setZoom(15);

        }
    };

    return (
        <div className="flex justify-center items-center mt-6">
            <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-lg">
                <LoadScript googleMapsApiKey={apiKey}>
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={mapCenter}
                        zoom={12}
                        options={{ streetViewControl: false }}
                        onLoad={(map) => (mapRef.current = map)}
                    >
                        {markers.map((event) => (
                            event.latitude !== null && event.longitude !== null ? (
                                <Marker
                                    key={event.id}
                                    position={{ lat: event.latitude, lng: event.longitude }}
                                    title={addresses[event.id] || 'Fetching address...'}
                                    onClick={() => handleMarkerClick(event)}
                                />
                            ) : null
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
            <div className="h-1/2 p-4"></div>
        </div>
    );
};
