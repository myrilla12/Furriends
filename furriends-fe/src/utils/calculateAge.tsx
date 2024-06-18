import { Pet } from './definitions';

/**
 * Calculate current pet age based on birthday
 * @param {Pet} pet - Pet object containing the birthday
 * @returns {number} - age of the pet in years
 */

export function calculateAge(pet: Pet): number {
    return new Date().getFullYear() - new Date(pet.birthday).getFullYear();
}
