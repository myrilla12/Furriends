'use client'

import { useState, useEffect, useCallback } from 'react';
import { Modal, Text, Button } from '@mantine/core';
import { createClient } from '@/utils/supabase/component';
import { type User } from '@supabase/supabase-js';
import LocationInput from '../account/locationInput';

type LocationModalProps = {
    opened: boolean;
    onClose: () => void;
    user: User
}

/**
 * LocationModal component for updating user address.
 * 
 * @param {LocationModalProps} props - The props for the component.
 * @param {boolean} props.opened - Indicates if the modal is open.
 * @param {() => void} props.onClose - Function to close the modal.
 * @param {User} props.user - The current user.
 * @returns {JSX.Element} The rendered LocationModal component.
 */
export default function LocationModal({ opened, onClose, user }: LocationModalProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longtitude, setLongtitude] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    /**
     * Fetches and sets the user's address.
     * Memoized - only recreated if dependencies change
     * 
     * @async
     * @function getAddress
     */
    const getAddress = useCallback(async () => {
        try {
            setLoading(true);

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`address`)
                .eq('id', user?.id)
                .single();

            if (error && status !== 406) {
                console.log(error);
                throw error;
            }

            if (data) {
                setAddress(data.address);
            }
        } catch (error) {
            alert('Error loading user address!');
        } finally {
            setLoading(false);
        }
    }, [user, supabase])

    useEffect(() => { getAddress() }, [user, getAddress])

    /**
     * Updates the user address.
     * 
     * @async
     * @function updateAddress
     * @param {{ address: string, latitude: number | null, longtitude: number | null }} addressData - The address data to update.
     */
    async function updateAddress() {
        try {
            setLoading(true);

            const { error } = await supabase.from('profiles')
                .update({
                    address: address,
                    location: latitude && longtitude ? `SRID=4326;POINT(${longtitude} ${latitude})` : null,
                })
                .eq('id', user?.id);
            if (error) throw error;
        } catch (error) {
            alert('Error updating address!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    /**
    * Validates the form to ensure all required fields are filled.
    *
    * @function validateForm
    * @returns {boolean} - Returns true if the form is valid, otherwise false.
    */
    // can be further refined to show error message below relevant fields instead of using alert
    const validateForm = () => {
        if (!address) {
            setMessage('Please fill in your address to proceed.');
            return false;
        }
        return true;
    };

    /**
     * Handles the form submission.
     * Checks that user has keyed in a valid input.
     * Clears the form and closes the modal upon successful submission.
     * 
     * @function handleSubmit
     */
    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true);
            await updateAddress();
            setLoading(false);
            onClose();
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Enter your current address"
            withCloseButton={false}
            closeOnClickOutside={false}
            closeOnEscape={false}
            centered
        >
            <div className="mb-5">
                <LocationInput
                    onSelectAddress={(address, latitude, longtitude) => {
                        setAddress(address);
                        setLatitude(latitude);
                        setLongtitude(longtitude);
                    }}
                    defaultValue={address || ""}
                />
                {message && <Text c="red" size="xs" fw={700} className="mt-1">{message}</Text>}
            </div>

            <Button
                variant="outline"
                color="#6d543e"
                onClick={handleSubmit}
                disabled={loading} // button shows loading while data is uploaded
            >
                {loading ? 'Loading...' : 'Find furriends'}
            </Button>
        </Modal>
    )
} 