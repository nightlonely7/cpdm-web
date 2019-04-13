import firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/database';

var config = {
    apiKey: "AIzaSyCRZo5TR0UxVsuiUpkgAJm7Batq_S3SQHk",
    authDomain: "cpdm-notification.firebaseapp.com",
    databaseURL: "https://cpdm-notification.firebaseio.com",
    projectId: "cpdm-notification",
    storageBucket: "cpdm-notification.appspot.com",
    messagingSenderId: "192613208670"
};
firebase.initializeApp(config);
const database = firebase.database();
const messaging = firebase.messaging();
messaging.usePublicVapidKey('BCasv1NftCLiF1rXwWD13MQ_yeeiozIQ3r7NMt0HJnumsGpiZTLbIoVg8-b5GA5qcA6Wx7j9Y1evudFdZi100sY');
messaging.onMessage(function (payload) {
    alert(payload.data.title + payload.data.detail);
});

export const mes = messaging;
export const db = database;