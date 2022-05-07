import * as fp from "fingerpose";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";

var net = null;
var ThumbsDownGesture = null;
var RaiseHandGesture = null;

function IsReady() {
  return !!net;
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
    RaiseHandGesture.addCurl(finger, fp.FingerCurl.NoCurl); // Stretched out (nocurl)
    RaiseHandGesture.addDirection(finger, fp.FingerDirection.VeritcalUp, 1.0); // Straight up = 1.0 confidence.
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
  net = await handpose.load();
  InitThumbsDown();
  InitRaiseHand();
  console.log("Handpose model loaded.");
}

async function Detect(video) {
  const hand = await net.estimateHands(video);
  if (hand.length > 0) {
    const GestureEstimator = new fp.GestureEstimator([
      fp.Gestures.ThumbsUpGesture, // Came with package
      ThumbsDownGesture, // Manually constructed (InitThumbsDown())
      RaiseHandGesture, // Manually constructed (InitRaiseHand())
    ]);
    const gesture = await GestureEstimator.estimate(hand[0].landmarks, 4);

    if (gesture.gestures?.length > 0) {
      const confidence = gesture.gestures.map((prediction) => prediction.score);
      const maxConfidence = confidence.indexOf(
        Math.max.apply(null, confidence)
      );

      return gesture.gestures[maxConfidence].name;
    }
  }
}

const HandGestures = {
  net,
  IsReady,
  Init,
  Detect,
};

export default HandGestures;
