const express = require('express');
const multer = require('multer');
const firebase = require('firebase');
spawn = require('child_process').spawn;

const firebaseConfig = {
    apiKey: "AIzaSyATqXCOMSRsgOBenYcmLHXJj7OKycFPtjk",
    authDomain: "openspot-7313a.firebaseapp.com",
    databaseURL: "https://openspot-7313a.firebaseio.com",
    projectId: "openspot-7313a",
    storageBucket: "",
    messagingSenderId: "436513055290",
    appId: "1:436513055290:web:c7fa3b1300b10932dc4b03"
};

firebase.initializeApp(firebaseConfig);

var storageInit = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './')
    },
    filename: function (req, file, cb) {
        cb(null, 'chairs.jpg')
    }
});
var storageDetect = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './')
    },
    filename: function (req, file, cb) {
        cb(null, 'detect.jpg')
    }
});
const uploadInit = multer({storage: storageInit});
const uploadDetect = multer({storage: storageDetect});
const port = 3000;

const app = express();
//app.use(express.json);

app.listen(port, () => console.log('listening on port %d', port));

app.get('/', function(req, res, next){
    res.send("Nice.");
});

app.post('/initialize', uploadInit.single('file'), function(req, res, next) {
    var py = spawn('python3', ['./chair_setup.py']);
    py.stdout.on('data', function(data) {
        console.log(data);
    });
    res.send("done");
});

app.post('/detect', uploadDetect.single('file'), function(req, res, next) {
    var py = spawn('python3', ['./seat_detection.py']);
    py.stdout.on('data', function(data) {
        console.log(data.toString());
        firebase.ref("locations/234 Bay Street/rooms/Trading Floor").set(data);
        res.send("done");
    });
});