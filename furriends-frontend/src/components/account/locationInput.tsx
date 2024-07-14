// adapted from: https://github.com/leighhalliday/house-course/blob/main/src/components/searchBox.tsx
// heavily edited to suit React 18 and GMaps API for React

import React, { useState, useEffect } from "react";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";
import { TextInput } from "@mantine/core";

type LocationInputProps = {
    onSelectAddress: (
        address: string,
        latitude: number | null,
        longtitude: number | null
    ) => void;
    defaultValue: string;
};

const libraries: ("places")[] = ['places'];

export default function LocationInput({ onSelectAddress, defaultValue }: LocationInputProps) {
    const { isLoaded, loadError } = useJsApiLoader({
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

function ReadySearchBox({ onSelectAddress, defaultValue }: LocationInputProps) {
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    const [value, setValue] = useState(defaultValue);
    const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
    const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

    const onLoad = (ref: google.maps.places.SearchBox) => {
        setSearchBox(ref);
    };

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

    const handleBlur = () => {
        // Clear the input field once it loses focus if the current address is invalid
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