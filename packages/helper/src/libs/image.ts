export function preLoadImage(source: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = source;
    image.onload = (event) => {
      resolve(event);
    };
    image.onerror = (event) => {
      reject(event);
    };
  });
}

export function preLoadImages(sources: string[]) {
  const promises = sources.map((src) => preLoadImage(src));
  return Promise.all(promises);
}
