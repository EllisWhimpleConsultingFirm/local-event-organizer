'use client'
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const DatePickerLeo = () => {
    const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([new Date(), undefined]);
    const [startDate, endDate] = dateRange;

    return (
        <div className="flex flex-row items-center pt-4 px-4">
            <DatePicker
                selectsRange
                minDate={new Date()}
                maxDate={new Date(9999, 11, 31)}
                startDate={startDate}
                endDate={endDate}
                onChange={(update: [Date | null, Date | null]) => {
                    setDateRange([update[0] || undefined, update[1] || undefined]); // Convert null to undefined
                }}
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
