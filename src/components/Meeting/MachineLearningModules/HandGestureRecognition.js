import Handsfree from "handsfree";
useEffect(() => {
  const mediaStreamTracks = myStream?.getVideoTracks();
  if (!mediaStreamTracks || mediaStreamTracks.length <= 0) {
    // if not video
    return;
  }
  if (!MyHandsfree && document.querySelector("#myVideoEl")) {
    const handsfree = new Handsfree({
      showDebug: false,
      hands: true,
      setup: {
        video: {
          // This element must contain a [src=""] attribute or <source /> with one
          $el: document.querySelector("#myVideoEl"),
        },
      },
    });
    // handsfree.enablePlugins('browser')
    handsfree.start();
    const u_thumbs_up = handsfree.useGesture({
      name: "u_thumbs_up",
      algorithm: "fingerpose",
      models: "hands",
      confidence: "8.61",
      description: [
        ["addCurl", "Thumb", "NoCurl", 1],
        ["addDirection", "Thumb", "DiagonalUpRight", 1],
        ["addDirection", "Thumb", "VerticalUp", 0.625],
        ["addDirection", "Thumb", "DiagonalUpLeft", 0.25],
        ["addCurl", "Index", "FullCurl", 1],
        ["addDirection", "Index", "HorizontalRight", 0.3333333333333333],
        ["addDirection", "Index", "DiagonalUpRight", 1],
        ["addDirection", "Index", "VerticalUp", 0.1111111111111111],
        ["addDirection", "Index", "DiagonalUpLeft", 0.2222222222222222],
        ["addCurl", "Middle", "FullCurl", 1],
        ["addCurl", "Middle", "HalfCurl", 0.034482758620689655],
        ["addDirection", "Middle", "HorizontalRight", 1],
        ["addDirection", "Middle", "DiagonalUpRight", 0.2631578947368421],
        ["addDirection", "Middle", "DiagonalUpLeft", 0.3157894736842105],
        ["addCurl", "Ring", "FullCurl", 1],
        ["addCurl", "Ring", "NoCurl", 0.034482758620689655],
        ["addDirection", "Ring", "HorizontalRight", 1],
        ["addDirection", "Ring", "DiagonalUpRight", 0.043478260869565216],
        ["addDirection", "Ring", "HorizontalLeft", 0.08695652173913043],
        ["addDirection", "Ring", "DiagonalUpLeft", 0.17391304347826086],
        ["addCurl", "Pinky", "FullCurl", 1],
        ["addCurl", "Pinky", "HalfCurl", 0.034482758620689655],
        ["addDirection", "Pinky", "HorizontalRight", 1],
        ["addDirection", "Pinky", "HorizontalLeft", 0.3333333333333333],
        ["addDirection", "Pinky", "DiagonalDownRight", 0.047619047619047616],
        ["addDirection", "Pinky", "DiagonalDownLeft", 0.047619047619047616],
      ],
    });
    // u_thumbs_down = handsfree.useGesture({
    //   "name": "u_thumbs_down",
    //   "algorithm": "fingerpose",
    //   "models": "hands",
    //   "confidence": "8.5",
    //   "description": [
    //     [
    //       "addCurl",
    //       "Thumb",
    //       "NoCurl",
    //       1
    //     ],
    //     [
    //       "addDirection",
    //       "Thumb",
    //       "DiagonalDownRight",
    //       1
    //     ],
    //     [
    //       "addDirection",
    //       "Thumb",
    //       "VerticalDown",
    //       0.6875
    //     ],
    //     [
    //       "addCurl",
    //       "Index",
    //       "FullCurl",
    //       1
    //     ],
    //     [
    //       "addCurl",
    //       "Index",
    //       "NoCurl",
    //       0.2631578947368421
    //     ],
    //     [
    //       "addCurl",
    //       "Index",
    //       "HalfCurl",
    //       0.15789473684210525
    //     ],
    //     [
    //       "addDirection",
    //       "Index",
    //       "DiagonalDownRight",
    //       1
    //     ],
    //     [
    //       "addDirection",
    //       "Index",
    //       "HorizontalRight",
    //       0.3
    //     ],
    //     [
    //       "addDirection",
    //       "Index",
    //       "VerticalDown",
    //       0.9
    //     ],
    //     [
    //       "addDirection",
    //       "Index",
    //       "DiagonalDownLeft",
    //       0.4
    //     ],
    //     [
    //       "addDirection",
    //       "Index",
    //       "HorizontalLeft",
    //       0.1
    //     ],
    //     [
    //       "addCurl",
    //       "Middle",
    //       "FullCurl",
    //       1
    //     ],
    //     [
    //       "addCurl",
    //       "Middle",
    //       "HalfCurl",
    //       0.18181818181818182
    //     ],
    //     [
    //       "addCurl",
    //       "Middle",
    //       "NoCurl",
    //       0.045454545454545456
    //     ],
    //     [
    //       "addDirection",
    //       "Middle",
    //       "HorizontalRight",
    //       1
    //     ],
    //     [
    //       "addDirection",
    //       "Middle",
    //       "DiagonalDownRight",
    //       0.14285714285714285
    //     ],
    //     [
    //       "addDirection",
    //       "Middle",
    //       "DiagonalDownLeft",
    //       0.35714285714285715
    //     ],
    //     [
    //       "addDirection",
    //       "Middle",
    //       "VerticalDown",
    //       0.07142857142857142
    //     ],
    //     [
    //       "addDirection",
    //       "Middle",
    //       "HorizontalLeft",
    //       0.35714285714285715
    //     ],
    //     [
    //       "addCurl",
    //       "Ring",
    //       "FullCurl",
    //       1
    //     ],
    //     [
    //       "addCurl",
    //       "Ring",
    //       "HalfCurl",
    //       0.08
    //     ],
    //     [
    //       "addDirection",
    //       "Ring",
    //       "HorizontalRight",
    //       1
    //     ],
    //     [
    //       "addDirection",
    //       "Ring",
    //       "HorizontalLeft",
    //       0.5714285714285714
    //     ],
    //     [
    //       "addDirection",
    //       "Ring",
    //       "DiagonalUpRight",
    //       0.07142857142857142
    //     ],
    //     [
    //       "addDirection",
    //       "Ring",
    //       "VerticalDown",
    //       0.07142857142857142
    //     ],
    //     [
    //       "addDirection",
    //       "Ring",
    //       "DiagonalDownLeft",
    //       0.21428571428571427
    //     ],
    //     [
    //       "addCurl",
    //       "Pinky",
    //       "FullCurl",
    //       1
    //     ],
    //     [
    //       "addCurl",
    //       "Pinky",
    //       "HalfCurl",
    //       0.038461538461538464
    //     ],
    //     [
    //       "addDirection",
    //       "Pinky",
    //       "HorizontalRight",
    //       1
    //     ],
    //     [
    //       "addDirection",
    //       "Pinky",
    //       "DiagonalUpRight",
    //       0.18181818181818182
    //     ],
    //     [
    //       "addDirection",
    //       "Pinky",
    //       "VerticalUp",
    //       0.2727272727272727
    //     ],
    //     [
    //       "addDirection",
    //       "Pinky",
    //       "DiagonalUpLeft",
    //       0.09090909090909091
    //     ],
    //     [
    //       "addDirection",
    //       "Pinky",
    //       "DiagonalDownRight",
    //       0.09090909090909091
    //     ],
    //     [
    //       "addDirection",
    //       "Pinky",
    //       "DiagonalDownLeft",
    //       0.18181818181818182
    //     ],
    //     [
    //       "addDirection",
    //       "Pinky",
    //       "HorizontalLeft",
    //       0.6363636363636364
    //     ]
    //   ]
    // })
    handsfree.use("logger", (data) => {
      // console.log(data.hands.gesture)
      const tunmbs_up = data?.hands?.gesture?.find((event) => {
        return event?.name === "u_thumbs_up";
      });
      // const tunmbs_down = data?.hands?.gesture?.find((event) => {
      //   return event?.name === "u_thumbs_down"
      // })
      if (tunmbs_up) {
        console.log("tunmbs_up");
        console.log(tunmbs_up);
      }
      // if (tunmbs_down) {
      //   console.log("thumbs_down")
      //   console.log(tunmbs_down)
      // }
    });
    handsfree.on("u_thumbs_up", (event) => {
      console.log(event.detail);
    });
    // handsfree.on("u_thumbs_down", (event) => {
    //   console.log(event.detail)
    // })
    console.log("DEBUG");
    console.log(handsfree.debug);
    setMyHandsfree(handsfree.canvas);
  }
}, [myStream]);
