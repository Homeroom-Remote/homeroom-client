import { useState, useEffect, useRef } from "react";

function Video({ stream, name, id, me = false, small = false }) {
  !me && console.log(`video update for ${name}`, stream?.getTracks());
  const [isTalking, setIsTalking] = useState(false);
  const audioDetectionInterval = useRef(null);

  const shouldDisplayVideoStream =
    stream &&
    stream.active &&
    stream.getVideoTracks().length > 0 &&
    !stream.getVideoTracks()[0].muted;

  const getHandGestureStyles = () => {
    return "absolute left-1/2 -translate-x-1/2 top-0 text-[40px]";
  };

  const audibleHandler = () => {
    if (isTalking) return "border-0";
    else return "border-lt-400 dark:border-dark-600 ";
  };

  useEffect(() => {
    if (!stream) return;
    const hasAudio = stream.getAudioTracks().length > 0;

    const removeAudioListener = () => {
      if (audioDetectionInterval.current) {
        clearInterval(audioDetectionInterval.current);
        audioDetectionInterval.current = null;
      }
    };

    const createAudioListener = () => {
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.minDecibels = -50;
      analyser.maxDecibels = 100;
      var source = audioCtx.createMediaStreamSource(stream);
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Float32Array(bufferLength);
      source.connect(analyser);

      audioDetectionInterval.current = setInterval(() => {
        analyser.getFloatFrequencyData(dataArray);
        const isAudible = (da) => {
          for (var i = 0; i < da.length; ++i) {
            if (da[i] > -90) return true;
          }
          return false;
        };
        setIsTalking(isAudible(dataArray));
      }, 500);
    };

    if (!hasAudio) setIsTalking(false);
    if (hasAudio && !audioDetectionInterval.current) createAudioListener();
    else if (!hasAudio && audioDetectionInterval.current) removeAudioListener();

    return () => removeAudioListener();
  }, [stream]);

  return (
    <div
      className={
        "h-full dark:bg-dark-800 bg-lt-300 place-items-center justify-center flex p-2 shadow-lg rounded-lg relative box-border overflow-hidden " +
        audibleHandler()
      }
    >
      {isTalking && (
        <>
          <span
            id="horizontal"
            className="absolute rotate-0 before:content-[''] before:bg-primary-400 before:h-1 before:w-full before:absolute before:animate-border-horizontal transform top-0 left-0 w-full h-full block box-borderv delay-100"
          ></span>
          <span
            id="vertical"
            className="absolute rotate-0 before:content-[''] before:bg-primary-400 before:w-1 before:h-full before:absolute before:animate-border-vertical transform top-0 left-0 w-full h-full block box-border"
          ></span>
          <span
            id="horizontal"
            className="absolute rotate-180 before:content-[''] before:bg-primary-400 before:h-1 before:w-full before:absolute before:animate-border-horizontal transform top-0 left-0 w-full h-full block box-border"
          ></span>
          <span
            id="vertical"
            className="absolute rotate-180 before:content-[''] before:bg-primary-400 before:w-1 before:h-full before:absolute before:animate-border-vertical transform top-0 left-0 w-full h-full block box-border"
          ></span>
        </>
      )}

      <p id={`hand-gesture-${id}`} className={getHandGestureStyles()}></p>
      <video
        muted={me}
        className={small ? "object-contain max-w-48 max-h-48" : "h-full w-auto"}
        ref={(e) => {
          if (e) {
            e.srcObject = stream;
          }
        }}
        autoPlay={true}
      ></video>
      {!shouldDisplayVideoStream && !small && (
        <h1 className="font-bold text-4xl absolute">{name}</h1>
      )}
      {small && <h3 className="font-medium text-md absolute top-0">{name}</h3>}
    </div>
  );
}

export default Video;
