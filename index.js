const express = require('express')
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const app = express()
const port = process.env.PORT || 8080;
const cors = require('cors')
var http = require('http');
var admin = require('firebase-admin');

// Middlewares
app.use(cors())
app.use(express.static('public'))
app.use(fileUpload({
    createParentPath: true
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Firebase config
//var serviceAccount = require("inductioniiitd2020-8b5d451ff02d.json");
var creds = {
    // CREDS GO HERE
}
var defaultApp = admin.initializeApp({
    credential: admin.credential.cert(creds),
    databaseURL: 'https://inductioniiitd2020.firebaseio.com/'
})
var defaultAuth = defaultApp.auth()
var defaultDB = defaultApp.database()


//var email = "yatharth19346@iiitd.ac.in"

app.get('/registration', (req, res, next) => {
    res.json('Registration view')
})

app.post('/applicationID', async (req, res, next) => {
    try {
        let applicationID = req.body.applicationid
        let email = req.body.email
        //let dbPoint = admin.database().ref('/users/')
        let dbPoint = defaultDB.ref(`/StudentList`)
        //var result = await dbPoint.orderByChild('studentEmail').startAt(email).endAt(email+"\uf8ff").limitToFirst(1).once("value")
        //var result = await dbPoint.once('value')
        dbPoint.child(applicationID).once('value', function(snap) {
            if (snap.val() == null || snap.val() == undefined) {
                res.json({success: false, result: {}, message: 'User Roll Number doesn\'t exist'})
            } else{
                if (snap.val()['studentEmail'] == email) {
                    res.json({success: true, result: snap.val()})
                } else {
                    res.json({success: false, result: {}, message: 'Email and Username don\'t match'})
                }
            }
        })
        /*dbPoint.once('value', (snap) => {
            if (snap == null || snap == undefined) res.json({success: false, result: {}, message: 'Some error has occured'})
            try {
            result = snap.val()
            
                if (result['studentEmail'] == email) {
                    res.json({success: true, result: result.val()})
                } else {
                    res.json({success: false, result: result.val(), message: 'Email and Username don\'t match'})
                }
            } catch(err) {
                res.json({success: false, result: result.val(), message: 'Some error has occured'})
            }
        })
        
        /*try {
            if (result.val['studentEmail'] === email) {
                res.json({success: true, result: result.val()})
            } else {
                res.json({success: false, result: result.val(), message: 'Email and Username don\'t match'})
            }
            
        } catch(err) {
            console.log("Error", err)
            res.json({result: ""})
        }*/
    } catch (err) {
        console.log("Error", err)
        res.json({'success': false, 'message': 'Not a valid application ID.'})
    }
})

app.post('/createUser', (req, res) => {
    let verification = true
    let dbPoint = defaultDB.ref(`/StudentList`)
    var userData
    dbPoint.child(req.body.applicationid).once('value', function(snap) {
        if (snap.val() == null || snap.val() == undefined) {
            res.json({'success': false, result: {}, 'message': 'User Roll Number doesn\'t exist'})
        } else{
            userData = snap.val()
            if (snap.val()['studentEmail'] == req.body.email) {
                defaultAuth.createUser({
                    uid: req.body.applicationid,
                    email: req.body.email,
                    emailVerified: true,
                    password: req.body.password,
                    disabled: false
                  })
                .then(function(userRecord) {
                    // See the UserRecord reference doc for the contents of userRecord.
                    console.log('Successfully created new user:', userRecord.uid);
                    var userData = {
                        'branch': snap.val()['Branch'],
                        'allocation': snap.val()['Final Allocation'],
                        "isVerified": false,
                        "groupCode": "Green",
                        "instaHandle": "",
                        "description": "",
                    }
                    var updates = {};
                    updates['/users/' + userRecord.uid] = userData;
                    defaultDB.ref().update(updates)
                    res.json({'success': true, result: {}, 'message': 'User created successfully.'})
                })
                .catch(function(error) {
                    console.log('Error creating new user:', error);
                    res.json({'success': false, result: {}, 'message': 'User creation failed.'})

                });
            } else {
                res.json({'success': false, result: {}, message: 'Email and Username don\'t match'})
            }
        }
    }) 
})

app.get('/uploadData', (req, res) => {
    res.send("Upload Data") 
})

app.post('/uploadData', (req, res) => {
    //console.log(req)
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let studentData = req.files.data;
            //console.log(studentData)
            csvData = studentData.data.toString('utf8');
            console.log(csvData)
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: studentData.name,
                    mimetype: studentData.mimetype,
                    size: studentData.size
                }
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
})

async function verifyUser() {
    return greeting = await Promise. resolve("Hello");
}

//defaultAuth.getUserByEmail(email)
//    .then(function(userRecord) {    
//        console.log(userRecord.toJSON())
//    })
//    .catch((err) => {
 //       console.log('Error fetching user data:', err)
 //   })

http.createServer(app).listen(port);
console.log('Server started! At http://localhost:' + port);
