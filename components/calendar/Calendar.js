import React, { useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";
import ReactQuill from 'react-quill'; // Import the rich text editor
import 'react-quill/dist/quill.snow.css'; // Import the styles
import { EventsContext } from "../../context/events";


const zohoinit = ZOHO.CREATOR.init(),zohoutil = ZOHO.CREATOR.UTIL,zohoapi = ZOHO.CREATOR.API;


moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const ReactBigCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useContext(EventsContext);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState("");
  const [meetingSummary, setMeetingSummary] = useState(""); // State for the rich text editor content

  const formatEventDates = (start, end) => {
    const options = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };

    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
    };

    const formattedStart = new Intl.DateTimeFormat("en-US", options).format(new Date(start));
    const formattedEnd = new Intl.DateTimeFormat("en-US", options).format(new Date(end));

    // Extract the time part and remove spaces
    const startTime = new Intl.DateTimeFormat("en-US", timeOptions).format(new Date(start));
    const endTime = new Intl.DateTimeFormat("en-US", timeOptions).format(new Date(end));

    return `${formattedStart} ${startTime} - ${endTime}`;
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenConfirmation = (action) => {
    setConfirmationAction(action);
    setConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
  };

  const startEvent = async () => {
    setIsDialogOpen(false);
    setConfirmationOpen(false);

    if (selectedEvent.startLink == null) {
      alert('No start link found for the call. Please contact lead.');
    } else {
      window.open(selectedEvent.startLink);
      let formData = {"data" : {"Call_Status":"In-Progress"}};
      let config = {
        reportName : "My_Call_Logs",
	    id: `${selectedEvent.callLogID}`,
	    data : formData
      }
      let resp = await zohoapi.updateRecord(config);
          // Update events state
        if(resp.code == 3000){
            const updatedEvents = events.map(event => {
                if (event.callLogID === selectedEvent.callLogID) {
                  return { ...event, status: "In-Progress" };
                }
                return event;
              });
          
              setEvents(updatedEvents);
        }
        else{
            alert("Error updating (Calendar.js. Line:81). Contact sidharth.sc@zohocorp.com.");
          }


    }
  };

  const endEvent = async () => {

      // Check if meetingSummary has at least 255 characters
    if (meetingSummary.length < 255) {
        alert("Meeting summary must have a minimum of 255 characters.");
    }
    else{
        setIsDialogOpen(false);
        setConfirmationOpen(false);

        let formData = {"data" : {"Call_Status":"Completed","Call_Summary":meetingSummary}};
        let config = {
          reportName : "My_Call_Logs",
          id: `${selectedEvent.callLogID}`,
          data : formData
        }
        let resp = await zohoapi.updateRecord(config);
            // Update events state
            if(resp.code == 3000){
      const updatedEvents = events.map(event => {
          if (event.callLogID === selectedEvent.callLogID) {
            return { ...event, status: "Completed" };
          }
          return event;
        });
        setEvents(updatedEvents);
      }
      else{
        alert("Error updating (Calendar.js. Line:118). Contact sidharth.sc@zohocorp.com.");
      }
    }
  };

  const cancelEvent = () => {
    setIsDialogOpen(false);
    setConfirmationOpen(false);
    alert("Cancel");
  };

  const generateUserIcon = (name) => {
    if (name.includes(" ")) {
      const [firstName, lastName] = name.split(" ");
      return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
    } else {
      return name.slice(0, 2).toUpperCase();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Booked":
        return "#3498db"; // Blue
      case "Completed":
        return "#2ecc71"; // Green
      case "User Not available":
        return "#e74c3c"; // Red
      case "Call re-scheduled":
        return "#f39c12"; // Yellow
      case "Invalid Booking":
        return "#9b59b6"; // Purple
      case "Cancelled":
        return "#7f8c8d"; // Gray
      case "In-Progress":
        return "#4caf50"; // Green 
      default:
        return "#3498db"; // Default to blue
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    return {
      style: {
        backgroundColor: getStatusColor(event.status),
        borderRadius: "0px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <div className="calendar">
      <Calendar
        views={["day", "work_week", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={events}
        style={{ height: "100vh", fontSize: "1.7rem" }}
        onSelectEvent={handleEventSelect}
        eventPropGetter={eventStyleGetter}
      />

      <Dialog
        className="callDetails"
        open={isDialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            width: "40%",
          },
        }}
      >
        <DialogTitle className="title">
          <div className="prjName">
            <div>
              <div className="prjTitle">
                {selectedEvent && selectedEvent.title}
                <span
                  className="statusPill"
                  style={{ backgroundColor: getStatusColor(selectedEvent?.status) }}
                >
                  {selectedEvent && selectedEvent.status}
                </span>
              </div>

              <div className="time">
                {selectedEvent && formatEventDates(selectedEvent.start, selectedEvent.end)}
              </div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="content">
          {selectedEvent && (
            <div>
              <div className="Participants">
                <p>Participants</p>
                <ul>
                  {selectedEvent.participants.map((participant) => (
                    <li key={participant.Email}>
                      <div className="userIcon">{generateUserIcon(participant.Name)}</div>
                      <div className="userDetails">
                        <div className="email">{participant.Email}</div>
                        <div className="name">{participant.Name}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {selectedEvent && selectedEvent.status === "Booked" && (
                <div className="joinlink">
                  <p>
                    <a target="_blank" href={selectedEvent.joinLink}>
                      You can join this meeting using this&nbsp;link
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions className="actions">
          {selectedEvent && (
            <>
              <Button onClick={handleCloseDialog} color="secondary">
                Close
              </Button>
              {selectedEvent.status === "In-Progress" && (
                <Button onClick={() => handleOpenConfirmation("end")} color="primary">
                  End
                </Button>
              )}
              {selectedEvent.status === "Booked" && (
                <>
                  {/* <Button onClick={() => handleOpenConfirmation("cancel")} color="secondary">
                    Cancel
                  </Button> */}
                  <Button onClick={() => handleOpenConfirmation("start")} color="primary">
                    Start
                  </Button>
                </>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>

{/* Dialog Start */}
<Dialog
  open={confirmationOpen}
  onClose={handleCloseConfirmation}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
  PaperProps={{
    style: {
      width: confirmationAction === "end" ? "90rem" : "auto", // Adjust the width as needed
      height: confirmationAction === "end" ? "50rem" : "auto", // Adjust the width as needed
      maxHeight: '80%', 
    },
  }}
>
  <DialogTitle id="alert-dialog-title">
    {confirmationAction === "start" ? "Start Meeting" : (confirmationAction === "end" ? "End Meeting" : "Cancel Meeting")}
  </DialogTitle>
  <DialogContent>
    <div id="alert-dialog-description">
      <p>
        {confirmationAction === "start"
          ? "Are you sure you want to start the meeting?"
          : (confirmationAction === "end" ? "" : "Are you sure you want to cancel the meeting?")}
      </p>
      {confirmationAction === "end" && (
              <ReactQuill
              value={meetingSummary}
              onChange={(value) => setMeetingSummary(value)}
              placeholder="Type your meeting summary here..."
              style={{ height: '32rem', width: '100%' }} // Adjust the height and width as needed
            />
      )}
    </div>
  </DialogContent>
  <DialogActions id="actionButtons">
    <Button onClick={handleCloseConfirmation}>Close</Button>
    <Button onClick={confirmationAction === "start" ? startEvent :(confirmationAction === "end" ? endEvent : cancelEvent)} autoFocus>
      Continue
    </Button>
  </DialogActions>
</Dialog>
{/* Dialog End */}

    </div>
  );
};

export default ReactBigCalendar;
