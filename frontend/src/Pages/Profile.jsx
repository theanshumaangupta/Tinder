import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link} from 'react-router-dom'
import axios from 'axios'

function Profile() {
    const [Sender, setSender] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token"));

    useEffect(() => {
        if (isLoggedIn){
            axios.get("http://localhost:3000/profile", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                setSender(res.data)
            })
        }
    
      }, []);
  return (
    <>
        <div>Bio: {Sender && Sender.bio}</div>
        {console.log(Sender)}
    </>
  )
}

export default Profile