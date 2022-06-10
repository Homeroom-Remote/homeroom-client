import * as faceapi from "@vladmandic/face-api";
import Duck from "./duck.jpg";

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
  if (video.paused) return null;

  try {
    const dataTinyYolo = await faceapi
      .detectAllFaces(video, optionsTinyFace)
      .withFaceExpressions();

    if (!dataTinyYolo || dataTinyYolo.length <= 0) return;

    const returnObj = {
      score: dataTinyYolo[0]?.detection._score || 0,
      expressions: clampThreshold(dataTinyYolo[0]?.expressions, 0.1),
    };

    return returnObj;
  } catch (e) {
    throw e;
  }
}

async function ColdStart() {
  const img = document.createElement("img");
  img.src = Duck;
  return await faceapi
    .detectAllFaces(img, optionsTinyFace)
    .withFaceExpressions();
}

const FaceRecognition = {
  Init,
  IsReady,
  Detect,
  ColdStart,
};

export default FaceRecognition;
