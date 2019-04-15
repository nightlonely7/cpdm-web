importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
const config = {
    apiKey: "AIzaSyCRZo5TR0UxVsuiUpkgAJm7Batq_S3SQHk",
    authDomain: "cpdm-notification.firebaseapp.com",
    databaseURL: "https://cpdm-notification.firebaseio.com",
    projectId: "cpdm-notification",
    storageBucket: "cpdm-notification.appspot.com",
    messagingSenderId: "192613208670"
};
firebase.initializeApp(config);
const messaging  = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
});