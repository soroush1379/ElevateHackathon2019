from firebase import Firebase
from picamera import PiCamera
from time import sleep
import seat_detection
from threading import Thread

firebaseConfig = {
    "apiKey": "AIzaSyBBJ1YbYsq4fPBDDD6p_uWea0s1dY9wSWo",
    "authDomain": "seatfinder-61154.firebaseapp.com",
    "databaseURL": "https://seatfinder-61154.firebaseio.com/",
    "projectId": "seatfinder-61154",
    "storageBucket": "",
    "messagingSenderId": "770999334680",
    "appId": "1:770999334680:web:e097971893318d0005d06d"
    }

firebase = Firebase(firebaseConfig)
db = firebase.database()

camera = PiCamera()

camera.start_preview()
try:
    results = {"empty_seats": 3}
    while(True):
        sleep(3)
        camera.capture('detect.jpg')
        thread = Thread(target=seat_detection.checkChairs, args=('detect.jpg', 'input.jpg', results))
        thread.join()
        print(results['empty_seats'])

except KeyboardInterrupt:
    pass
camera.stop_preview()

db.child("40 St George Street").set({'2210':'0'})