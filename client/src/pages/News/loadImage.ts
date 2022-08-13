// Wait for all images to fully load before rendering data
export const loadImage = (imageURL: string) => {
  return new Promise((resolve, reject) => {
    const loadImg = new Image();
    loadImg.src = imageURL;
    loadImg.onload = () => resolve(imageURL);
    loadImg.onerror = (err) => reject(err);
  });
};
