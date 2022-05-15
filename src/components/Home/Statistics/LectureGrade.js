
import { useEffect, useState } from 'react';
import './LectureGrade.css'
export default function LectureGrade() {
    const [g, setG] = useState(87)
    useEffect(() => {
        document?.querySelector('.svg')?.style?.setProperty('--g', g);
    }, [g]);


return (
    <div className="h-full py-8 px-6 text-gray-600 rounded-xl border border-gray-200 bg-white">
    <div className="container flex items-center justify-center content-center flex-wrap h-full relative">
    <div className="bar inline-block shadow-lg shadow-black overflow-hidden rounded-full w-[200px] h-[200px]">
        <svg className='svg h-full w-full' strokeDasharray={'630px'}>
        <circle cx='50%' cy='50%' r="50%" className='fill-transparent stroke-green-500 stroke-[30px] text-right' />
        </svg>
    </div>
    <div class="absolute">
        <p class="text-md font-bold">Your grade is</p>
        <p class="text-4xl font-bold justify-center text-center  text-green-500">{g}</p>
    </div>
    </div>
    </div>
  );
}