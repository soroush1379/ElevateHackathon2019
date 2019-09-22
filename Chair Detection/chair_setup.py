import numpy as np
import cv2


window_main = 'Chairs'
img_in = cv2.imread('chairs.jpg', 1)
img_out = np.array(img_in)
dx = 5
dy = 5
detection_tol = 10
win_width = 1000
win_height = 800
chairpos = []


class queue:
    a = []

    def enqueue(self, x):
        self.a = self.a + [x]
        return True

    def dequeue(self):
        output = self.a[0]
        self.a = self.a[1:]
        return output


def undo():
    global window_main
    global img_in
    global img_out
    global chairpos

    if len(chairpos) == 0:
        return True

    chair = chairpos[-1]
    chairpos = chairpos[:-1]

    for p in chair:
        x = p[0]
        y = p[1]

        cv2.circle(img_out, (x, y), 1, (int(img_in[y, x][0]), int(img_in[y, x][1]), int(img_in[y, x][2])), -1)

    cv2.imshow(window_main, img_out)

    return True


def compare_color(x1, y1, x2, y2):
    global img_in
    global img_out
    global detection_tol

    c1 = np.array(img_in[y1, x1], dtype=int)
    c2 = np.array(img_in[y2, x2], dtype=int)

    if np.sum(np.abs(c2 - c1)) > detection_tol:
        return False

    return True


def detect_chair(x_0, y_0):
    global window_main
    global img_in
    global img_out
    global dx
    global dy
    global chairpos

    chair = []

    q = queue()
    q.enqueue([x_0, y_0])

    while len(q.a) > 0:
        point = q.dequeue()
        x = point[0]
        y = point[1]
        chair = chair + [[x, y]]

        cv2.circle(img_out, (x, y), 1, (0, 0, 255), -1)

        if compare_color(x, y, x + dx, y) and not np.array_equal(img_out[y, x + dx], [0, 0, 255]):
            q.enqueue([x + dx, y])
            cv2.circle(img_out, (x + dx, y), 1, (0, 0, 255), -1)

        if compare_color(x, y, x - dx, y) and not np.array_equal(img_out[y, x - dx], [0, 0, 255]):
            q.enqueue([x - dx, y])
            cv2.circle(img_out, (x - dx, y), 1, (0, 0, 255), -1)

        if compare_color(x, y, x, y + dy) and not np.array_equal(img_out[y + dy, x], [0, 0, 255]):
            q.enqueue([x, y + dy])
            cv2.circle(img_out, (x, y + dy), 1, (0, 0, 255), -1)

        if compare_color(x, y, x, y - dy) and not np.array_equal(img_out[y - dy, x], [0, 0, 255]):
            q.enqueue([x, y - dy])
            cv2.circle(img_out, (x, y - dy), 1, (0, 0, 255), -1)

    chairpos = chairpos + [chair]

    return True


def mouse_click(event, x, y, flags, param):
    global window_main
    global img_in
    global img_out

    if event == cv2.EVENT_LBUTTONDOWN:
        detect_chair(x, y)
        cv2.imshow(window_main, img_out)

    return True


def main():
    global window_main
    global chairpos
    global img_in
    global img_out
    global win_width
    global win_height

    cv2.namedWindow(window_main, 0)
    cv2.setMouseCallback(window_main, mouse_click)
    cv2.resizeWindow(window_main, win_width, win_height)

    if img_in is None:
        print('Could not find the picture specified!')
        return True

    cv2.imshow(window_main, img_out)

    while 1 == 1:
        k = cv2.waitKey(0)

        if k == ord('z'):
            undo()
        if k == 27:
            break


    cv2.destroyAllWindows()

    output = open('output.txt', 'w')
    for chair in chairpos:
        line = str(len(chair)) + '\n'
        for p in chair:
            x = p[0]
            y = p[1]
            c = img_in[y, x]
            line = line + str(x) + ',' + str(y) + ',' + str(c[0]) + ',' + str(c[1]) + ',' + str(c[2]) + '\n';

        output.write(line)

    output.close()

    return True

if __name__ == '__main__':
    main()