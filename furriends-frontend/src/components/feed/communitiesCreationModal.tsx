import { Modal, ScrollArea, Title, Flex, Image, TextInput, Button, Loader, Textarea } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { Group, Text, rem } from '@mantine/core';
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { ArrowUpTrayIcon, PhotoIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { createClient } from "@/utils/supabase/component";
import { Community } from "@/utils/definitions";

type CommunityCreationModalProps = {
    user: User | null;
    opened: boolean;
    setOpened: (open: boolean) => void;
    addNewCommunity: (community: Community) => void;
}

/**
 * Component for creating a community.
 *
 * @param {CommunityCreationModalProps} props - The component props.
 * @param {User | null} props.user - The current user.
 * @param {boolean} props.opened - Indicates whether the modal is open.
 * @param {function} props.setOpened - Function to set the modal open state. 
 * @param {function} props.addNewCommunity - Function to update state upon adding new community. 
 * @param {Partial<DropzoneProps>} props.props - Additional dropzone properties.
 * @returns {JSX.Element} The PostCreationModal component.
 */
export default function CommunityCreationModal({user, opened, setOpened, addNewCommunity}: CommunityCreationModalProps, props: Partial<DropzoneProps>) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [avatar_url, setAvatarUrl] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

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

    /**
     * Adds a new community to the Supabase database and user as community_user.
     *
     * @async
     */
    async function addCommunity() {
        try {
            setLoading(true);

            // insert new community into 'communities' and fetch community id
            const { data, error } = await supabase 
                .from('communities')
                .insert({
                    avatar_url: avatar_url,
                    name: name,
                    description: description,
                })
                .select('*')
                .single();

            if (error) {
                console.error('Error inserting community information', error);
            }

            // add user as member into their created community
            const { error: communityUserError } = await supabase 
                .from('community_users')
                .insert({
                    community_id: data.id,
                    user_id: user?.id,
                });

            if (communityUserError) {
                console.error('Error inserting community member', communityUserError);
            } else {
                addNewCommunity(data);
            }

        } catch (error) {
            alert('Unable to add community!');
        } finally {
            setLoading(false);
        }
    }

    /**
     * Validates the form inputs.
     *
     * @returns {boolean} True if the form is valid, otherwise false.
     */
    const validate = () => {
        if (!avatar_url || !name || !description) {
            alert('Please fill in all fields: Image upload, Name and Description!');
            return false;
        } 
        return true;
    }   

    return (
        <Modal 
            opened={opened} 
            onClose={() => {
                setOpened(false);
                setAvatarUrl('');
                setName('');
                setDescription('');
            }} 
            scrollAreaComponent={ScrollArea.Autosize} 
            size='lg' 
            centered
        >
            <Flex justify='center' align='center' direction='column' gap='md'>
                <Title order={2} c='#6d543e'>Create a community</Title>

                {/* Dropzone for photo upload */}
                <Dropzone
                    className="w-75 h-75 rounded-full overflow-hidden border-2 flex items-center"
                    loading={loading}
                    onDrop={async (files) => {
                        const uploadedUrl = await uploadPhoto(files[0]);
                        if (uploadedUrl) {
                            setAvatarUrl(uploadedUrl);
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
                                <Image
                                    src={avatar_url}
                                    className="w-75 h-75 rounded-full flex items-center justify-center"
                                    alt="Community avatar"
                                />
                                :
                                <Flex direction='row' gap='md' align='center'>
                                <PhotoIcon className="w-12"/>
                                <div>
                                    <Text size="xl" inline>
                                        Drag images here or click to select files <span style={{ color: 'red' }}>*</span>
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
                    placeholder="E.g. British shorthair cats community"
                    w={500}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                {/* Community name input */}
                <Textarea
                    label="Description"
                    placeholder="Short description about this community's interests"
                    w={500}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                {/* Button to publish post */}
                <Button 
                    m='sm' 
                    size='md' 
                    color='#6d543e'
                    rightSection={loading && <Loader size="xs" color='#6d543e'/>}
                    onClick={async () => {
                        if (validate()) {
                            await addCommunity();
                            setOpened(false);
                            setAvatarUrl('');
                            setName('');
                            setDescription('');
                        }
                    }}
                >
                    Add community
                </Button>
            </Flex>
        </Modal>
    );
}