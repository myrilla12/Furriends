import { createClient as CC } from "@/utils/supabase/component";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { Button, Text } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useState } from "react";

type ChatButtonProps = {
    owner_id: string,
    button_color: string,
}

/**
 * Component for a chat button that initiates or navigates to a chat with a specific user.
 *
 * @param {ChatButtonProps} props - The component props.
 * @param {string} props.owner_id - The ID of the chat owner.
 * @param {string} props.button_color - The color of the chat button.
 * @returns {JSX.Element} The chat button component.
 */
export default function ChatButton({ owner_id, button_color }: ChatButtonProps) {
    const supabase = CC();
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [chatIds, setChatIds] = useState<string[]>([]);
    const [partnerIds, setPartnerIds] = useState<string[]>([]);

    /**
     * Handles the click event to initiate or navigate to a chat.
     *
     * @async
     * @function handleClick
     */
    async function handleClick() {
        try {
            // Set current user
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) {
                console.error('Error fetching user:', userError);
                return;
            }
            setUser(userData.user);

            // Set user's existing chats
            const { data: chatData, error: chatError } = await supabase
                .from('chat_users')
                .select('chat_id')
                .eq('user_id', userData.user.id);

            if (chatError) {
                console.error('Error fetching chat IDs:', chatError);
                return;
            }

            const chats = chatData.map((chat: { chat_id: string }) => chat.chat_id);
            setChatIds(chats);

            // Set user's chat partners
            const { data: otherUserData, error: otherUserError } = await supabase
                .from('chat_users')
                .select('user_id')
                .in('chat_id', chats)
                .neq('user_id', userData.user.id);

            if (otherUserError) {
                console.error('Error fetching the id of the other user in chat:', otherUserError);
                return;
            }

            const otherUserIds = otherUserData.map((otherUser: { user_id: string }) => otherUser.user_id);
            setPartnerIds(otherUserIds);

            // Determine the chat ID to navigate to
            const haveChat = otherUserIds.indexOf(owner_id);
            const chatId = haveChat !== -1 ? chats[haveChat] : owner_id;

            router.push(`/chat?id=${chatId}`);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <div className="absolute top-0 left-0 pl-2 pt-2">
            <Button
                variant="subtle"
                size="compact-lg"
                style={{ color: button_color }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
            >
                <Text size='xl' fw={700} mr='7'>Chat</Text>
                <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
            </Button>
        </div>
    );
}

