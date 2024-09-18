import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth/cordova";
import { getFirestore, setDoc } from "firebase/firestore/lite";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDGZpeHIw5iluW7Mc-da5sj2EryGNQY0WE",
  authDomain: "chat-app-c278f.firebaseapp.com",
  projectId: "chat-app-c278f",
  storageBucket: "chat-app-c278f.appspot.com",
  messagingSenderId: "101859704923",
  appId: "1:101859704923:web:474b462168602a0f3bff7e"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

const signup = async(username,email,password) => {
    try{
        const res= await createUserWithEmailAndPassword(auth,email,password)
        const user = res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar: "",
            bio: "Hey, there i am using chat app",
            lastSeen:Date.now()
        })
        await(setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        }))
    }catch(e){
        console.error(e)
        toast.error(error.code)
    }
}

export {signup}