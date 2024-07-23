import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { IconBuildingStore, IconPool, IconScissors, IconBuilding, IconToolsKitchen3, IconTrees, IconStethoscope, IconPaw } from '@tabler/icons-react';

/**
 * Returns the URL of the SVG icon based on the type of the pet-related location.
 *
 * @param {string} type - The type of the pet-related location.
 * @returns {string} The URL of the SVG icon.
 */
export default function getIconUrl(type: string) {
    let IconComponent;
    switch (type) {
        case 'Pet shop':
            IconComponent = IconBuildingStore;
            break;
        case 'Pet swimming pool':
            IconComponent = IconPool;
            break;
        case 'Pet grooming':
            IconComponent = IconScissors;
            break;
        case 'Pet-friendly mall':
            IconComponent = IconBuilding;
            break;
        case 'Pet-friendly cafe/restaurant':
            IconComponent = IconToolsKitchen3;
            break;
        case 'Pet-friendly park':
            IconComponent = IconTrees;
            break;
        case 'Veterinary clinic':
            IconComponent = IconStethoscope;
            break;
        default:
            IconComponent = IconPaw;
            break;
    }
    const customSvg = createCustomIconSvg(IconComponent);
    return convertSvgToUrl(customSvg);
};

/**
 * Creates a custom SVG icon as a string using the specified IconComponent.
 * The custom icon consists of a brown circle with the corresponding business icon in the middle.
 *
 * @param {React.ElementType} IconComponent - The React component for the icon.
 * @returns {string} The custom SVG icon as a string.
 */
const createCustomIconSvg = (IconComponent: React.ElementType) => {
    const iconSvg = ReactDOMServer.renderToString(<IconComponent size={20} color="white" />);
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#6d543e"/>
            <g transform="translate(10, 10)">
                ${iconSvg}
            </g>
        </svg>
    `;
};

/**
 * Converts an SVG string to a URL.
 * Used in the icon parameter when adding business icons to the map.
 *
 * @param {string} svgString - The SVG string to convert.
 * @returns {string} The data URL of the SVG string.
 */
const convertSvgToUrl = (svgString: string) => {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`;
};