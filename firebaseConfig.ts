import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native"

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyCYwdhrZg3W6efpXCsWUg2AljKWWKOn23w',
    authDomain: 'appetite-0.firebaseapp.com',
    databaseURL: 'https://appetite-0-default-rtdb.firebaseio.com',
    projectId: 'appetite-0',
    storageBucket: 'appetite-0.appspot.com',
    messagingSenderId: '942705396476',
    appId: '1:942705396476:web:1a18f990090f5341dd2579',
    measurementId: 'G-measurement-id', // TODO: no value given when entering all the data
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage)});

