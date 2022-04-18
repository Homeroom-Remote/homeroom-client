# TechVidvan hand Gesture Recognizer
# import necessary packages
import base64
import cv2
import sys
import os
import numpy as np
import mediapipe as mp
from tensorflow.keras.models import load_model
sys.stdout.flush()

# initialize mediapipe
mpHands = mp.solutions.hands
hands = mpHands.Hands(max_num_hands=1, min_detection_confidence=0.7)
mpDraw = mp.solutions.drawing_utils

path = os.getcwd() + '/src/python/hand_gestures/'
# Load the gesture recognizer model
model = load_model(path + 'mp_hand_gesture')
# Load class names
f = open(path + 'gesture.names', 'r')
classNames = f.read().split('\n')
f.close()

# Initialize the webcam

while True:
    sys.stdout.flush()
    inline = sys.stdin.readline().split(",")[1]
    decoded = base64.b64decode(inline)

    with open(path + 'test_save.jpeg', 'wb') as f:
        f.write(decoded)
    frame = cv2.imread(path + 'test_save.jpeg', cv2.IMREAD_COLOR)

    # Read each frame from the webcam
    x, y, c = frame.shape
    # Flip the frame vertically
    frame = cv2.flip(frame, 1)
    framergb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Get hand landmark prediction
    result = hands.process(framergb)

    # post process the result
    if result.multi_hand_landmarks:
        landmarks = []
        for handslms in result.multi_hand_landmarks:
            for lm in handslms.landmark:
                # print(id, lm)
                lmx = int(lm.x * x)
                lmy = int(lm.y * y)

                landmarks.append([lmx, lmy])

            # Drawing landmarks on frames
            mpDraw.draw_landmarks(frame, handslms, mpHands.HAND_CONNECTIONS)

            # Predict gesture
            if not model.predict: continue
            prediction = model.predict([landmarks])
            # print(prediction)
            classID = np.argmax(prediction)  # Owen missed...
            className = classNames[classID]
            # Check for student say yes/"like"
            if className == 'thumbs up':
                print("thumbs_up")
            elif className == 'thumbs down':  # Check for student say no/"dislike"
                print("thumbs_down")
