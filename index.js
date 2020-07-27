const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const cors = require('cors')
var http = require('http');
var admin = require('firebase-admin');

// Middlewares
app.use(cors())
app.use(express.static('public'))


// Firebase config
var serviceAccount = require(".\\inductioniiitd2020-8b5d451ff02d.json");
var defaultApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://inductioniiitd2020.firebaseio.com/'
})
var defaultAuth = defaultApp.auth()
var defaultDB = defaultApp.database()


//var email = "yatharth19346@iiitd.ac.in"

app.get('/registration', (req, res, next) => {

    res.json('Registration view')
})

app.get('/applicationID', (req, res, next) => {
    try {
        let applicationID = req.body.applicationid
    } catch (err) {
        console.log("Error", err)
        res.json({'Success': false, 'Message': 'Not a valid application ID or already registered user'})
    }
})

app.post('/createUser', (req, res) => {
    let verification = await verifyUser()
    if (verification) {
        defaultAuth.createUser({
            email: req.body.email,
            emailVerified: true,
            password: req.body.password,
            disabled: false
          })
        .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully created new user:', userRecord.uid);
            res.send({'Success': true, 'Message': 'User Created Successfully!'})
        })
        .catch(function(error) {
            console.log('Error creating new user:', error);
            res.send({'Success': false, 'Message': 'User Creation Failed'})
        });
    }
    
})

async function verifyUser() {
    return true;
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