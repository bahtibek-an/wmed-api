import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWtbklrHD6LnaDDYJnxM_Sr1221BuY9Rw",
  authDomain: "instagram-b4a79.firebaseapp.com",
  projectId: "instagram-b4a79",
  storageBucket: "instagram-b4a79.appspot.com",
  messagingSenderId: "734905151307",
  appId: "1:734905151307:web:af1f90083b9bed5bf9c2ce"
};

export const app = initializeApp(firebaseConfig);
export const firebaseStorage = getStorage(app);