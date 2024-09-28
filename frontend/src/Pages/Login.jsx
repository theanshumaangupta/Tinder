import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate()  
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  
  function sendReq(){
    let a = {
      data : {
        username : Username,
        password : Password,
      }
    }   
    axios.post('http://localhost:3000/login',a).then(res=>{
      console.log(res.data);
        if(res.data.token){
            localStorage.setItem("token", res.data.token)  
            navigate("/")
            window.location.reload()

        }
    })
    setPassword("") 
    setUsername("")
  
  }
   
  return (
    <>
      <input type="text" placeholder='username' value={Username} onChange={(e)=>{setUsername(e.target.value)}} /> 
      <input type="text" placeholder='password'value={Password}  onChange={(e)=>{setPassword(e.target.value)}}/>

      <Link>
        <button onClick={()=>{sendReq()}}>Submit</button>
      </Link>
    </>
  )
}

export default Login