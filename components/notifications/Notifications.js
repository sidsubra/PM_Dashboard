import React from 'react'
import './notifications.css';
import Item from './NotificationItem/Item';
import AddIcCallOutlinedIcon from '@mui/icons-material/AddIcCallOutlined';
import PhoneDisabledOutlinedIcon from '@mui/icons-material/PhoneDisabledOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

function Notifications() {
  return (
    <div className='notifications component'>
        <h1 style={{marginBottom:'0.8rem',fontWeight:400,fontSize:"1.8rem"}}>Productivity</h1>
        <div className="itemContainer">
          <img src="https://thumb.ac-illust.com/b7/b7bb34a55db5bbbc694e91bfc69e39a5_t.jpeg"></img>
           {/* <Item icon={<AddIcCallOutlinedIcon />} Title="Primal Foundation has booked a call" Time="Just now"/>
           <Item icon={<PhoneDisabledOutlinedIcon />} Title="Sama has cancelled a call" Time="59 minutes ago"/>
           <Item icon={<EditCalendarOutlinedIcon />} Title="Parvathy has applied for a casual leave" Time="12 hours ago"/>
           <Item icon={<AccessAlarmOutlinedIcon />} Title="SLA will be breached in another 1 hour" Time="Today, 11:59 AM"/>
           <Item icon={<CalendarMonthOutlinedIcon />} Title="Genpact call at 5:00 today" Time="Today, 11:59 AM"/> */}
        </div>
    </div>
  )
}

export default Notifications