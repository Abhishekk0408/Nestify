// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore" ;

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpSzlA7q6YXH1IBcD7z44eLY1jF36eOFc",
    authDomain: "nestify-b9b96.firebaseapp.com",
    projectId: "nestify-b9b96",
    storageBucket: "nestify-b9b96.appspot.com",
    messagingSenderId: "384189002411",
    appId: "1:384189002411:web:0a0d9813ccc9a79b847dee"
  };

  // Initialize Firebase
initializeApp(firebaseConfig);
export const db=getFirestore()