
import { useEffect, useState } from 'react';
import './LectureGrade.css'
export default function GraeCircle({ grade }) {
    const [g, setG] = useState(grade)
    useEffect(() => {
        setG(grade)
    })

    
    useEffect(() => {
        document?.querySelector('.svg')?.style?.setProperty('--g', g);
    }, [g]);


return (
    <div className="container flex items-center justify-center content-center flex-wrap h-full relative">
    <div className="bar inline-block shadow-lg shadow-black overflow-hidden rounded-full w-[200px] h-[200px]">
        <svg className='svg h-full w-full' strokeDasharray={'630px'}>
        <circle cx='50%' cy='50%' r="50%" className='fill-transparent stroke-primary-400 stroke-[30px] text-right' key={g}/>
        </svg>
    </div>
    <div className="absolute">
        <p className="text-md font-bold text-primary-400">Your grade is</p>
        <p className="text-4xl font-bold justify-center text-center text-primary-400">{g}</p>
    </div>
    </div>
  );
}
