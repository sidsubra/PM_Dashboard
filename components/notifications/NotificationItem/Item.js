import React from 'react'
import './item.css';


function Item(param) {
  const {icon,Title,Time} = param;
  return (
    <div className='item'>
        <div className="icon">{icon}</div>
        <div className="description">
          <p className='notificationTitle'>{Title}</p>
          <p className='notificationTime'>{Time}</p>
        </div>
    </div>
  )
}

export default Item;