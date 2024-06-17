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
    pet_photos: any;
    // will narrow down type of pet_photos after debugging
}
