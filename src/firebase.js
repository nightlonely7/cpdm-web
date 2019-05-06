import firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/database';
import router from '@/router.js';
import axios from 'axios';
import Vue from 'vue';

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
    // var message = payload.data.title + "\n" + payload.data.body + "\n" + "Tới trang nội dung liên quan?";
    Vue.notify({
        group: 'foo',
        title: payload.data.title,
        text: payload.data.body,
        data: {
            id: payload.data.id,
            url : payload.data.url,
        }
    });
    // if (confirm(message)) {
    //     router.push(payload.data.url);
    // }
});

export function pushNotif(title, detail, url, user) {
        var keys = [];
        axios.post('http://localhost:8080/notifications', {
                title: title,
                detail: detail,
                url: url,
                user: user
            }
        ).then((response) => {
            db.ref('users/' + user.id).once('value').then(function (snapshot) {
                if(snapshot.val() != null){
                    keys = snapshot.val();
                }
                if(user.email){
                    keys.push('/topics/' + user.email.split('@')[0]);
                }
                console.log(keys);
                axios.post('http://localhost:8080/notifications/push',
                    {
                        keys: keys,
                        title: title,
                        detail: detail,
                        url: url,
                        id: response.data.id
                    }
                ).then(response => {
                    console.log(response.status);
                }).catch(error => {
                    if (error.response) {
                        console.log(error.response.data);
                    } else {
                        console.log(error.response);
                    }
                });
            }).catch(error => {
                console.log(error.response);
            });
        }).catch(error => {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log(error.response);
            }
        });
}

export const mes = messaging;
export const db = database;