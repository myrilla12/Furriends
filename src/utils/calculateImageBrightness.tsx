import { useEffect, useState } from 'react';

/**
 * Calculate image brightness
 * @param {string} imageUrl - Url of the image for which brightness is calculated
 * @returns {Promise<number>} - perceived brightness of the image in rgb color
 */

export const calculateImageBrightness = (imageUrl: string): Promise<number> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            let totalBrightness = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];
                totalBrightness += (r * 299 + g * 587 + b * 114) / 1000;
            }
            const averageBrightness = totalBrightness / (img.width * img.height);
            resolve(averageBrightness);
        };
    });
};
