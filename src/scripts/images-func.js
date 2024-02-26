export function preloadImage(image) {
  return new Promise((resolve, reject) => {
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(image));
  });
}

export async function createAndPrealodImagesForSprites(
  sprites,
  images,
  loaderElementText,
  loaderElementBox,
  allElToLoad,
  elLoaded
) {
  try {
    for (const name in sprites) {
      images[name] = {};
      for (const prop in sprites[name]) {
        images[name][prop] = new Image();
        images[name][prop].src = sprites[name][prop];
        await preloadImage(images[name][prop]);
        
        console.log(images[name][prop].src);
        if (loaderElementText) {
          loaderElementText.innerText = images[name][prop].src;
        }
        elLoaded.loaded++;
        loaderElementBox.style.width =
          (elLoaded.loaded / allElToLoad) * 100 + "%";
      }
    }
  } catch (e) {
    console.error(e);
  }
}
