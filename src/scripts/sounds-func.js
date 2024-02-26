export function preloadSound(sound) {
  return new Promise((resolve) => {
    sound.load();
    if (sound) resolve(sound);
    else reject(sound);
  });
}

export async function createAndPrealodSounds(
  sounds,
  audios,
  loaderElementText,
  loaderElementBox,
  allElToLoad,
  elLoaded
) {
  try {
    for (const name in sounds) {
      audios[name] = [];
      for (let i = 0; i < sounds[name].length; i++) {
        audios[name][i] = new Audio();
        audios[name][i].src = sounds[name][i];
        await preloadSound(audios[name][i], loaderElementText);

        console.log(audios[name][i].src);
        if (loaderElementText) {
          loaderElementText.innerText = audios[name][i].src;
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
