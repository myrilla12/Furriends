import { Modal, ScrollArea, Title, Flex, Textarea, RangeSlider, Box, TextInput, Button, Loader, Image, Select } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { Group, Text, rem } from '@mantine/core';
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { ArrowUpTrayIcon, PhotoIcon, ExclamationTriangleIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { createClient } from "@/utils/supabase/component";
import { Community } from "@/utils/definitions";

type PostCreationModalProps = {
    user: User | null;
    opened: boolean;
    setOpened: (open: boolean) => void;
    service: boolean;
    myCommunities: Community[] | null;
}

/**
 * Component for creating a post.
 *
 * @param {PostCreationModalProps} props - The component props.
 * @param {User | null} props.user - The current user.
 * @param {boolean} props.opened - Indicates whether the modal is open.
 * @param {function} props.setOpened - Function to set the modal open state.
 * @param {boolean} props.service - Whether post is created by freelancer or not.
 * @param {Community[]} props.myCommunities - Communities that user is a member of.  
 * @param {Partial<DropzoneProps>} props.props - Additional dropzone properties.
 * @returns {JSX.Element} The PostCreationModal component.
 */
export default function PostCreationModal({user, opened, setOpened, service, myCommunities}: PostCreationModalProps, props: Partial<DropzoneProps>) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [photo_path, setPhotoPath] = useState<FileWithPath | null>(null);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [pricing, setPricing] = useState<number[]>([50, 150]);
    const [photo_url, setPhotoUrl] = useState<string>('');
    const [community, setCommunity] = useState<Community | null>(null);

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

            const { error: uploadError } = await supabase.storage.from('post_images').upload(filePath, file);
            if (uploadError) {
                throw uploadError;
            }

            const { data: urlData } = await supabase.storage
                .from('post_images')
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
     * Adds a new freelancer post to the Supabase database.
     *
     * @async
     */
    async function addFreelancerPost() {
        try {
            setLoading(true);

            // insert new post data into 'freelancer_posts'
            const { error } = await supabase 
                .from('freelancer_posts')
                .insert({
                    post_image: photo_url,
                    post_title: title,
                    post_content: content,
                    post_location: location,
                    post_pricing: pricing,
                    post_author: user?.id, 
                });

            if (error) {
                console.error('Error inserting post information', error);
            }
        } catch (error) {
            alert('Unable to add post!');
        } finally {
            setLoading(false);
        }
    }

    /**
     * Adds a new community post to the Supabase database.
     *
     * @async
     */
    async function addCommunityPost() {
        try {
            setLoading(true);

            // insert new post data into 'freelancer_posts'
            const { error } = await supabase 
                .from('community_posts')
                .insert({
                    post_image: photo_url,
                    post_title: title,
                    post_content: content,
                    post_location: location,
                    post_author: user?.id, 
                    community_id: community?.id,
                });

            if (error) {
                console.error('Error inserting post information', error);
            }

            if (community) {
                console.log("Community id", community?.id)
                // update updated_at value for the community post was inserted into
                const currentTimestamp = new Date().toISOString();
                console.log("Current timestamp", currentTimestamp)
            
                const { error: UpdateError } = await supabase
                    .from('communities')
                    .update({ updated_at: currentTimestamp })
                    .eq('id', community.id)
                    .single();

                if (UpdateError) {
                    console.error('Error updating updated_at value for communities: ', UpdateError);
                }
            }

        } catch (error) {
            alert('Unable to add post!');
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
        if (service) {
            if (!photo_path || !title || !content || !location || !pricing || !photo_url) {
                alert('Please fill in all required fields: Image upload, Title, Description, Location and Pricing!');
                return false;
            } 
        } else {
            if (!photo_path || !title || !content || !location || !photo_url) {
                alert('Please fill in all required fields: Image upload, Title, Description and Location!');
                return false;
            } 
        }
        return true;
    }   

    return (
        <Modal 
            opened={opened} 
            onClose={() => {
                setOpened(false);
                setPhotoPath(null);
                setTitle('');
                setContent('');
                setLocation('');
                setPricing([50, 150]);
                setPhotoUrl('');
                setCommunity(null);
            }} 
            scrollAreaComponent={ScrollArea.Autosize} 
            size='lg' 
            centered
        >
            <Flex justify='center' align='center' direction='column' gap='md'>
                <Title c='#6d543e'>Create your post</Title>

                {/* Dropzone for photo upload */}
                <Dropzone
                    loading={loading}
                    onDrop={async (files) => {
                        const uploadedUrl = await uploadPhoto(files[0]);
                        if (uploadedUrl) {
                            setPhotoUrl(uploadedUrl);
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
                            {photo_url ?
                                <Flex direction='row' gap='md' align='center'>
                                    <Image 
                                        src={photo_url}
                                    />
                                </Flex>
                                :
                                <Flex direction='row' gap='md' align='center'>
                                <PhotoIcon className="w-12"/>
                                <div>
                                    <Text size="xl" inline>
                                        Drag images here or click to select files <span style={{ color: 'red' }}>*</span>
                                    </Text>
                                    <Text size="sm" c="dimmed" inline mt={7}>
                                        Attach only 1 image, each file should not exceed 5mb
                                    </Text>
                                </div>    
                                </Flex>
                            }
                        </Dropzone.Idle>
                    </Group>
                </Dropzone>
                
                {/* Post title input */}
                <Textarea
                    label="Title"
                    placeholder="Name this post"
                    w={500}
                    autosize
                    minRows={1}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                {/* Post description input */}
                <Textarea
                    label="Description"
                    placeholder="Tell us more about the pet services you're offering!"
                    w={500}
                    autosize
                    minRows={2}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />

                {/* Service location input */}
                <TextInput
                    label="Located at"
                    placeholder="E.g. Tampines"
                    w={500}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />

                {/* Service price range input for service modal */}
                {service && 
                    <Box m='md' w={500}>
                        <Text size='sm' fw={500} mb='xs' inline>Price range <span style={{ color: 'red' }}>*</span></Text>
                        <RangeSlider 
                            minRange={0} 
                            min={0} 
                            max={500} 
                            step={1} 
                            label={(value) => `$ ${value}`} 
                            defaultValue={[50, 150]}
                            marks={[
                                { value: 0, label: '$0' },
                                { value: 500, label: '$500' }
                            ]} 
                            onChangeEnd={setPricing}
                        />
                    </Box>
                }

                {!service &&
                    <Select
                        w={500}
                        label="Community"
                        placeholder="Choose a community"
                        data={myCommunities?.map((community) => ({
                            value: community.id,
                            label: community.name
                        }))}
                        onChange={(e) => {
                            const selectedCommunity = myCommunities?.find((community) => community.id === e);
                            
                            if (selectedCommunity) {
                                setCommunity(selectedCommunity);
                            } else {
                                setCommunity(null);
                            }
                        }}
                    />
                }

                {/* Button to publish post */}
                <Button 
                    m='sm' 
                    size='md' 
                    color='#6d543e'
                    onClick={async () => {
                        if (validate()) {
                            if (service) {
                                await addFreelancerPost();
                            } else {
                                await addCommunityPost();
                            }
                            setOpened(false);
                            setPhotoPath(null);
                            setTitle('');
                            setContent('');
                            setLocation('');
                            setPricing([50, 150]);
                            setPhotoUrl('');
                            setCommunity(null);
                        }
                    }}
                >
                    Publish
                    {loading && <Loader size="xs" color="#6d543e" />}
                </Button>

            </Flex>
            
        </Modal>
    );
}