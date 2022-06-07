// renderer.js
navigator.mediaDevices.getDisplayMedia = async () => {
  return new Promise((resolve, reject) => {
    globalThis
      .myCustomGetDisplayMedia()
      .then(async (id) => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720,
            },
          },
        });
        resolve(stream);
      })
      .catch((e) => reject(e));
  });

  // create MediaStream
};
