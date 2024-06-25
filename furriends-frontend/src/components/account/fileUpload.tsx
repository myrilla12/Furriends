// file upload field for pet profile creation form
// allows users to upload multiple files at once
// files will be fetched and uploaded from supabase storage bucket `pet_photos`
// partially adapted from: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?language=ts&queryGroups=language

import React, { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/component'
import { FileInput } from '@mantine/core';
//import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function FileUpload({ uid, urls, onUpload, }: {
    uid: string | null
    urls: string[] | null
    onUpload: (urls: string[]) => void
}) {
    const supabase = createClient();
    const photo_urls = urls || [];
    const [uploading, setUploading] = useState(false); // can be used later on to modify state of buttons etc.

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
            {/* This chunk displays the exisiting photos after the fileinput field
            photo_urls.map((url, index) => (
                <img key={index} src={url} alt="pet photo" />
            ))
            */}
        </div>
    );
}