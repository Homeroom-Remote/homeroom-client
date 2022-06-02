import * as tf from "@tensorflow/tfjs";
import * as faceapi from "@vladmandic/face-api";

const modelPath = "models/";
const optionsTinyFace = new faceapi.TinyFaceDetectorOptions({
  scoreThreshold: 0.7,
});

var engine = null;

//////////
// Helpers
//////////
function clampThreshold(o, threshold) {
  return Object.entries(o).reduce(
    (o, [k, v]) => (v >= threshold ? { ...o, [k]: v } : { ...o, [k]: 0 }),
    {}
  );
}

const str = (json) =>
  json
    ? JSON.stringify(json)
        .replace(/{|}|"|\[|\]/g, "")
        .replace(/,/g, ", ")
    : "";

//////////
// Methods
//////////
function IsReady() {
  console.log(`engine ${str(engine?.state)}`);
  return !!engine;
}

async function Init() {
  await faceapi.tf.enableProdMode();
  await faceapi.tf.ENV.set("DEBUG", false);
  await faceapi.tf.ready();
  console.log("FaceAPI Test");

  const params = new URLSearchParams(window.location.search);
  if (params.has("backend")) {
    const backend = params.get("backend");
    await faceapi.tf.setWasmPaths(
      "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@3.17.0/dist/"
    );
    console.log(`Chosen backend: ${backend}`);
    await faceapi.tf.setBackend(backend);
  } else {
    console.log(`Defaulting to WebGL`);
    // default is webgl backend
    await faceapi.tf.setBackend("webgl");
  }
  console.log(
    `Version: FaceAPI ${str(
      faceapi?.version || "(not loaded)"
    )} TensorFlow/JS ${str(
      faceapi?.tf?.version_core || "(not loaded)"
    )} Backend: ${str(faceapi?.tf?.getBackend() || "(not loaded)")}`
  );
  console.log(
    `Flags: ${JSON.stringify(faceapi?.tf?.ENV.flags || { tf: "not loaded" })}`
  );

  await faceapi.nets.tinyFaceDetector.load(modelPath);
  await faceapi.nets.faceExpressionNet.load(modelPath);

  engine = await faceapi.tf.engine();
  console.log(`TF Engine State: ${str(engine.state)}`);
}

async function Detect(video) {
  return new Promise(async (resolve, reject) => {
    if (video.paused) reject("video paused");
    try {
      const dataTinyYolo = await faceapi
        .detectAllFaces(video, optionsTinyFace)
        .withFaceExpressions();
      const returnObj = {
        score: dataTinyYolo[0]?.detection._score || 0,
        expressions: clampThreshold(dataTinyYolo[0]?.expressions, 0.1),
      };

      resolve(returnObj);
    } catch (e) {
      //ignore
    }
  });
}

const FaceRecognition = {
  Init,
  IsReady,
  Detect,
};

export default FaceRecognition;
