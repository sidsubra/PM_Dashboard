import React, { useContext } from 'react';
import './usercard.css';
import { UserContext } from '../../../context/user';

function Usercard() {
  const [user, setUser] = useContext(UserContext);

  return (
    <div className='usercard'>
      <img
        src={`https://contacts.zoho.com/file?ID=${user.zuid}&exp=6000&t=user&fs=thumb`}
        alt={`Profile of ${user.name}`}
      />
      <div className='text'>
        <p className='name'>{user.name}</p>
        <p className='zuid'>ZUID: {user.zuid}</p>
      </div>
    </div>
  );
}

export default Usercard;
