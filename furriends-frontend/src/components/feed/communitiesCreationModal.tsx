import { Modal, ScrollArea, Title, Flex, Textarea, RangeSlider, Box, TextInput, Button, Loader } from "@mantine/core";
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
    const [name, setName] = useState<string>('');

    return (
        <Modal 
            opened={opened} 
            onClose={() => {
                setOpened(false);
            }} 
            scrollAreaComponent={ScrollArea.Autosize} 
            size='lg' 
            centered
        >
            <Flex justify='center' align='center' direction='column' gap='md'>
                <Title c='#6d543e'>Create a community</Title>
                
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