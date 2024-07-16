import { Modal, ScrollArea, Title, Flex, Image, TextInput, Button, Loader } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { Group, Text, rem } from '@mantine/core';
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { ArrowUpTrayIcon, PhotoIcon, ExclamationTriangleIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { createClient } from "@/utils/supabase/component";

type CommunityCreationModalProps = {
    user: User | null;
    opened: boolean;
    setOpened: (open: boolean) => void;
}

/**
 * Component for creating a community.
 *
 * @param {CommunityCreationModalProps} props - The component props.
 * @param {User | null} props.user - The current user.
 * @param {boolean} props.opened - Indicates whether the modal is open.
 * @param {function} props.setOpened - Function to set the modal open state. 
 * @param {Partial<DropzoneProps>} props.props - Additional dropzone properties.
 * @returns {JSX.Element} The PostCreationModal component.
 */
export default function CommunityCreationModal({user, opened, setOpened}: CommunityCreationModalProps, props: Partial<DropzoneProps>) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [photo_path, setPhotoPath] = useState<FileWithPath | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string>('');
    const [name, setName] = useState<string>('');

    /**
     * Uploads a photo to the Supabase storage.
     *
     * @async
     * @param {FileWithPath} file - The file to upload.
     * @returns {Promise<string | null>} The URL of the uploaded photo or null if there was an error.
     */
    async function uploadPhoto(file: FileWithPath): Promise<string | null> {
        try {
            setLoading(true);
            const fileExt = file.name.split('.').pop();
            const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('community_avatars').upload(filePath, file);
            if (uploadError) {
                throw uploadError;
            }

            const { data: urlData } = await supabase.storage
                .from('community_avatars')
                .getPublicUrl(filePath);

            return urlData.publicUrl;
        } catch (error) {
            console.error('Error uploading photo', error);
            alert('Error uploading photo!');
            return null;
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal 
            opened={opened} 
            onClose={() => {
                setOpened(false);
                setPhotoPath(null);
                setAvatarUrl('');
            }} 
            scrollAreaComponent={ScrollArea.Autosize} 
            size='lg' 
            centered
        >
            <Flex justify='center' align='center' direction='column' gap='md'>
                <Title c='#6d543e'>Create a community</Title>

                {/* Dropzone for photo upload */}
                <Dropzone
                    loading={loading}
                    onDrop={async (files) => {
                        const uploadedUrl = await uploadPhoto(files[0]);
                        if (uploadedUrl) {
                            setAvatarUrl(uploadedUrl);
                            setPhotoPath(files[0]);
                        }
                    }}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={5 * 1024 ** 2}
                    maxFiles={1}
                    accept={IMAGE_MIME_TYPE}
                    {...props}
                >
                    <Group justify="center" gap="xl" mih={300} miw={450} style={{ pointerEvents: 'none' }}>
                        <Dropzone.Accept>
                            <Flex direction='row' gap='md' align='center'>
                                <ArrowUpTrayIcon className="w-12"/>
                                <Text size="xl" inline>
                                    Uploading image...
                                </Text>
                            </Flex>
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <Flex direction='row' gap='md' align='center'>
                                <ExclamationTriangleIcon className="w-12"/>
                                <Text size="xl" inline>
                                    Error! Check that image does not exceed 5mb
                                </Text>
                            </Flex>
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            {avatar_url ?
                                <Flex direction='row' gap='md' align='center'>
                                    <Image
                                        src={avatar_url}
                                    />
                                </Flex>
                                :
                                <Flex direction='row' gap='md' align='center'>
                                <PhotoIcon className="w-12"/>
                                <div>
                                    <Text size="xl" inline>
                                        Drag images here or click to select files
                                    </Text>
                                    <Text size="sm" c="dimmed" inline mt={7}>
                                        Attach community avatar image, the file should not exceed 5mb
                                    </Text>
                                </div>    
                                </Flex>
                            }
                        </Dropzone.Idle>
                    </Group>
                </Dropzone>
                
                {/* Community name input */}
                <TextInput
                    label="Name"
                    placeholder="E.g. Turtle community"
                    w={500}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                {/* Button to publish post */}
                <Button 
                    m='sm' 
                    size='md' 
                    color='#6d543e'
                >
                    Add community
                    {loading && <Loader size="xs" color="#6d543e" />}
                </Button>
            </Flex>
        </Modal>
    );
}