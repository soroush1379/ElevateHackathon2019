import numpy as np
import matplotlib as plt
import cv2
import math


chairs = []
img_in = None
img_ref = None
precision = 15
cam_mov = 50
cam_mov_precision = 5
detection_tol = 10


def readChairs():
    global chairs
    global img_in

    reader = open('output.txt', 'r')

    while 1 == 1:
        line = reader.readline()
        if line == '':
            break

        n = int(line)

        chair = []
        for i in range(n):
            line = reader.readline()
            inputs = line.split('\n')[0].split(',')

            k = []
            for j in inputs:
                k = k + [int(j)]

            chair = chair + [list(k)]

        chairs = chairs + [list(chair)]

    return True


def compare_color(x1, y1, x2, y2):
    global img_in
    global img_ref
    global detection_tol

    c1 = np.array(img_in[y1, x1], dtype=int)
    c2 = np.array(img_ref[y2, x2], dtype=int)

    if np.sum(np.abs(c2 - c1)) > detection_tol:
        return False

    return True


def checkChairs(input_address, reference_address):
    global img_in
    global img_ref
    global chairs
    global cam_mov
    global precision
    global cam_mov_precision

    readChairs()

    img_in = cv2.imread(input_address, 1)
    img_ref = cv2.imread(reference_address, 1)

    output = [1] * len(chairs)

    index = 0
    for chair in chairs:
        counter = 0
        for i in range(0, len(chair), precision):
            x = chair[i][0]
            y = chair[i][1]

            flag = False
            for m in range(-cam_mov, cam_mov + 1, cam_mov_precision):
                for n in range(-cam_mov, cam_mov + 1, cam_mov_precision):
                    if compare_color(x + n, y + m, x, y):
                        flag = True
                        break

            if flag:
                counter = counter + 1

        cover = counter * precision / len(chair)
        if cover < 0.5:
            output[index] = 0

        index = index + 1

    return output
