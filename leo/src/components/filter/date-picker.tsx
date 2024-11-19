"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useFilters} from "@/Contexts/filter-context";

export const DatePickerLeo = () => {
    const { state, dispatch } = useFilters();

    // Extract the current dateRange from the global state
    const [startDate, endDate] = state.dateRange;

    // Handle date range changes
    const handleDateChange = (update: [Date | null, Date | null]) => {
        const newDateRange: [Date, Date] = [update[0] || new Date(), update[1] || new Date()];
        dispatch({ type: "SET_DATE_RANGE", payload: newDateRange });
    };

    return (
        <div className="flex flex-row items-center pt-4 px-4">
            <DatePicker
                selectsRange
                minDate={new Date()}
                maxDate={new Date(9999, 11, 31)}
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                placeholderText="DD/MM/YYYY - DD/MM/YYYY"
                isClearable={true}
                showMonthYearDropdown={true}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                calendarClassName="rounded-lg shadow-lg border border-gray-300"
            />
            <p className="px-4 text-sm text-gray-500">Select a range</p>
        </div>
    );
};
