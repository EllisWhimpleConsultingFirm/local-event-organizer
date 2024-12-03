'use client'

import {Coordinates, Filters, Tuple} from "@/utils/filter-models";
import {createContext, Dispatch, ReactNode, useContext, useReducer} from "react";

export enum FilterActions {
    SET_DISTANCE,
    SET_USER_LOCATION,
    SET_SEARCH,
    SET_VENDOR_CATEGORY,
    SET_DATE_RANGE,
    RESET_FILTERS,
}

type FiltersState = {
    filters: Filters
    anywhere: boolean
};

const initialFilters: FiltersState = {
    filters: {
        distance: 50,
        search: undefined,
        vendorCategory: undefined,
        dateRange: [
            new Date(), // Today's date
            new Date(new Date().setDate(new Date().getDate() + 7)) // One week from today
        ],
        userLocation: {lat: 40.238253, lng: -111.646481}
    },
    anywhere: false
};

type FiltersAction =
    | { type: FilterActions.SET_DISTANCE; payload: number | undefined }
    | { type: FilterActions.SET_USER_LOCATION; payload: Coordinates }
    | { type: FilterActions.SET_SEARCH; payload: string }
    | { type: FilterActions.SET_VENDOR_CATEGORY; payload: string[] }
    | { type: FilterActions.SET_DATE_RANGE; payload: Tuple<Date, 2> }
    | { type: FilterActions.RESET_FILTERS };

const filtersReducer = (state: FiltersState, action: FiltersAction): FiltersState => {
    switch (action.type) {
        case FilterActions.SET_DISTANCE:
            console.log("new distance:", action.payload);
            return { ...state, filters: { ...state.filters, distance: action.payload } };
        case FilterActions.SET_SEARCH:
            console.log("new search:", action.payload);
            return { ...state, filters: { ...state.filters, search: action.payload } };
        case FilterActions.SET_USER_LOCATION:
            console.log("set user location:", {lat: 40.238253, lng: -111.646481})
            return { ...state, filters: { ...state.filters, userLocation: action.payload } };
        case FilterActions.SET_VENDOR_CATEGORY:
            console.log("new category:", action.payload);
            return { ...state, filters: { ...state.filters, vendorCategory: action.payload } };
        case FilterActions.SET_DATE_RANGE:
            console.log("new date range:", action.payload);
            return { ...state, filters: { ...state.filters, dateRange: action.payload } };
        case FilterActions.RESET_FILTERS:
            console.log("reset filters");
            return initialFilters;
        default:
            throw new Error("Unknown action type");
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
