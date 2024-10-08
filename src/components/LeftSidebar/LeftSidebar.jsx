import React, { useContext, useState } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../config/firebase.js";
import { AppContext } from "../../context/AppContext.jsx";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData, chatData, chatUser, setChatUser, messagesId, setMessagesId } = useContext(AppContext);

  {/* to search user profile */}
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  {/* function to manage chat between users */}
  const addChat = async() => {
    const messagesRef = collection(db,"messages")
    const chatsRef = collection(db,"chats")
    try{
        const newMessageRef = doc(messagesRef);

        await setDoc(newMessageRef,{
            createAt:serverTimestamp(),
            messages: []
        })

        await updateDoc(doc(chatsRef,user.id),{
            chatsData: arrayUnion({
                messageId: newMessageRef.id,
                lastMessage: "",
                rId: userData.id,
                updatedAt: Date.now(),
                messageSeen: true
            })
        })

        await updateDoc(doc(chatsRef,userData.id),{
            chatsData: arrayUnion({
                messageId: newMessageRef.id,
                lastMessage: "",
                rId: user.id,
                updatedAt: Date.now(),
                messageSeen: true
            })
        })
    }catch(e){
        toast.error(e.message)
        console.error(e)
    }
  }

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true)
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          chatData.map((user) => {
            if(user.rId === querySnap.docs[0].data().id){
              userExist= true;
            }
          })
          if(!userExist){
            setUser(querySnap.docs[0].data());
          }  
        }else{
            setUser(null)
        }
      }else{
        setShowSearch(false)
      }
    } catch (e) {}
  };

  const setChat = async (item) => {

    try{
      setMessagesId(item.messageId);
    setChatUser(item)
    const userChatsRef = doc(db,'chats',userData.id);
    const userChatsSnapshot = await getDoc(userChatsRef);
    const userChatsData = userChatsSnapshot.data();
    const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId);
    userChatsData.chatsData[chatIndex].messageSeen = true;
    await updateDoc(userChatsRef,{
      chatsData:userChatsData.chatsData
    })
    }catch(error){
      toast.error(error.message)
    }
    
  }

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="logo" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            type="text"
            onChange={inputHandler}
            placeholder="Search here.."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ?
            <div onClick={addChat} className="friends add-user">
                <img src={user.avatar} alt="" />
                <p>{user.name}</p>
            </div>
                : 
                  chatData.map((item, index) => (
                  <div onClick={() => setChat(item)} key={index} className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "border"}`}>
                    <img src={item.userData.avatar} alt="" />
                    <div>
                      <p>{item.userData.name}</p>
                      <span>{item.lastMessage}</span>
                    </div>
                  </div>
                ))
        }
        
      </div>
    </div>
  );
};

export default LeftSidebar;
