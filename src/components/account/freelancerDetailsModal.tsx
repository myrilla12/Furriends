// modal that opens on click to show stored pet details
import { createClient } from '../../utils/supabase/component';
import { Modal, Text, ScrollArea, Title, Button, Group } from '@mantine/core';
import { type User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';


type FreelancerDetailsModalProps = {
    user: User | null;
    opened: boolean;
    onClose: () => void;
}

/**
 * Modal component that displays the freelancer profile terms and conditions and allows the user to toggle freelancer mode.
 * Terms and conditions text adapted from ChatGPT at https://chat.openai.com/chat
 *
 * @param {FreelancerDetailsModalProps} props - The component props.
 * @param {User | null} props.user - The user object.
 * @param {boolean} props.opened - Indicates whether the modal is open.
 * @param {function} props.onClose - Callback function to close the modal.
 * @returns {JSX.Element} The freelancer details modal component.
 */
export default function FreelancerDetailsModal({ user, opened, onClose }: FreelancerDetailsModalProps) {
    const supabase = createClient();
    const router = useRouter();

    /**
     * Toggles the freelancer mode in the user's profile in the database.
     *
     * @async
     * @function toggleFreelancer
     */
    async function toggleFreelancer() {
        const { error: freelancerError } = await supabase
            .from('profiles')
            .update({ freelancer: true })
            .eq('id', user?.id);

        if (freelancerError) {
            console.error('Error toggling freelancer to true', freelancerError);
        }
        router.push('/feed/services')
    }

    return (
        <Modal
            title={<span className="font-bold text-3xl text-brown">Terms & Conditions For Freelancer Profile</span>}
            opened={opened}
            onClose={onClose}
            scrollAreaComponent={ScrollArea.Autosize}
            size='xl'
            centered>
            <div className="space-y-4">
                <Text c='dimmed' fw={600}>Effective Date: 9 July 2024</Text>

                <Text>By toggling your profile to a freelancer profile on Furriends, you agree to the following terms and conditions:</Text>
                <Text fw={700}>1. Legitimacy of Services</Text>
                <Text>
                    - You confirm that you are offering legitimate pet-related services and that you manage your own freelancing business work independently.
                    - Furriends is not responsible for the conduct or quality of the services you provide.
                </Text>

                <Text fw={700}>2. Freelancer Feed Access</Text>
                <Text>
                    - By toggling your profile, you will gain access to the freelancer feed where you can promote your pet-related services.
                    - The freelancer feed is a platform for advertising your services to other Furriends users.
                </Text>

                <Text fw={700}>3. Content Guidelines</Text>
                <Text>
                    - All content posted in the freelancer feed must be appropriate, relevant to pet-related services, and adhere to Furriends’ community standards.
                    - Prohibited content includes, but is not limited to, offensive, misleading, illegal, or harmful posts.
                </Text>

                <Text fw={700}>4. Responsibility and Liability</Text>
                <Text>
                    - You are solely responsible for the content you post and the services you offer.
                    - Furriends disclaims any liability for any disputes, losses, or damages arising from your freelance activities.
                </Text>

                <Text fw={700}>5. Right to Review and Remove Content</Text>
                <Text>
                    - Furriends reserves the right to review, modify, or remove any content posted in the freelancer feed at its discretion.
                    - If any content is deemed inappropriate or violates these terms, it may be removed without prior notice.
                </Text>

                <Text fw={700}>6. Withdrawal of Freelancer Tag</Text>
                <Text>
                    - Furriends reserves the right to withdraw your freelancer tag and access to the freelancer feed if you violate these terms or if your services are deemed inappropriate or harmful.
                    - In the event of withdrawal, you will be notified, and any promotional content may be removed.
                </Text>

                <Text fw={700}>7. Compliance with Laws</Text>
                <Text>
                    - You agree to comply with all applicable local, state, national, and international laws and regulations in relation to your freelance services and use of Furriends.
                </Text>

                <Text fw={700}>8. Changes to Terms and Conditions</Text>
                <Text>
                    - Furriends reserves the right to update or modify these terms and conditions at any time without prior notice.
                    - Your continued use of the freelancer profile feature after any changes constitutes your acceptance of the new terms.
                </Text>

                <Text fw={700}>9. Termination</Text>
                <Text>
                    - You may terminate your freelancer profile at any time by toggling off the freelancer option in your profile settings.
                    - Termination will result in the removal of your access to the freelancer feed and the deletion of any promotional content you have posted.
                </Text>

                <Text>
                    By toggling your profile to a freelancer profile, you acknowledge that you have read, understood, and agree to these terms and conditions.
                </Text>

                <Text>
                    If you do not agree with any part of these terms, do not toggle your profile to a freelancer profile.
                    For any questions or concerns regarding these terms, please contact Furriends support at admin@furriends.com.
                </Text>

                <Text
                    c='red'
                    fw={700}
                >
                    Once you toggle freelancer mode, this change will be made permanent.
                </Text>
                <Group justify='center'>
                    <Text c='dimmed' fw={500}>I agree to these terms and conditions.</Text>
                    <Button color='#6d543e' variant='outline'
                        onClick={async () => {
                            await toggleFreelancer();
                            onClose();
                        }}
                    >
                        Switch to freelancer profile
                    </Button>
                </Group>
            </div>

        </Modal>
    );
}