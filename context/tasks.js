import React, { createContext, useState } from "react";

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState(null);

    return ( 
        <TasksContext.Provider value={[tasks, setTasks]}>
            {children}
        </TasksContext.Provider>
    );
};
