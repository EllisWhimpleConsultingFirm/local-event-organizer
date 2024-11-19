'use client'

import React, {useCallback, useEffect, useState} from "react";
import {useFilters} from "@/Contexts/filter-context";

export const DistanceSlider = () => {
    const { state, dispatch } = useFilters();
    const [localDistance, setLocalDistance] = useState(state.distance);

    const debouncedDispatch = useCallback(() => {
        const timeout = setTimeout(() => {
            dispatch({ type: "SET_DISTANCE", payload: localDistance });
        }, 600); // Adjust debounce time as needed
        return () => clearTimeout(timeout);
    }, [dispatch, localDistance]);

    // Run debounced dispatch whenever localDistance changes
    useEffect(() => {
        debouncedDispatch();
    }, [debouncedDispatch]);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalDistance(parseInt(event.target.value, 10)); // Update local distance immediately
    };

    return (
        <div className="w-full max-w-sm mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Distance from Me</h2>

            {/* Slider input */}
            <input
                type="range"
                min="0"
                max="100"
                value={localDistance} // Use local state for immediate responsiveness
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />

            {/* Display selected distance */}
            <div className="mt-4 text-center">
                <span className="text-xl font-bold">{localDistance} km</span>
            </div>
        </div>
    );
};