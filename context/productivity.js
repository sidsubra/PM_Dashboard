import React, { createContext, useState } from "react";

export const ProductivityContext = createContext();

export const ProductivityProvider = ({ children }) => {
    const [productivity, setProductivity] = useState(null);

    return ( 
        <ProductivityContext.Provider value={[productivity, setProductivity]}>
            {children}
        </ProductivityContext.Provider>
    );
};
