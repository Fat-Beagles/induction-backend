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
    "type": "service_account",
    "project_id": "inductioniiitd2020",
    "private_key_id": "8b5d451ff02d9efa59bb5269366a50376bb76fe0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5GZlJdJU/tXH0\nK6Xr5FdrCBFJmf8OIePH1lO26pqXswF+S7SFgUoL/OXaHz2OS0lzONhEuCm9/3nz\n/N2qmg0XFOj+1d+YR1E8xAq0nSXDwekuc7a+TuvkKIEiGK5L60Eo305vgEDBYK/2\n1BLWsXmaTMF65MCMvtU/Zo+6eENcOi0D4FuoXCwxgKto/TSLh3KEyzWOqv1xuEIY\nFpTruOelOx1bzxTSFiu07LNrSrE3iGJbG73pVfP62kqg3YHQJaziwpzxsFz+iGCH\nVAOufRlhA8T50VfsKfPHmVxpCmV4K8v/enATLGqSbFkjKWiN9twhzs3Dx5MYlAjd\nCupUZj8jAgMBAAECggEAQlh5F5moh2HfewAMJF2/sbb+D04Z3DRsgywA7J7xk29P\nmTfEeFfrtRlMP98TvsWgiaK17ge+uoHwcfJQd75o872EeBcr4lapuSihl7R+HUkL\nbiF+vn7mUWztQE3tZ3vm6qID6LZlP4sK92Nzby3E4vghH44PsEMUh3mZCeLibhM0\nQV4vF0f/3uxjqfAf+TQ4BlbseAQwFxAwbZfyHE1LUpKBEJ58zK9QUeTOerxHoiEZ\nNKHIZz9nQlSW43vsehm6omHD0T0NHSQe8uvOzYNDd5RnPhz8Vcm3VuxHLO8UZruT\ndBWfaiBv4WKzw3lLh9D023POHWAyJ84K3CSeDP0myQKBgQD9kb8YQwlxKAUAYl75\nklFzFDTFB/yDYSRLfAWhdRC3rpvYMOeIFLh80pCipQ24C+cDgdIs+V42xglWeuO5\nRmFVofVtW3fGEcGwRoMVEZ+8hju/znX32el17j2jLRdpHHod3DzOEt73Q6PcPsiq\nlBdDyMbFLv3rEDlKPClENLcnCQKBgQC639SA5Mp4kiLQx0q/PTv6dAxf5XiJMEAC\nr9/vWMf1jSnzlAVS9N5LzXYXZPs85a3KZLYayT/JLNzA/gJfFUrGulDIZLUS5hI/\nuwuqHuIBZ9Mv6UY3ovuIcL80gT3QOori/ccpEYzfEySQSeXVirVR3aXMSpcxV558\nJgMOAKezywKBgQD2l+SVPaxTBS5H/2KJpwfauE3RR0EEq1XWqtf2+pe1afNZPcYM\nisoXadcKtSUwVTLmMDwrTJ+Y+OJf3cbUiWNjGcxJ+2fxkZchTJFxzd/gQVKd57TF\nwn/OFlCO/e0EZZNEssfXSHbZVEhoig4wBTDS1NCpNlftX6u3S+Z91B5BsQKBgHbe\nH5bpcVzmX9z7l7Ezqy4xmRl6poRlO6I56zCdAXxREclNc2GEPs5q394brq/azQQ7\nsZYyQy+dKMJeEHYY3hqwsuf1HzTpQdxmBxJsWIhaWXxVXwPO2T69sPId74q/Yk7m\n7ENUVY4j6BMb3mVJuPJdEbR0Ed4iBL6lkzXZ9tKnAoGBALDKCzG5J+c8DJUzhVcD\nlvk3uy8WabF0noJn4KEtpyZMmVNfNXu/90NcuWbTg0iWC115Bruhvaj2I2aA3iiB\nLp+mRN9TzHKb72n3dQ31TyrCOMdE2EcOtmiMCfJRS7QUm2I6LIXVn5jbyoX55YAW\nanb42eZNYkpS4C7C9PhLRdP/\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-msqru@inductioniiitd2020.iam.gserviceaccount.com",
    "client_id": "117300372020258712504",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-msqru%40inductioniiitd2020.iam.gserviceaccount.com"
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
        res.json({'Success': false, 'Message': 'Not a valid application ID or already registered user'})
    }
})

app.post('/createUser', (req, res) => {
    let verification = true
    let dbPoint = defaultDB.ref(`/StudentList`)
    dbPoint.child(req.body.applicationid).once('value', function(snap) {
        if (snap.val() == null || snap.val() == undefined) {
            res.json({success: false, result: {}, message: 'User Roll Number doesn\'t exist'})
        } else{
            var userData = snap.val()
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
                        'branch': userData['Branch'],
                        'allocation': userData['Final Allocation'],
                        "isVerified": false,
                        "groupCode": "Green",
                        "instaHandle": "",
                        "description": "",
                    }
                    var updates = {};
                    updates['/users/' + userRecord.uid] = postData;
                    defaultDB.ref().update(updates)
                    res.send({'Success': true, 'Message': 'User Created Successfully!'})
                })
                .catch(function(error) {
                    console.log('Error creating new user:', error);
                    res.send({'Success': false, 'Message': 'User Creation Failed'})

                });
            } else {
                res.json({success: false, result: {}, message: 'Email and Username don\'t match'})
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