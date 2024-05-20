import React from 'react';
import './card.css';
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';

function Card({ data, filter }) {
  const { label, type, allTimeValue, thisQuarterValue, thisMonthValue } = data;
  let icon, value;

  switch (type) {
    case 'sla':
      icon = <AccessAlarmOutlinedIcon />;
      break;
    case 'revenue':
      icon = <PaidOutlinedIcon />;
      break;
    case 'toi':
      icon = <AlarmOnIcon />;
      break;
    case 'tol':
      icon = <RocketLaunchOutlinedIcon />;
      break;
  }

  switch (filter) {
    case 'all':
      value = allTimeValue;
      break;
    case 'quarter':
      value = thisQuarterValue;
      break;
    case 'month':
      value = thisMonthValue;
      break;
  }

  return (
    <div className='card'>
      <div className="left">
        <div className="title">{label}</div>
        <div className="data">{type === "revenue" ? `$ ${value}` : value}</div>
      </div>
      <div className="right">
        <div className="iconContainer">{icon}</div>
      </div>
    </div>
  );
}

export default Card;
