import requests
from picamera import PiCamera
from time import sleep
import sys

firebaseConfig = {
    "apiKey": "AIzaSyBBJ1YbYsq4fPBDDD6p_uWea0s1dY9wSWo",
    "authDomain": "seatfinder-61154.firebaseapp.com",
    "databaseURL": "https://seatfinder-61154.firebaseio.com/",
    "projectId": "seatfinder-61154",
    "storageBucket": "",
    "messagingSenderId": "770999334680",
    "appId": "1:770999334680:web:e097971893318d0005d06d"
    }

camera = PiCamera()

camera.start_preview()
try:
    while(True):
        sleep(2)
        camera.capture('detect.jpg')
        image = {'file': open('detect.jpg', 'rb')}
        r = requests.post('https://{0}.ngrok.io/detect'.format(sys.argv[1]), files = image)

except KeyboardInterrupt:
    pass
camera.stop_preview()