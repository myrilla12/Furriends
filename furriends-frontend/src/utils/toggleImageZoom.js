let enlarged = 0;

/**
 * Allow image to be enlarged and reduced in size
 * @param img - image to be enlarged / reduced
 * @returns {number} - number showing whether image is enlarged or not
 */

export function toggleImageZoom(img) {
    if (enlarged === 0) {
        img.style.transform = "scale(5)";
        img.style.transition = "transform 0.25s ease";
        enlarged = 1;
    } else {
        img.style.transform = "scale(1)";
        img.style.transition = "transform 0.25s ease";
        enlarged = 0;
    }
    return enlarged;
}
