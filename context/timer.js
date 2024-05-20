import React, { createContext, useState,useContext } from "react";
import { ActiveProjectContext } from "../context/activeProject";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [activePrj,setActivePrj] = useContext(ActiveProjectContext);
    const [timer, setTimer] = useState(0);
    
    return ( 
        <TimerContext.Provider value={[timer, setTimer]}>
            {children}
        </TimerContext.Provider>
    );
};
