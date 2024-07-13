// adapted from: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?language=ts&queryGroups=language
'use client'

import React, { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/component';
import Image from 'next/image';
import { Button } from '@mantine/core';

/**
 * Component for displaying and uploading an avatar image.
 *
 * @param {{ uid: string | null, url: string | null, size: number, onUpload: (url: string) => void }} props - The component props.
 * @param {string | null} props.uid - The user ID.
 * @param {string | null} props.url - The URL of the avatar image.
 * @param {number} props.size - The size of the avatar image.
 * @param {function} props.onUpload - Callback function to handle the uploaded image URL.
 * @returns {JSX.Element} The avatar component.
 */
export default function Avatar({ uid, url, size, onUpload, }: {
    uid: string | null
    url: string | null
    size: number
    onUpload: (url: string) => void
}) {
    const supabase = createClient()
    const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
    const [uploading, setUploading] = useState(false)

    /**
     * Downloads the existing profile photo from the database, if any.
     *
     * @async
     * @function downloadImage
     * @param {string} url - The URL of the image to download.
     */
    useEffect(() => {
        async function downloadImage(url: string) {
            try {
                setAvatarUrl(url)
            } catch (error) {
                console.log('Error downloading image: ', error)
            }
        }

        if (url) downloadImage(url)
    }, [url, supabase])

    /**
     * Handles the avatar upload process.
     *
     * @async
     * @function uploadAvatar
     * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
     */
    // selected file will be uploaded to supabase storage and generate a unique url
    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${uid}-${Math.random()}.${fileExt}`

            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data: urlData } = await supabase.storage
                .from('pet_photos')
                .getPublicUrl(filePath)

            onUpload(urlData.publicUrl)
        } catch (error) {
            alert('Error uploading avatar!')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="flex flex-col items-center">
            <div className="border-2 border-gray-300 flex items-center justify-center" style={{ height: size, width: size }}>
                {avatarUrl ? (
                    <Image
                        width={size}
                        height={size}
                        src={avatarUrl}
                        alt="Avatar"
                        className="avatar image"
                        style={{ height: size, width: size }}
                    />
                ) : (
                    <div className="avatar no-image" style={{ height: size, width: size }} />
                )}
            </div>
            <div className="p-3" style={{ width: size }}>
                <Button component="label" htmlFor="single" className="block" variant="default" color="gray" size="xs" disabled={uploading}>
                    {uploading ? 'Uploading ...' : 'Upload'}
                    <input
                        style={{ display: 'none', }}
                        type="file"
                        id="single"
                        accept="image/*"
                        onChange={uploadAvatar}
                    />
                </Button>
            </div>
        </div>
    )
}