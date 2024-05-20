import React from 'react';
import './activetask.css';
import UserCard from './userCard/Usercard';
import Task from './task/Task';

function Activetask(param) {
  return (
    <div className='activetask component'>
      <UserCard/>
      <Task/>
    </div>
  )
}

export default Activetask