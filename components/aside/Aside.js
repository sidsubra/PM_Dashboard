import React from 'react';
import './aside.css';
import Gauge from "../gauge/Gauge";
import Activetask from "../activeTask/Activetask";


function aside() {
  return (
    <div className="aside component">
          <Activetask />
          <Gauge/>
    </div>
  )
}

export default aside;