import createClient from "@/utils/supabase/api";
import { createClient as CC } from "@/utils/supabase/component";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { Button, Text } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

type ChatButtonProps = {
    owner_id: string,
}

export default function ChatButton({ owner_id }: ChatButtonProps) {
    const supabase = CC();
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [chatIds, setChatIds] = useState<string[]>([]);
    const [partnerIds, setPartnerIds] = useState<string[]>([]);

    async function handleClick() {
        try {
            // Set current user
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) {
                console.error('Error fetching user:', userError);
                return;
            }
            setUser(userData.user);
            console.log("User set:", userData.user);

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
            console.log("Chat IDs set:", chats);

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
            console.log("Partner IDs set:", otherUserIds);

            // Determine the chat ID to navigate to
            const haveChat = otherUserIds.indexOf(owner_id);
            const chatId = haveChat !== -1 ? chats[haveChat] : owner_id;
            console.log("Navigating to chat ID:", chatId);

            router.push(`/chat?id=${chatId}`);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <div className="absolute top-0 left-0 pl-2 pt-2 mix-blend-difference">
            <Button variant="subtle" size="compact-lg"
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                    console.log("attempt set user", user)
                    console.log("attempt set chatids", chatIds)
                    console.log("attempt set partnerid", partnerIds)
                }}
            >
                <Text size='xl' fw={700} mr='7'>Chat</Text>
                <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
            </Button>
        </div>
    );
}

