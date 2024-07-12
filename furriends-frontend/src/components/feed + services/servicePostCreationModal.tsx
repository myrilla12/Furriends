import { Modal, ScrollArea, Title, Flex, Textarea, RangeSlider, Box, TextInput, Button } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { Group, Text, rem } from '@mantine/core';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { ArrowUpTrayIcon, PhotoIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type ServicePostCreationModalProps = {
    user: User | null;
    opened: boolean;
    onClose: () => void;
}

export default function ServicePostCreationModal({user, opened, onClose }: ServicePostCreationModalProps, props: Partial<DropzoneProps>) {
    const [loading, setLoading] = useState(false);

    return (
        <Modal opened={opened} onClose={onClose} scrollAreaComponent={ScrollArea.Autosize} size='lg' centered>
            <Flex justify='center' align='center' direction='column' gap='md'>
                <Title c='#6d543e'>Create your post</Title>

                {/* Dropzone for photo upload */}
                <Dropzone
                    loading={loading}
                    onDrop={(files) => console.log('accepted files', files)}
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
                />

                {/* Post description input */}
                <Textarea
                    label="Description"
                    placeholder="Tell us more about the pet services you're offering!"
                    w={500}
                    autosize
                    minRows={2}
                />

                {/* Service location input */}
                <TextInput
                    label="Located at"
                    placeholder="E.g. Tampines"
                    w={500}
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
                    />
                </Box>

                {/* Button to publish post */}
                <Button m='sm' size='md' color='#6d543e'>
                    Publish
                </Button>

            </Flex>
            
        </Modal>
    );
}