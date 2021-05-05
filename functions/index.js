const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const Filter = require('bad-words');

const admin = require('firebase-admin');
const { Collections } = require("@material-ui/icons");
admin.initializeApp();
const db = admin.firestore();

exports.detectEvilUsers = functions.firestore.document('messages/{msgId}').onCreate(async(doc, ctx)=> {
    const filter = new filter();
    const {text,uid} = doc.data();

    if (filter.isProfane(text)){
        const cleaned = filter.clean(text);
        await doc.ref.update({text  `BANNED ${cleaned}`});
        
        collection('banned').doc(uid.set({}));
    }
});