 import React from 'react'
import { HighlightText } from '../HomePage/HighlightText'
 
 const Quate = () => {
   return (
     <div className="text-center text-2xl font-semibold my-10 px-6 text-richblack-100 leading-relaxed">
        We are passionate about revolutionarise the way we learn. Our innovative platform
        <HighlightText text={"combines technology"}/>
        <span className="text-yellow-400 font-bold">
           {" "}
           expertise 
        </span>
        , and community to create an
        <span className="text-yellow-400 font-bold">
            {" "}
            unparalleled educational experience
        </span>
     </div>
   )
 }
 
 export default Quate
