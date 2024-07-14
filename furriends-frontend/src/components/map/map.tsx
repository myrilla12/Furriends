import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/server-props'

const containerStyle = {
  width: '100%',
  height: '550px'
};

const center = {
  lat: 1.3521,
  lng: 103.8198
};

/**
 * Component for displaying a Google Map with a marker.
 *
 * @returns {JSX.Element} The Map component.
 */
export default function Map() {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={11.5}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  )
}

/**
 * Server-side function to handle user authentication and redirection.
 *
 * @async
 * @function getServerSideProps
 * @param {GetServerSidePropsContext} context - The server-side context.
 * @returns {Promise<{redirect?: {destination: string, permanent: boolean}}>} The redirection object for unauthenticated users.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context)

  const { data, error } = await supabase.auth.getUser()

  // redirect unauthenticated users to home page
  if (error || !data) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}