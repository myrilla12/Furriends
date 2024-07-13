export type Pet = {
    id: string;
    owner_id: string;
    name: string;
    type: string;
    breed: string;
    weight: number | null;
    birthday: string;
    energy_level: string | null;
    description: string | null;
    likes: string | null;
    photos: string[] | null;
}

export type Profile = {
    id: string;
    avatar_url: string;
    username: string;
    freelancer?: boolean;
}

export type Message = {
    id?: string;
    created_at?: string;
    chat_id: string | null;
    content: string;
    author_id: string;
    read_at?: string;
    edited_at?: string;
    disabled?: boolean;
}

export type Chats = { 
    id: string;
    otherUser: Profile;
    notification: number; 
}[]

export type FreelancerPost = {
    photo: string;
    title: string;
    content: string;
    location: string;
    pricing: number[];
    author_id: string;
    created_at?: string;
}