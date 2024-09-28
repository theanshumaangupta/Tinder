import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'



function Navbar() {
  const navigate = useNavigate()  
  function logout() {
    localStorage.clear()
    navigate("/")
    window.location.reload()
  }

  // sender or logged in user
  const [ Sender, setSender] = useState({});
  // checking if someone is loggedin or not true/false
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token"));
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
    }

  }, []);

  if (isLoggedIn){
    
    return (
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Left Side */}
          <div className="text-white text-xl">
            Hello {Sender && Sender.name}
          </div>
  
          {/* Right Side */}
          <div className="flex space-x-4">
            <Link to="/profile">
              <button className="bg-blue-500 text-white px-3 py-2 rounded-md">
                Profile
              </button>
            </Link>
            <Link to="/match">
              <button className="bg-blue-500 text-white px-3 py-2 rounded-md">
                Match
              </button>
            </Link>
            <button className="bg-red-500 text-white px-3 py-2 rounded-md" onClick={()=>{logout()}}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
