import React from "react";
import CTAButton from "./Button";
import { HighlightText } from "./HighlightText";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundGrandient,
  codeColor,
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>
      {/* section =>1 */}
      <div className="w-[50%] flex flex-col gap-8">
        {heading}
        <div className="text-richblack-300 font-bold">{subheading}</div>

        <div className="flex gap-7 mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex gap-2 items-center">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>

      {/* section =>2 */}
      {/* <div className="relative flex h-fit flex-row text-[15px] w-[100%] py-4 lg:w-[500px]">
        
        <div
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 
                w-[300px] h-[300px] rounded-full 
                bg-gradient-to-br from-[#60A5FA] via-[#93C5FD] to-[rgb(82,130,190)]
                blur-[40px] z-[1] opacity-40"
        ></div>

        <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>
        <div
          className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}
        >
          <TypeAnimation
            sequence={[codeblock, 2000, ""]}
            repeat={Infinity}
            cursor={true}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div> */}
      <div className="relative w-full lg:w-[480px] rounded-lg shadow-xl border border-richblack-700 overflow-hidden bg-richblack-900 mt-6 lg:mt-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-lg -z-10"></div>

        {/* Tabs */}
        <div className="flex items-center gap-4 px-4 py-2 bg-richblack-800 border-b border-richblack-700 text-sm">
          <p className="text-white font-semibold">index.js</p>
          <p className="text-richblack-400">App.jsx</p>
          <p className="text-richblack-400">style.css</p>
        </div>

        {/* Code */}
        <div className="flex text-[13px] md:text-[14px] font-mono leading-6">
          <div className="w-8 md:w-10 text-right pr-2 py-3 text-richblack-500 font-bold select-none text-xs md:text-sm">
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i}>{i + 1}</p>
            ))}
          </div>
          <div className="w-full px-3 py-3 overflow-y-auto text-richblack-50">
            <TypeAnimation
              sequence={[codeblock, 2500, ""]}
              repeat={Infinity}
              cursor={true}
              style={{ whiteSpace: "pre-line", display: "block" }}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;

 