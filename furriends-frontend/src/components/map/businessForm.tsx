'use client'

import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, ScrollArea, Button, Text, TextInput, Textarea, Select, Checkbox } from '@mantine/core';
import { createClient } from '@/utils/supabase/component';

/**
 * Renders a business form modal for submitting a new pet business application.
 *
 * @returns {JSX.Element} The rendered BusinessForm component.
 */
export default function BusinessForm() {
    const supabase = createClient();
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [checkboxError, setCheckboxError] = useState('');

    /**
     * Adds a new business application to the database.
     */
    async function addBusiness() {
        try {
            setLoading(true);

            const { error } = await supabase.from('business_applications').insert({
                name: name,
                type: type,
                address: address,
                email: email,
                phone_number: phone || "",
                description: description || "",
            });
            if (error) throw error;
            alert('Application submitted! Please check your email regularly to receive the results of your application~');
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Error submitting application!');
        } finally {
            setLoading(false);
        }
    }

    /**
     * Validates the form to ensure all required fields (name, type, address, email) are filled.
     * 
     * @returns {boolean} Returns true if the form is valid, otherwise false.
     */
    // can be further refined to show error message below relevant fields instead of using alert
    const validateForm = () => {
        if (!name || !type || !address || !email) {
            alert('Please fill in all required fields: Business Name, Type, Address and Email.');
            return false;
        }
        return true;
    };

    /**
     * Handles the form submission.
     * Checks that user has checked the declaration checkbox.
     * Clears the form and closes the modal upon successful submission.
     */
    const handleSubmit = async () => {
        setCheckboxError('');
        if (!checkboxChecked) {
            setCheckboxError('*You must agree to the declaration.');
            return;
        }

        if (validateForm()) {
            setLoading(true);
            await addBusiness();
            setLoading(false);
            close(); 
            setName('');
            setType('');
            setAddress('');
            setEmail('');
            setPhone(null);
            setDescription(null);
            setCheckboxChecked(false);
            setCheckboxError('');
        }
    };

    return (
        <footer className="flex mt-auto py-5 items-center justify-center">
            <p className="ml-3 mr-3">Know a pet-friendly business or hangout spot? Apply to add it to our map{" "}
                <button className="text-brown underline" onClick={open}>
                    here
                </button>!
            </p>
            <Modal
                opened={opened}
                onClose={() => {
                    close();
                    setName('');
                    setType('');
                    setAddress('');
                    setEmail('');
                    setPhone(null);
                    setDescription(null);
                    setCheckboxChecked(false);
                    setCheckboxError('');
                }}
                title="Submit business details for addition to map page"
                scrollAreaComponent={ScrollArea.Autosize}
            >
                <div className="space-y-4">
                    <TextInput
                        label="Business Name"
                        name="business name"
                        value={name}
                        placeholder="Business Name"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <Select
                        label="Business Type"
                        name="business type"
                        value={type}
                        placeholder="Select Business Type"
                        data={['Pet shop', 'Pet swimming pool', 'Pet grooming', 'Pet-friendly mall', 'Pet-friendly cafe/restaurant', 'Pet-friendly park', 'Veterinary clinic', 'Other']}
                        onChange={(value: string | null) => setType(value || '')}
                        allowDeselect={false}
                        checkIconPosition="right"
                        required
                        searchable
                        nothingFoundMessage="Nothing found..."
                    />

                    <TextInput
                        label="Business Address"
                        name="business address"
                        value={address}
                        placeholder="Business Address"
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />

                    <TextInput
                        label="Email Address (for application status updates)"
                        name="email address"
                        value={email}
                        placeholder="Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <TextInput
                        label="Phone Number"
                        name="phone number"
                        value={phone || ""}
                        placeholder="Phone Number"
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <Textarea
                        label="Description"
                        name="description"
                        value={description || ""}
                        placeholder="Tell us more about this location!"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div>
                        <Checkbox
                            label="I hereby declare that the information provided above is true and correct."
                            color="#6d543e"
                            checked={checkboxChecked}
                            onChange={(e) => setCheckboxChecked(e.currentTarget.checked)}
                            style={{ marginTop: '18px', marginBottom: '4px' }}
                        />
                        {checkboxError && <Text c="red" size="sm" fw={700} className="">{checkboxError}</Text>}
                    </div>

                    <Button
                        variant="outline"
                        color="#6d543e"
                        onClick={handleSubmit}
                        disabled={loading} // button shows loading while data is uploaded
                    >
                        {loading ? 'Loading...' : 'Submit application'}
                    </Button>
                </div>
            </Modal>
        </footer>

    )
} 