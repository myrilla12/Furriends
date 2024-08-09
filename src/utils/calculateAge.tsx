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

/**
 * Calculate current pet age based on birthday
 * @param {number} age - number representing age in years
 * @returns {string} - "<age> month(s)/year(s) old"
 */
export function getAgeString(age: number) {
    let ageString = age + (age == 1 ? " year old" : " years old")
    if (age < 1) {
        const ageInMonths = Math.ceil(age * 12);
        ageString = ageInMonths + (ageInMonths == 1 ? " month old" : " months old")
    }
    return ageString;
}