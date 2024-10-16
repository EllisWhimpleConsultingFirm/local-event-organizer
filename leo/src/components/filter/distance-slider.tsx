'use client'

import React, {useState} from "react";

export const DistanceSlider = () => {
    // State to hold the current distance value
    const [distance, setDistance] = useState(50); // Default to 50 km

    // Handle slider value change
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDistance(parseInt(event.target.value, 10));
    };

    return (
        <div className="w-full max-w-sm mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Distance from Me</h2>

            {/* Slider input */}
            <input
                type="range"
                min="0"
                max="100"
                value={distance}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />

            {/* Display selected distance */}
            <div className="mt-4 text-center">
                <span className="text-xl font-bold">{distance} km</span>
            </div>
        </div>
    );
};
