import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../config/firebase.js'
import { toast } from 'react-toastify'
import upload from '../../lib/upload.js'
import { AppContext } from '../../context/AppContext.jsx'

const ProfileUpdate = () => {
  const [image,setImage] = useState(false)
  const [name,setName] = useState('')
  const [bio,setBio] = useState('')
  const [uid,setUid] = useState('')
  const [prevImage,setPrevImage] = useState('')
  const navigate = useNavigate()
  const {setUserData} = useContext(AppContext)

  const profileUpdate = async(e) => {
    e.preventDefault();
    try{
      if(!prevImage && !image){
        toast.error("Upload profile picture")
      }
      const docRef = doc(db,'users',uid)
      if(image){
        const imgUrl = await upload(image);
        setPrevImage(imgUrl)
        await updateDoc(docRef,{
          avatar:imgUrl,
          bio:bio,
          name:name
        })
      }else{
        await updateDoc(docRef,{
          bio:bio,
          name:name
        })
      }
      const snap = await getDoc(docRef)
      setUserData(snap.data())
      navigate('/chat')
    }catch(e){
      console.error(e)
      toast.error(e.message)
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth,async(user) => {
      if(user){
        setUid(user.uid)
        const docRef = doc(db,'users',user.uid);
        const docSnap = await getDoc(docRef)

        if(docSnap.data().name){
          setName(docSnap.data().name)
        }

        if(docSnap.data().bio){
          setBio(docSnap.data().bio)
        }

        
        if(docSnap.data().avatar){
          setPrevImage(docSnap.data().avatar)
        }
      }else{
        navigate('/')
      }
    })
  },[])

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
            Upload profile image
          </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='your name' required />
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder='write profile bio' required></textarea>
          <button type='submit'>Save</button>
        </form>
        <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate