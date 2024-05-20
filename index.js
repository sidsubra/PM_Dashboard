import React, { useEffect} from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { DarkModeProvider } from "./context/context";
import { ActiveProjectProvider } from "./context/activeProject";
import { TimerProvider } from "./context/timer";
import { UserProvider } from "./context/user";
import {EventsProvider} from "./context/events";
import {TimerRefProvider} from "./context/timerRef";
import {ProductivityProvider} from "./context/productivity";
import {TasksProvider} from "./context/tasks";

ReactDOM.createRoot(document.querySelector("#root")).render(
  <DarkModeProvider>
    <ActiveProjectProvider>
      <TimerProvider>
        <TimerRefProvider>
          <UserProvider>
            <EventsProvider>
              <ProductivityProvider>
                <TasksProvider>
                    <App />
                </TasksProvider>
              </ProductivityProvider>
           </EventsProvider>
          </UserProvider>
          </TimerRefProvider>
      </TimerProvider>
    </ActiveProjectProvider>
  </DarkModeProvider>
);
