// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const apikey = import.meta.env.VITE_GOOGLE_API_KEY
// console.log("apikey", import.meta.env);

const firebaseConfig = {
    apiKey:apikey,
    authDomain: "mern-blog-1b6fe.firebaseapp.com",
    projectId: "mern-blog-1b6fe",
    storageBucket: "mern-blog-1b6fe.appspot.com",
    messagingSenderId: "911812626115",
    appId: "1:911812626115:web:23b3e0ae0ea732e8dac476",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
