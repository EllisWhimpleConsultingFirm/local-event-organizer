
export async function fetchAddresses(coords: {id: number, longitude: number, latitude: number}[]) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
    if(!apiKey){
        throw new Error("Could not find api key")
    }
    const geocodePromises = coords.map(async (event) => {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.latitude},${event.longitude}&key=${apiKey}`
        );
        const data = await response.json();
        if (data.results[0]) {
            return { id: event.id, address: data.results[0].formatted_address };
        }
        return { id: event.id, address: 'Address not found' };
    });

    const resolvedAddresses = await Promise.all(geocodePromises);
    return resolvedAddresses.reduce((acc, curr) => {
        acc[curr.id] = curr.address;
        return acc;
    }, {} as { [key: string]: string });
}

export async function fetchAddress(coords: { longitude: number, latitude: number }) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
    if (!apiKey) {
        throw new Error("Could not find API key");
    }

    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.results[0]) {
        const components = data.results[0].address_components;
        let city = '';
        let stateOrCountry = '';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        components.forEach((component : any) => {
            if (component.types.includes("locality")) {
                city = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1") || component.types.includes("state")) {
                stateOrCountry = component.short_name;
            }
        });

        // If both city and stateOrCountry are empty, return coordinates as a fallback
        if (!city && !stateOrCountry) {
            return { address: `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}` };
        }

        return { address: `${city}${city && stateOrCountry ? ', ' : ''}${stateOrCountry}`.trim() };
    }

    return { address: `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}` };
}
