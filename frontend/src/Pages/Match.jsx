import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Match() {

    const [MatchedData, setMatchedData] = useState([]);

    useEffect(() => {
        
        axios.get('http://localhost:3000/match',{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res=>{
            setMatchedData(res.data)
        })

    }, []);

  return (
    <div>
        {console.log(MatchedData)}
        {
            MatchedData.length && MatchedData.map(element => {
                
                return (
                    <>
                        <h1>{element}</h1>
                        <br/>
                    </>
                )
            })
        }
    </div>
  )
}

export default Match