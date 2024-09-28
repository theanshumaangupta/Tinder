import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link} from 'react-router-dom'
import axios from 'axios'
import Match from './Match';



function Home() {
    // Setting Index Of Data
    const [Index, setIndex] = useState(0);
    // sender or logged in user
    const [ Sender, setSender] = useState({});
    // checking if someone is loggedin or not true/false
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token"));
    // Collecting User Data
    const [Data, setData] = useState([]);
    function IndexIncrement(like) {
        SettingSwipe(like)
        let len = Data.length
        setIndex(a =>{
            if (a+1 == len){
                return 0
            }
            else{
                return a+1
            }
        })
    }
    async function SettingSwipe(like) {

        const newSwipe = {
            toUserId: Data[Index].id,    // ID of the user being swiped on
            like: like             // true for "like" (right swipe)
        }
        axios.post('http://localhost:3000/swipe', newSwipe, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res=>{
            console.log(res.data);
        })

    }

    // Fetching Basic Account data from server after login  
    useEffect(() => {
      if (isLoggedIn){
          axios.get("http://localhost:3000/", {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
              }
          }).then((res) => {
              setSender(res.data)
          })

          axios.get("http://localhost:3000/data", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            setData(res.data)
        })
      }

    }, []);


    if (!isLoggedIn){
      
      return (
      <>
        <div>Home</div>
        <Link to="/login">
          <button>
            Login
          </button>
        </Link>
        <Link to="/register">
          <button>
            Register
          </button>
        </Link>
      </>
      )
    }
    else{
      return(
        
        <>

            <div className="flex justify-center items-center h-[50rem] bg-gray-100">
            <button onClick={() => IndexIncrement(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                Left
            </button>
            <div className="w-[30rem] h-[30rem] bg-blue-500">
                {Data.length ? Data[Index].name : "No Users Found"}
            </div>
            <button onClick={() => IndexIncrement(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
                Right
            </button>
            </div>
        </>
      )
    }
}

export default Home