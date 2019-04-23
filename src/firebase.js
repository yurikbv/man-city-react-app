import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: "AIzaSyAi_YoTgY17P-zs5AHVkiyTKCi7GnzjbI8",
  authDomain: "man-city-eb57f.firebaseapp.com",
  databaseURL: "https://man-city-eb57f.firebaseio.com",
  projectId: "man-city-eb57f",
  storageBucket: "man-city-eb57f.appspot.com",
  messagingSenderId: "294613589309"
};
firebase.initializeApp(config);

const firebaseDB = firebase.database();
const firebaseMatches = firebaseDB.ref('matches');

export {
  firebase,
  firebaseMatches
}