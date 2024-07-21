import { IconBuildingStore, IconPool, IconScissors, IconBuilding, IconToolsKitchen3, IconTrees, IconStethoscope, IconPaw, IconMapPinFilled } from '@tabler/icons-react';
import React from 'react';

/**
 * An array of legend items with their corresponding icon components.
 * 
 * @type {Array<{ type: string, IconComponent: React.ComponentType }>}
 */
const legendItems = [
    { type: 'Pet shop', IconComponent: IconBuildingStore },
    { type: 'Pet swimming pool', IconComponent: IconPool },
    { type: 'Pet grooming', IconComponent: IconScissors },
    { type: 'Pet-friendly mall', IconComponent: IconBuilding },
    { type: 'Pet-friendly cafe/restaurant', IconComponent: IconToolsKitchen3 },
    { type: 'Pet-friendly park', IconComponent: IconTrees },
    { type: 'Veterinary clinic', IconComponent: IconStethoscope },
    { type: 'Other', IconComponent: IconPaw },
];

/**
 * A React functional component that renders a legend for different types of pet-related locations.
 * 
 * @returns {JSX.Element} The rendered Legend component.
 */
export default function Legend() {
    return (
        <div className='flex items-center justify-end mt-1 mr-8'>
            <div className='flex items-center'>
                <IconMapPinFilled className='w-7 h-7 p-1 text-red-600' />
                <span className='mr-3 text-xs text-gray-500'>You</span>
            </div>
            {legendItems.map(({ type, IconComponent }) => (
                <div key={type} className='flex items-center'>
                    <IconComponent className='w-7 h-7 p-1 text-brown' />
                    <span className='mr-3 text-xs text-gray-500'>{type}</span>
                </div>
            ))}
        </div>
    );
}