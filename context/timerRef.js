import React, { createContext, useRef, useState, useContext } from "react";
import { ActiveProjectContext } from "../context/activeProject";

export const TimerRefContext = createContext();

export const TimerRefProvider = ({ children }) => {
    const [activePrj, setActivePrj] = useContext(ActiveProjectContext);
    const timerIdRef = useRef(0);
    const [count, setCount] = useState(activePrj?.lapsedSeconds || 0);

    return ( 
        <TimerRefContext.Provider value={{ timerIdRef, count, setCount }}>
            {children}
        </TimerRefContext.Provider>
    );
};
