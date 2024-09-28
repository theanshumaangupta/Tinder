import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'


function Register() {
  const [Name, setName] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  function sendReq(){
    let a = {
      data : {
        name : Name,
        username : Username,
        password : Password,
      }
    }   
    axios.post('http://localhost:3000/register',a).then(res=>{
      console.log(res.data);
        if(res.data.token){
            localStorage.setItem("token", res.data.token)  
            console.log("done"); 
            // navigate("/")

        }
    })
    setPassword("") 
    setUsername("")
    setName("")
  }
  return (
    <>
      <input type="text" placeholder='name' value={Name}  onChange={(e)=>{setName(e.target.value)}}/>
      <input type="text" placeholder='username' value={Username} onChange={(e)=>{setUsername(e.target.value)}} /> 
      <input type="text" placeholder='password'value={Password}  onChange={(e)=>{setPassword(e.target.value)}}/>

      <Link>
        <button onClick={()=>{sendReq()}}>Submit</button>
      </Link>
    </>
  )
}

export default Register