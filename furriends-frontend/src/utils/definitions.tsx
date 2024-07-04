export type Pet = {
    id: string;
    owner_id: string;
    name: string;
    type: string;
    breed: string;
    weight: number;
    birthday: string;
    energy_level: string;
    description: string;
    likes: string;
    created_at: string;
    photos: string[];
}

export type Profile = {
    id: string;
    avatar_url: string;
    username: string;
}

export type Message = {
    created_at?: string;
    chat_id: string | null;
    content: string;
    author_id: string;
    read_at?: string;
}

export type Chats = { 
    id: string;
    otherUser: Profile;
    notification: number; 
}[]