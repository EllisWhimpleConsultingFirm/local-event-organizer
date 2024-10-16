import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for react-datepicker


export const DatePickerLeo = () => {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;

    return (
        <div className="flex flex-row items-center pt-4 px-4">
            <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update: [Date | null, Date | null]) => {
                    setDateRange(update);
                }}
                placeholderText={"DD/MM/YYYY - DD/MM/YYYY"}
                isClearable={true} // Allows clearing the range
                showMonthYearDropdown
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64" // Tailwind styling for the input
                calendarClassName="rounded-lg shadow-lg border border-gray-300" // Styling for the calendar dropdown
            />
            <p className="px-4 text-sm text-gray-500">Select a range</p>
        </div>
    );
};