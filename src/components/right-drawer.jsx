import React from "react";

export const RightDrawer = ({children, isOpen, setIsOpen}) => {

    if (!isOpen) return null;

    return <div className="fixed w-screen h-screen bg-black z-50 left-0 top-0 bg-black/90 flex justify-center items-center"
                onClick={() => setIsOpen(undefined)}>
        <div className="bg-black w-[320px] h-[320px] z-50 p-[10px]">
            {children}
        </div>
    </div>
}