import { Modal, ScrollArea, Title, Flex, Textarea, RangeSlider, Box, TextInput, Button, Image, Loader } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { Group, Text, rem } from '@mantine/core';
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { ArrowUpTrayIcon, PhotoIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { createClient } from "@/utils/supabase/component";

type ServicePostCreationModalProps = {
    user: User | null;
    opened: boolean;
    setOpened: (open: boolean) => void;
}

export default function ServicePostCreationModal({user, opened, setOpened}: ServicePostCreationModalProps, props: Partial<DropzoneProps>) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const[uploading, setUploading] = useState(false);
    const [photo_path, setPhotoPath] = useState<FileWithPath | null>(null);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [pricing, setPricing] = useState<number[] | null>(null);
    const [photo_url, setPhotoUrl] = useState<string>('');

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
                })

            if (error) {
                console.error('Error inserting post information', error);
            }
        } catch (error) {
            alert('Unable to add post!');
        } finally {
            setLoading(false);
        }
    }

    const validate = () => {
        if (!photo_path || !title) {
            alert('Please fill in all required fields: Image upload, Title');
            return false;
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
                setContent(null);
                setLocation(null);
                setPricing(null);
                setPhotoUrl('');
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
                            {photo_path ?
                                <Text size="xl" inline>
                                    Image successfully uploaded!
                                </Text>
                                :
                                <Flex direction='row' gap='md' align='center'>
                                <PhotoIcon className="w-12"/>
                                <div>
                                    <Text size="xl" inline>
                                        Drag images here or click to select files
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
                />

                {/* Service location input */}
                <TextInput
                    label="Located at"
                    placeholder="E.g. Tampines"
                    w={500}
                    onChange={(e) => setLocation(e.target.value)}
                />

                {/* Service price range input */}
                <Box m='md' w={500}>
                    <Text size='sm' fw={500} mb='xs' inline>Price range</Text>
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

                {/* Button to publish post */}
                <Button 
                    m='sm' 
                    size='md' 
                    color='#6d543e'
                    onClick={async () => {
                        if (validate()) {
                            await addFreelancerPost();
                            setOpened(false);
                            setPhotoPath(null);
                            setTitle('');
                            setContent(null);
                            setLocation(null);
                            setPricing(null);
                            setPhotoUrl('');
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