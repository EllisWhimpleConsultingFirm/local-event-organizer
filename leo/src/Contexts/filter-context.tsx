'use client'

import {Filters, Tuple} from "@/utils/filter-models";
import {createContext, Dispatch, ReactNode, useContext, useReducer} from "react";

type FiltersState = Filters;

const initialFilters: FiltersState = {
    distance: 0,
    search: "",
    vendorCategory: [],
    dateRange: [new Date(), new Date()],
};

type FiltersAction =
    | { type: "SET_DISTANCE"; payload: number }
    | { type: "SET_SEARCH"; payload: string }
    | { type: "SET_VENDOR_CATEGORY"; payload: string[] }
    | { type: "SET_DATE_RANGE"; payload: Tuple<Date, 2> }
    | { type: "RESET_FILTERS" };

const filtersReducer = (state: FiltersState, action: FiltersAction): FiltersState => {
    switch (action.type) {
        case "SET_DISTANCE":
            console.log("new distance:", action.payload)
            return { ...state, distance: action.payload };
        case "SET_SEARCH":
            console.log("new search:", action.payload)
            return { ...state, search: action.payload };
        case "SET_VENDOR_CATEGORY":
            console.log("new category:", action.payload)
            return { ...state, vendorCategory: action.payload };
        case "SET_DATE_RANGE":
            console.log("new date range:", action.payload)
            return { ...state, dateRange: action.payload };
        case "RESET_FILTERS":
            return initialFilters;
        default:
            throw new Error(`Unhandled action type: ${(action as any).type}`);
    }
};

const FiltersContext = createContext<{ state: FiltersState; dispatch: Dispatch<FiltersAction> } | undefined>(
    undefined
);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(filtersReducer, initialFilters);

    return <FiltersContext.Provider value={{ state, dispatch }}>{children}</FiltersContext.Provider>;
};

export const useFilters = () => {
    const context = useContext(FiltersContext);
    if (!context) {
        throw new Error("useFilters must be used within a FiltersProvider");
    }
    return context;
};
