import React, { useState } from 'react';
import { createClient } from '../../utils/supabase/component'
import { FileInput } from '@mantine/core';

/**
 * Component for uploading multiple files to Supabase storage.
 * For users to upload pet photos during pet profile creation/editing
 * Files are uploaded & fetched from supabase storage bucket `pet_photos`
 * Partially adapted from: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?language=ts&queryGroups=language
 *
 * @param {{ uid: string | null, urls: string[] | null, onUpload: (urls: string[]) => void }} props - The component props.
 * @param {string | null} props.uid - The user ID.
 * @param {string[] | null} props.urls - The URLs of the uploaded files.
 * @param {function} props.onUpload - Callback function to handle the uploaded file URLs.
 * @returns {JSX.Element} The file upload component.
 */
export default function FileUpload({ uid, urls, onUpload, }: {
    uid: string | null
    urls: string[] | null
    onUpload: (urls: string[]) => void
}) {
    const supabase = createClient();
    const photo_urls = urls || [];
    const [uploading, setUploading] = useState(false); // can be used later on to modify state of buttons etc.

    /**
     * Handles the photo upload process.
     *
     * @async
     * @function uploadPhoto
     * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
     */
    // selected files will be uploaded to supabase storage and generate unique urls
    const uploadPhoto: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const files = Array.from(event.target.files);
            const uploadedPhotos: string[] = [];

            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const filePath = `${uid}-${Math.random()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage.from('pet_photos').upload(filePath, file);
                if (uploadError) {
                    throw uploadError;
                }

                const { data: urlData } = await supabase.storage
                    .from('pet_photos')
                    .getPublicUrl(filePath);

                uploadedPhotos.push(urlData.publicUrl);
            }

            const updatedUrls = [...photo_urls, ...uploadedPhotos];
            onUpload(updatedUrls);
        } catch (error) {
            alert('Error uploading avatar!')
        } finally {
            setUploading(false)
        }
    };

    /**
     * Handles the file change event.
     *
     * @function handleFileChange
     * @param {File[]} files - The selected files.
     */
    function handleFileChange(files: File[]) {
        const event = {
            target: { files: files as any }
        } as React.ChangeEvent<HTMLInputElement>;
        uploadPhoto(event);
    }

    return (
        <div>
            <FileInput
                label="Upload photos of your pet!"
                multiple
                onChange={(files) => handleFileChange(Array.from(files))}
                accept="image/*"
            />
        </div>
    );
}