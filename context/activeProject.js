import React, { createContext, useState } from "react";

export const ActiveProjectContext = createContext();

export const ActiveProjectProvider = ({ children }) => {
    const [activePrj, setactivePrj] = useState(null);

    return ( 
        <ActiveProjectContext.Provider value={[activePrj, setactivePrj]}>
            {children}
        </ActiveProjectContext.Provider>
    );
};
