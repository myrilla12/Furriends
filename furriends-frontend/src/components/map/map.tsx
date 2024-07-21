import React, { useState, useEffect, useCallback } from 'react';
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { createClient } from '@/utils/supabase/component'
import type { User } from '@supabase/supabase-js'
import { Business } from '@/utils/definitions';
import getIconUrl from '@/utils/mapIconUtils';

const libraries: ("places")[] = ['places'];

type MapComponentProps = {
    user: User
};

/**
 * Component for displaying a Google Map centered on user location.
 * Other markers on the map are placed to show nearby pet businesses.
 * A timeout is used to fetch nearby businesses only after the user has finished swiping the map.
 *
 * @param {Object} props - The component props.
 * @param {User} props.user - The user object.
 * @returns {JSX.Element} The Map component.
 */
export default function Map({ user }: MapComponentProps) {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 1.3521, lng: 103.8198 });
    const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 1.3521, lng: 103.8198 });
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
    const mapRef = React.useRef<google.maps.Map | null>(null);
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

            setUserLocation({ lat: data[0].latitude, lng: data[0].longitude })
            setCenter({ lat: data[0].latitude, lng: data[0].longitude });
        };

        fetchLocations();
    }, [user]);

    const fetchBusinesses = useCallback(async (bounds: google.maps.LatLngBounds) => {
        const supabase = createClient();

        const { data, error } = await supabase
            .rpc('businesses_in_view', {
                min_lat: bounds.getSouthWest().lat(),
                min_long: bounds.getSouthWest().lng(),
                max_lat: bounds.getNorthEast().lat(),
                max_long: bounds.getNorthEast().lng()
            });

        if (error) {
            console.error('Error fetching businesses:', error);
            return;
        }

        setBusinesses(data);
    }, []);

    const handleBoundsChanged = useCallback(() => {
        if (mapRef.current) {
            const bounds = mapRef.current.getBounds();
            if (bounds) {
                fetchBusinesses(bounds);
            }
        }
    }, [fetchBusinesses]);

    const handleDragEnd = () => {
        const newCenter = mapRef.current?.getCenter()?.toJSON();
        if (newCenter) {
            setCenter(newCenter);
        }
    };

    if (loadError) {
        return <div>Error loading Google Maps! Please try again.</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <GoogleMap
            options={{ mapId: '6732cc4956028a5d' }}
            mapContainerStyle={{ width: '100%', height: '550px' }}
            center={center}
            zoom={16}
            onLoad={(map) => { mapRef.current = map; }} // set the map instance
            onIdle={handleBoundsChanged} // trigger fetching businesses on map idle
            onDragEnd={handleDragEnd} // change the center coordinates of the map
        >
            <Marker key="user" position={userLocation} />
            {businesses.map((business) => {
                const iconUrl = getIconUrl(business.type);

                return (
                    <Marker
                        key={business.id}
                        position={{ lat: business.lat, lng: business.long }}
                        title={business.name}
                        icon={{
                            url: iconUrl,
                            scaledSize: new google.maps.Size(40, 40),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(20, 20)
                        }}
                        onClick={() => setSelectedBusiness(business.id)}
                    >
                        {selectedBusiness === business.id && (
                            <InfoWindow
                                position={{ lat: business.lat, lng: business.long }}
                                onCloseClick={() => setSelectedBusiness(null)}
                            >
                                <div className='max-w-sm'>
                                    <h1 className='text-sm text-brown font-bold mb-3'>{business.name}</h1>
                                    <p className='mb-2'><span className='font-bold'>Type: </span>{business.type}</p>
                                    <p className='mb-2'><span className='font-bold'>Address: </span>{business.address}</p>
                                    <p className='mb-1'><span className='font-bold'>Phone: </span>{business.phone}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                );
            })}
        </GoogleMap>
    )
}