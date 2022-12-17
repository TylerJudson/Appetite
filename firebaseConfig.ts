import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyCYwdhrZg3W6efpXCsWUg2AljKWWKOn23w',
    authDomain: 'appetite-0.firebaseapp.com',
    databaseURL: 'https://project-id.firebaseio.com',
    projectId: 'appetite-0',
    storageBucket: 'appetite-0.appspot.com',
    messagingSenderId: '942705396476',
    appId: '1:942705396476:web:1a18f990090f5341dd2579',
    measurementId: 'G-measurement-id', // TODO: no value given when entering all the data
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase