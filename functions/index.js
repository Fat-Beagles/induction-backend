const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');

admin.initializeApp();

exports.addUserInfoToDatabase = functions.auth.user().onCreate((user) => {
    const id = user.uid;
    const email = user.email;
    const displayName = user.displayName;
    //const photoURL = user.photoURL;
    const isVerified = false
    const DataToPut = {
        "isVerified": false,
        "groupCode": "Green",
        "instaHandle": "",
        "branch": "",
        "description": "",
        "instaHandle": ""
    }
    return admin.database().ref(`/users/${id}/`).set(DataToPut);
});

exports.searchUser = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    let dbPoint = admin.database().ref('/users/')
    console.log(req.query)
    try {
        const query = req.query.text
        const option = req.query.option
        if (option == "1") {
            var result = await dbPoint.orderByChild('name').startAt(query).endAt(query+"\uf8ff").limitToFirst(10).once("value")
        } else {
            var result = await dbPoint.orderByChild('groupCode').startAt(query).endAt(query+"\uf8ff").limitToFirst(10).once("value")
        }
        
        try {
            res.json({result: `${Object.keys(result.val())}`})
        } catch(err) {
            console.log("Error", err)
            res.json({result: ""})
        }
    } catch(err) {
        console.log("Error", err)
        res.json({result: ""})
    }
    //return "Vasu"
    //const original = req.query.text;
    //// Push the new message into Cloud Firestore using the Firebase Admin SDK.
    //const writeResult = await admin.firestore().collection('messages').add({original: original});
    //// Send back a message that we've succesfully written the message
    //res.json({result: `Message with ID: ${writeResult.id} added.`});
});
  