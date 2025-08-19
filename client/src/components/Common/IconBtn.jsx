import React from 'react';
 
const IconBtn = ({ text, onclick, children, disabled, outline = false, customClasses, type = "button" }) => {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      type={type}
      className={`flex items-center gap-x-2 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200
        ${outline
          ? "border border-yellow-500 bg-transparent text-yellow-500 hover:bg-yellow-500 hover:text-black"
          : "bg-yellow-500 text-black hover:bg-yellow-400"}
        ${customClasses}`}
    >
      {text}
      {children && <span>{children}</span>}
     
    </button>
  );
};

export default IconBtn;
