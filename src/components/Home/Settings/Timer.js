import React from 'react'
import { useState, useEffect } from 'react';

const Timer = () => {
    const [hours, setHours ] =  useState(0);
    const [ minutes, setMinutes ] = useState(0);
    const [seconds, setSeconds ] =  useState(0);
    
    useEffect(()=>{
    let myInterval = setInterval(() => {
            if (seconds === 59) {
                setSeconds(0);
                setMinutes(minutes+1)
            }
            else {
                setSeconds(seconds + 1)
            }
            if(minutes === 59) {
                setMinutes(0)
                setHours(hours+1)
            }
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
          };
    });

    return (
        <div className=''>
            <h1>{hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</h1>
        </div>
    )
}

export default Timer;
