import * as fp from "fingerpose";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import Duck from "./duck.jpg";

var net = null;
var ThumbsDownGesture = null;
var RaiseHandGesture = null;
var FistGesture = null;
var GestureEstimator = null;
const state = {
  backend: "webgl",
};

function IsReady() {
  console.log(`isReaddy ${!!net}`);
  return !!net;
}

function Destroy() {}

function InitFist() {
  FistGesture = new fp.GestureDescription("fist");

  // thumb: half curled
  // accept no curl with a bit lower confidence
  FistGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  FistGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 0.5);

  // all other fingers: curled
  for (let finger of [
    fp.Finger.Index,
    fp.Finger.Middle,
    fp.Finger.Ring,
    fp.Finger.Pinky,
  ]) {
    FistGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    FistGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
  }
}

function InitRaiseHand() {
  RaiseHandGesture = new fp.GestureDescription("raise_hand");

  // For every finger
  for (let finger of [
    fp.Finger.Index,
    fp.Finger.Middle,
    fp.Finger.Ring,
    fp.Finger.Pinky,
    fp.Finger.Thumb,
  ]) {
    RaiseHandGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0); // Stretched out (nocurl)
    // RaiseHandGesture.addDirection(finger, fp.FingerDirection.VeritcalUp, 1.0); // Straight up = 1.0 confidence.
  }
}

function InitThumbsDown() {
  ThumbsDownGesture = new fp.GestureDescription("thumbs_down");

  ThumbsDownGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl); // Stretched out (nocurl)
  ThumbsDownGesture.addDirection(
    fp.Finger.Thumb,
    fp.FingerDirection.VeritcalDown,
    1.0
  ); // Pointing directly down = score 1.0
  ThumbsDownGesture.addDirection(
    fp.Finger.Thumb,
    fp.FingerDirection.DiagonalDownLeft,
    0.9
  ); // Pointing down but a bit left = 0.9 confidence
  ThumbsDownGesture.addDirection(
    fp.Finger.Thumb,
    fp.FingerDirection.DiagonalDownRight,
    0.9
  ); // Pointing down but a bit right = 0.9 confidence

  // For every other finger
  for (let finger of [
    fp.Finger.Index,
    fp.Finger.Middle,
    fp.Finger.Ring,
    fp.Finger.Pinky,
  ]) {
    ThumbsDownGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0); // Fully curled 1.0 confidence
    ThumbsDownGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9); // Allow half curls with 0.9 confiedence.
  }
}

async function Init() {
  await tf.setBackend(state.backend);
  if (!tf.env().getAsync("WASM_HAS_SIMD_SUPPORT") && state.backend == "wasm") {
    console.warn(
      "The backend is set to WebAssembly and SIMD support is turned off.\nThis could bottleneck your performance greatly, thus to prevent this enable SIMD Support in chrome://flags"
    );
  }
  net = await handpose.load();
  InitThumbsDown();
  InitRaiseHand();
  InitFist();
  GestureEstimator = new fp.GestureEstimator([
    fp.Gestures.ThumbsUpGesture, // Came with package
    ThumbsDownGesture, // Manually constructed (InitThumbsDown())
    RaiseHandGesture, // Manually constructed (InitRaiseHand())
    FistGesture, // Manually constructed (InitFist())
  ]);
  console.log("Handpose model loaded.");
}

async function Detect(video) {
  try {
    if (video.paused) return null;

    const hand = await net.estimateHands(video);
    if (hand.length <= 0) return null;

    const gesture = await GestureEstimator.estimate(hand[0].landmarks, 8.8);
    if (!gesture.gestures?.length || gesture.gestures?.length <= 0) return null;

    const confidence = gesture.gestures.map((prediction) => prediction.score);
    const maxConfidence = confidence.indexOf(Math.max.apply(null, confidence));

    return gesture.gestures[maxConfidence].name;
  } catch (e) {
    console.warn(e);
    throw e;
  }
}

async function ColdStart() {
  const img = document.createElement("img");
  img.src = Duck;
  img.width = 480;
  img.height = 640;
  return await net.estimateHands(img);
}

const HandGestures = {
  net,
  IsReady,
  Init,
  Detect,
  Destroy,
  ColdStart,
};

export default HandGestures;
