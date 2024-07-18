import React, { useState, useEffect } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { createClient } from '@/utils/supabase/component'
import type { User } from '@supabase/supabase-js'


const containerStyle = {
    width: '100%',
    height: '550px'
};

const libraries: ("places")[] = ['places'];

type MapComponentProps = {
    user: User
};

/**
 * Component for displaying a Google Map with a marker.
 *
 * @returns {JSX.Element} The Map component.
 */
export default function Map({ user }: MapComponentProps) {
    const [latitude, setLatitude] = useState<number>(1.3521);
    const [longitude, setLongitude] = useState<number>(103.8198);
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: libraries
    });

    useEffect(() => {
        const fetchLocations = async () => {
            const supabase = createClient();

            // get user latitude and longtitude
            const { data, error } = await supabase
                .rpc('get_user_lat_lng', {
                    user_id: user.id,
                });

            if (error) {
                console.error('Error fetching locations:', error);
                return;
            }

            setLatitude(data[0].latitude)
            setLongitude(data[0].longitude);
        };

        fetchLocations();
    }, [user]);

    if (loadError) {
        return <div>Error loading Google Maps! Please try again.</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }
    
    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: latitude, lng: longitude }}
            zoom={16}
        >
            <Marker key="user" position={{ lat: latitude, lng: longitude }} />
        </GoogleMap>
    )
}