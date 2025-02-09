import React, { useState, useEffect } from "react";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";
import { TextInput } from "@mantine/core";

type LocationInputProps = {
    onSelectAddress: (
        address: string,
        latitude: number | null,
        longitude: number | null
    ) => void;
    defaultValue: string;
};

const libraries: ("places")[] = ['places'];

/**
 * Component to render a location input using Google Maps API.
 * Adapted from: https://github.com/leighhalliday/house-course/blob/main/src/components/searchBox.tsx
 * Heavily edited to suit React 18 and Google Maps Javascript API for React
 * 
 * @param {LocationInputProps} props - The props for the component.
 * @param {string} props.defaultValue - The default value for the address input.
 * @param {(address: string, latitude: number | null, longitude: number | null) => void} props.onSelectAddress - Function to handle the selected address.
 * @returns {JSX.Element} The rendered LocationInput component.
 */
export default function LocationInput({ onSelectAddress, defaultValue }: LocationInputProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries,
    });

    if (loadError) {
        return <div>Error loading Google Maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <ReadySearchBox
            onSelectAddress={onSelectAddress}
            defaultValue={defaultValue}
        />
    );
}

/**
 * Component to render the search box once the Google Maps API is loaded.
 * 
 * @param {LocationInputProps} props - The props for the component.
 * @param {string} props.defaultValue - The default value for the address input.
 * @param {(address: string, latitude: number | null, longitude: number | null) => void} props.onSelectAddress - Function to handle the selected address.
 * @returns {JSX.Element} The rendered ReadySearchBox component.
 */
function ReadySearchBox({ onSelectAddress, defaultValue }: LocationInputProps) {
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    const [value, setValue] = useState(defaultValue);
    const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
    const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

    /**
     * Handles the load event for the search box.
     * 
     * @param {google.maps.places.SearchBox} ref - The reference to the search box.
     */
    const onLoad = (ref: google.maps.places.SearchBox) => {
        setSearchBox(ref);
    };

    /**
     * Handles the places changed event for the search box.
     */
    const onPlacesChanged = () => {
        if (searchBox) {
            const places = searchBox.getPlaces();
            if (places && places.length > 0) {
                const place = places[0];
                const location = place.geometry?.location;
                if (location) {
                    const address = place.formatted_address ?? "";
                    const lat = location.lat();
                    const lng = location.lng();
                    setValue(address);
                    onSelectAddress(address, lat, lng);
                }
                setPlaces(places);
            }
        }
    };

    /**
     * Handles the blur event for the address input.
     * Clears the input field once it loses focus if the current address is invalid.
     */
    const handleBlur = () => {
        if (!places.find(place => place.formatted_address === value)) {
            setValue("");
            onSelectAddress("", null, null);
        }
    };

    return (
        <div >
            <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
                <TextInput
                    label="Address"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Enter your address"
                    autoComplete="off"
                />
            </StandaloneSearchBox>
        </div>
    );
}