export const random = Math.random;
export const floor = Math.floor;
export const cos = Math.cos;
export const sin = Math.sin;
export const pi = Math.PI;

export const randInt = (min, max) => floor(random() * (max - min + 1) + min);
export const randFloat = (min, max) => Math.random() * (max - min + 1) + min;
export const randNum = (...arr) => arr[randInt(0, arr.length - 1)];
