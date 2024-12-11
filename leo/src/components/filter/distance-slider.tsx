'use client'

import React, {useEffect, useState} from "react";
import {FilterActions, useFilters} from "@/Contexts/filter-context";
export const DistanceSlider = () => {
    const { state, dispatch } = useFilters();
    const [localDistance, setLocalDistance] = useState(state.filters.distance);
    const [debouncedValue, setDebouncedValue] = useState(localDistance);
    const [anywhere, setAnywhere] = useState(state.anywhere);

    useEffect(() => {
        if (anywhere) {
            setLocalDistance(Number.MAX_SAFE_INTEGER);
        }
    }, [anywhere]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(localDistance);
        }, 600);
        return () => clearTimeout(timeout);
    }, [localDistance]);

    useEffect(() => {
        dispatch({ type: FilterActions.SET_DISTANCE, payload: debouncedValue });
        console.log(debouncedValue);
    }, [debouncedValue, dispatch]);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalDistance(parseInt(event.target.value, 10));
    };

    return (
        <div className="w-full max-w-sm mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Distance from Me</h2>
            {/* Radio button for Anywhere */}
            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    id="anywhere"
                    name="location"
                    onChange={() =>{
                        console.log("anywhere");
                        setAnywhere((prev) => !prev)}}
                    checked={anywhere}
                    className="mr-2 cursor-pointer"
                />
                <label htmlFor="anywhere" className="text-gray-700 cursor-pointer">
                    Anywhere
                </label>
            </div>
            {/* Conditional rendering for the slider */}
            {!anywhere && (
                <div>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={localDistance || 0} // Ensure to provide a valid number
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    {/* Display selected distance */}
                    <div className="mt-4 text-center">
                        <span className="text-xl font-bold">{localDistance} mi</span>
                    </div>
                </div>
            )}
        </div>
    );
};
