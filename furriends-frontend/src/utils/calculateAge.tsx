import { Pet } from './definitions';

/**
 * Calculate current pet age based on birthday
 * @param {Pet} pet - Pet object containing the birthday
 * @returns {number} - age of the pet in years
 */

export function calculateAge(pet: Pet): number {
    const birthDate = new Date(pet.birthday);
    const today = new Date();
    const ageInYears = today.getFullYear() - birthDate.getFullYear();

    if (ageInYears < 1) {
        const ageInMonths = today.getMonth() - birthDate.getMonth();
        return parseFloat((ageInMonths / 12).toFixed(2));
    }

    return ageInYears;
}
