export interface Filters {
    userLocation?: Coordinates
    distance?: number;
    search?: string;
    vendorCategory?: string[];
    dateRange?: Tuple<Date, 2>
}

export type Tuple<T, TLength extends number> = [T, ...T[]] & {
    length: TLength
}

export interface Coordinates {
    lat: number;
    lng: number;
}
