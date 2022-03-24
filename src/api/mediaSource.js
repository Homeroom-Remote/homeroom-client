export default class mediaSource {
  #source = null;
  constructor() {
    this.#source = this.createEmptyMediaStream({ width: 640, height: 480 });
  }

  getSource = () => this.#source;

  removeVideo = () => {
    this.#source
      .getVideoTracks()
      .forEach((track) => this.#source.removeTrack(track));
  };

  removeAudio = () => {
    this.#source
      .getAudioTracks()
      .forEach((track) => this.#source.removeTrack(track));
  };

  replaceVideo = (videoTrack) => {
    this.removeVideo();
    videoTrack && this.#source.addTrack(videoTrack);
  };

  replaceAudio = (audioTrack) => {
    this.removeAudio();
    audioTrack && this.#source.addTrack(audioTrack);
  };

  addVideoFromStream = (stream) => {
    if (!stream) return;
    this.replaceVideo(stream.getVideoTracks()[0]);
  };

  addAudioFromStream = (stream) => {
    if (!stream) return;
    this.replaceAudio(stream.getAudioTracks()[0]);
  };
  createEmptyMediaStream({ width, height }) {
    const canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    return canvas.captureStream(0);
  }
}
