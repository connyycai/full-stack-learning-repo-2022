import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDp3Ac8GMJJD_yTjbAfTAMuuSf_PSQptXk",
    authDomain: "todo-app-f0c03.firebaseapp.com",
    projectId: "todo-app-f0c03",
    storageBucket: "todo-app-f0c03.appspot.com",
    messagingSenderId: "979711544617",
    appId: "1:979711544617:web:62ed96f25849953de3bb38"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;