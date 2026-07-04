import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageMaxWidth = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div
      className={`
        relative 
        mx-auto 
        w-full 
        max-w-500    
        px-6               
        md:px-12           
        lg:px-20          
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default PageMaxWidth;
