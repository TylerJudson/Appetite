import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
// @ts-ignore - getReactNativePersistence exists but may not be in type definitions
import { initializeAuth, getReactNativePersistence } from "firebase/auth"

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyCYwdhrZg3W6efpXCsWUg2AljKWWKOn23w',
    authDomain: 'appetite-0.firebaseapp.com',
    databaseURL: 'https://appetite-0-default-rtdb.firebaseio.com',
    projectId: 'appetite-0',
    storageBucket: 'appetite-0.appspot.com',
    messagingSenderId: '942705396476',
    appId: '1:942705396476:web:1a18f990090f5341dd2579',
    measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage)});

