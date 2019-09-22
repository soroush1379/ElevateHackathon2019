import requests
from picamera import PiCamera
from time import sleep
import sys

camera = PiCamera()

camera.start_preview()
try:
    while(True):
        sleep(3)
        camera.capture('chairs.jpg')
        image = {'file': open('chairs.jpg', 'rb')}
        r = requests.post('https://{0}.ngrok.io/initialize'.format(sys.argv[1]), files = image)

except KeyboardInterrupt:
    pass
camera.stop_preview()