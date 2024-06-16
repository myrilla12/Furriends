// allow image to be enlarged and reduced in size
let enlarged = 0;

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
