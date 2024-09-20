import React, { useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../config/firebase.js'
import { toast } from 'react-toastify'

const ProfileUpdate = () => {
  const [image,setImage] = useState(false)
  const [name,setName] = useState('')
  const [bio,setBio] = useState('')
  const [uid,setUid] = useState('')
  const [prevImage,setPrevImage] = useState('')
  const navigate = useNavigate()

  const profileUpdate = async(e) => {
    e.preventDefault();
    try{
      if(!prevImage && !image){
        toast.error("Upload profile picture")
      }
    }catch(e){

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
        <img className='profile-pic' src={image ? URL.createObjectURL(image) : assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate