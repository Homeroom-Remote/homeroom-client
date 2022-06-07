
import { render } from '@testing-library/react';
import { useEffect, useState } from 'react';
import './LectureGrade.css'
export default function LectureGrade({grade, tips}) {
    const [g, setG] = useState(grade)
    useEffect(() => {
        setG(grade)
    })

    
    useEffect(() => {
        document?.querySelector('.svg')?.style?.setProperty('--g', g);
    }, [g]);


return (
    <div className="h-full py-8 px-6 text-gray-600 rounded-xl border-2 border-dark-500 dark:bg-dark-800 bg-lt-50">    
    <div className="container flex items-center justify-center content-center flex-wrap h-full relative">
    <div className="bar inline-block shadow-lg shadow-black overflow-hidden rounded-full w-[200px] h-[200px]">
        <svg className='svg h-full w-full' strokeDasharray={'630px'}>
        <circle cx='50%' cy='50%' r="50%" className='fill-transparent stroke-primary-400 stroke-[30px] text-right' key={g}/>
        </svg>
    </div>
    <div class="absolute">
        <p class="text-md font-bold text-primary-400">Your grade is</p>
        <p class="text-4xl font-bold justify-center text-center text-primary-400">{g}</p>
    </div>
    </div>
    <div>{tips.map((tip, index) => (<><p>{tip}</p><br /></>))}</div>
    </div>
  );
}