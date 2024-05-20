import React from 'react';
import "./navbar.css";
import HomeIcon from '@mui/icons-material/Home';
import { useContext ,useState} from "react";
import {DarkModeContext} from "../../context/context";
import {EventsContext} from "../../context/events";

function Navbar(param) {
  const [darkMode,setDarkMode] = useContext(DarkModeContext); 
  const [events,setEvents] = useContext(EventsContext);
  const { selectedNavItem , setSelectedNavItem  } = param;


  const handleItemClick = (item) => {
    setSelectedNavItem(item);
  };


  return (
    <ul className="navbar">
      <div className="top">
      <li
          className={selectedNavItem === 'default' ? 'active' : ''}
          onClick={() => handleItemClick('default')}
        >
                  <div className="detailedNav">
         <div> 
         <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M18.29 5.00048L12.73 0.890481C11.1036 -0.296827 8.89636 -0.296827 7.27 0.890481L1.72 5.00048C0.645442 5.77462 0.00610336 7.01612 0 8.34048V15.7705C0.0600245 18.1637 2.04665 20.0564 4.44 20.0005H15.56C17.9534 20.0564 19.94 18.1637 20 15.7705V8.33048C19.9914 7.01185 19.3567 5.77576 18.29 5.00048ZM18.5 15.7705C18.4404 17.3354 17.1251 18.5568 15.56 18.5005H4.44C2.87698 18.5512 1.56502 17.333 1.5 15.7705V8.34048C1.50534 7.4904 1.91817 6.69448 2.61 6.20048L8.16 2.10048C9.25609 1.30006 10.7439 1.30006 11.84 2.10048L17.39 6.21048C18.0812 6.6959 18.4948 7.48583 18.5 8.33048V15.7705ZM5.5 13.7505H14.5C14.9142 13.7505 15.25 14.0863 15.25 14.5005C15.25 14.9147 14.9142 15.2505 14.5 15.2505H5.5C5.08579 15.2505 4.75 14.9147 4.75 14.5005C4.75 14.0863 5.08579 13.7505 5.5 13.7505Z" />
</svg>
          </div>
          Home
          </div>
          <div className="quickNav">
            <div>
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M18.29 5.00048L12.73 0.890481C11.1036 -0.296827 8.89636 -0.296827 7.27 0.890481L1.72 5.00048C0.645442 5.77462 0.00610336 7.01612 0 8.34048V15.7705C0.0600245 18.1637 2.04665 20.0564 4.44 20.0005H15.56C17.9534 20.0564 19.94 18.1637 20 15.7705V8.33048C19.9914 7.01185 19.3567 5.77576 18.29 5.00048ZM18.5 15.7705C18.4404 17.3354 17.1251 18.5568 15.56 18.5005H4.44C2.87698 18.5512 1.56502 17.333 1.5 15.7705V8.34048C1.50534 7.4904 1.91817 6.69448 2.61 6.20048L8.16 2.10048C9.25609 1.30006 10.7439 1.30006 11.84 2.10048L17.39 6.21048C18.0812 6.6959 18.4948 7.48583 18.5 8.33048V15.7705ZM5.5 13.7505H14.5C14.9142 13.7505 15.25 14.0863 15.25 14.5005C15.25 14.9147 14.9142 15.2505 14.5 15.2505H5.5C5.08579 15.2505 4.75 14.9147 4.75 14.5005C4.75 14.0863 5.08579 13.7505 5.5 13.7505Z"/>
      </svg>
            </div>
          </div>

        </li>
        <li
          className={selectedNavItem === 'calendar' ? 'active' : ''}
          onClick={() => handleItemClick('calendar')}
        >
        <div className="detailedNav">
        <svg viewBox="0 0 20 22"  xmlns="http://www.w3.org/2000/svg">
<path d="M14.5 7.16H5.5C5.08579 7.16 4.75 7.49579 4.75 7.91C4.75 8.32421 5.08579 8.66 5.5 8.66H14.5C14.9142 8.66 15.25 8.32421 15.25 7.91C15.25 7.49579 14.9142 7.16 14.5 7.16Z" fill="black"/>
<path fillRule="evenodd" clipRule="evenodd" d="M14.89 2.57H15C17.7614 2.57 20 4.80858 20 7.57V16.57C20 19.3314 17.7614 21.57 15 21.57H5C3.67392 21.57 2.40215 21.0432 1.46447 20.1055C0.526784 19.1679 0 17.8961 0 16.57V7.57C0 4.80858 2.23858 2.57 5 2.57H5.09V0.75C5.09 0.335786 5.42579 0 5.84 0C6.25421 0 6.59 0.335786 6.59 0.75V2.57H13.39V0.75C13.39 0.335786 13.7258 0 14.14 0C14.5542 0 14.89 0.335786 14.89 0.75V2.57ZM15 20.07C16.933 20.07 18.5 18.503 18.5 16.57V7.57C18.5 5.637 16.933 4.07 15 4.07H5C3.067 4.07 1.5 5.637 1.5 7.57V16.57C1.5 18.503 3.067 20.07 5 20.07H15Z"/>
</svg>

          Calendar
          </div>
          <div className="quickNav">
          <svg viewBox="0 0 20 22"  xmlns="http://www.w3.org/2000/svg">
<path d="M14.5 7.16H5.5C5.08579 7.16 4.75 7.49579 4.75 7.91C4.75 8.32421 5.08579 8.66 5.5 8.66H14.5C14.9142 8.66 15.25 8.32421 15.25 7.91C15.25 7.49579 14.9142 7.16 14.5 7.16Z"/>
<path fillRule="evenodd" clipRule="evenodd" d="M14.89 2.57H15C17.7614 2.57 20 4.80858 20 7.57V16.57C20 19.3314 17.7614 21.57 15 21.57H5C3.67392 21.57 2.40215 21.0432 1.46447 20.1055C0.526784 19.1679 0 17.8961 0 16.57V7.57C0 4.80858 2.23858 2.57 5 2.57H5.09V0.75C5.09 0.335786 5.42579 0 5.84 0C6.25421 0 6.59 0.335786 6.59 0.75V2.57H13.39V0.75C13.39 0.335786 13.7258 0 14.14 0C14.5542 0 14.89 0.335786 14.89 0.75V2.57ZM15 20.07C16.933 20.07 18.5 18.503 18.5 16.57V7.57C18.5 5.637 16.933 4.07 15 4.07H5C3.067 4.07 1.5 5.637 1.5 7.57V16.57C1.5 18.503 3.067 20.07 5 20.07H15Z"/>
</svg>
          </div>

        </li>
        <li
          className={selectedNavItem === 'taskTable' ? 'active' : ''}
          onClick={() => handleItemClick('taskTable')}
        >        <div className="detailedNav">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.00008 6V9H5.00008V6H8.00008ZM3.00008 4V11H10.0001V4H3.00008ZM13.0001 4H21.0001V6H13.0001V4ZM13.0001 11H21.0001V13H13.0001V11ZM13.0001 18H21.0001V20H13.0001V18ZM10.7072 16.2071L9.29297 14.7929L6.00008 18.0858L4.20718 16.2929L2.79297 17.7071L6.00008 20.9142L10.7072 16.2071Z" fill="currentColor"></path></svg>
          Tasks
          </div>
          <div className="quickNav">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.00008 6V9H5.00008V6H8.00008ZM3.00008 4V11H10.0001V4H3.00008ZM13.0001 4H21.0001V6H13.0001V4ZM13.0001 11H21.0001V13H13.0001V11ZM13.0001 18H21.0001V20H13.0001V18ZM10.7072 16.2071L9.29297 14.7929L6.00008 18.0858L4.20718 16.2929L2.79297 17.7071L6.00008 20.9142L10.7072 16.2071Z" fill="currentColor"></path></svg>
          </div>

        </li>
    </div>
    <div className="hr"></div>
    <div className="bottom">
                <div className="colorOption" onClick={() => setDarkMode(false)}></div>
                <div className="colorOption" onClick={() =>  setDarkMode(true)}></div>
    </div>
    </ul>
  )
}

export default Navbar;