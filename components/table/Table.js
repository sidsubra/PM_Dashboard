import React, { useState, useMemo, useContext,useEffect } from "react";
import { Snackbar } from "@mui/material";
import Slide from '@mui/material/Slide';
import "./table.css";
import { DataGrid } from "@mui/x-data-grid";
import phone from "../../media/phone.png";
import cliq from "../../media/cliq.png";
import desk from "../../media/desk.png";
import ProgressBar from "../progressBar/ProgressBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ActiveProjectContext } from "../../context/activeProject";
import { ProductivityContext } from '../../context/productivity';
import { TimerRefContext } from "../../context/timerRef";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";


const zohoinit = ZOHO.CREATOR.init(),zohoutil = ZOHO.CREATOR.UTIL,zohoapi = ZOHO.CREATOR.API;
let prodInterval;

let startObj = {};
function Table(param) {
  const [filter, setFilter] = useState("Active");
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [activePrj, setActivePrj] = useContext(ActiveProjectContext);
  const [openCopyAlert, setopenCopyAlert] = useState(false);
  const [productivity, setProductivity] = useContext(ProductivityContext);

  
  let startPrj = "";
  const { timerIdRef, count, setCount } = useContext(TimerRefContext);

  /**** Confirmation Dialog ****/
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleStatus = (status) => {
    setFilter(status);
  };

  const CopyToClipboardhandleClick = (phoneNo) => {
    if(phoneNo === null){
      phoneNo = "Not available";
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phoneNo)
        .then(() => {
          // Handle success, e.g., show a success message
          setopenCopyAlert(true);
        })
        .catch((error) => {
          // Handle errors, e.g., show an error message
          console.error("Error copying to clipboard:", error);
        });
    }
  };

  let startTask = async (prj) => {
    if(!activePrj.isTaskActive){
      startObj = {
        isTaskActive: true,
        prjID: prj[0].id,
        prj: prj[0].prj,
        task: prj[0].subStage,
        lapsedSeconds: 0,
        ID: prj[0].recID
      };

      /*** Strting Task ***/
      let hourformdata = {
        "data":{
          "Project" :""+startObj.ID+"",
          "PM" : "true"
        }
      }
      let config = {formName: "Hours_utilised_per_day",data: hourformdata};
      let resp =  await zohoapi.addRecord(config);
      if(resp.code == 3000){
      startObj = {...startObj,"activeTaskID":resp.data.ID};
      setActivePrj(startObj);
      }
      else{
        alert("Error updating (Table.js. Line:87). Contact sidharth.sc@zohocorp.com.");
      }
      /********************/
    }
    else{
      alert("You already have an active task.");
    }   
  };

  let stopTask = async () => {
    if (activePrj.isTaskActive) {
      var obj = {
        isTaskActive: false,
        lapsedSeconds: 0,
      };
  
      clearInterval(timerIdRef.current);
      timerIdRef.current = 0;
      setCount(0);
  
      let formData = { "data": { "Task_Status": "Completed" } };
      let config = {
        reportName: "Hours_utilised_per_day_Report_Dev_PM",
        id: `${activePrj.activeTaskID}`,
        data: formData
      };
  
      let resp = await zohoapi.updateRecord(config);

      if (resp.code === 3000) {
        setActivePrj(obj);
      } else {
        alert("Error updating (Table.js. Line:87). Contact sidharth.sc@zohocorp.com.");
      }
    } else {
      alert("No active task found.");
    }
  };
  
  let rows = param.data.filter((row) => row.status === filter);
  if (searchText.trim() != "") {
    rows = rows.filter((row) => {
      console.log(rows);
      if (
        row.id.toString().toLowerCase().startsWith(searchText) ||
        row.prj.toLowerCase().startsWith(searchText) ||
        row.cx.toLowerCase().startsWith(searchText) ||
        row.status.toLowerCase().startsWith(searchText)
      ) {
        return true;
      }
    });
  }
  /******* Getting count of projects in each status ******/
  // Use useMemo to calculate statusCounts when param.data
  const statusCounts = useMemo(() => {
    const counts = {
      Active: 0,
      "On Hold": 0,
      "Lead Lost": 0,
      Launched: 0,
    };

    for (const row of param.data) {
      const status = row.status;
      if (status in counts) {
        counts[status]++;
      }
    }
    return counts;
  }, [param.data]);
  /**********************************/
  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "head",
      flex: 5,
      subStage: "At Development",
      percentage: "50%",
    },
    {
      field: "project",
      headerName: "Project",
      headerClassName: "head",
      headerAlign: "center",
      sortable: false,
      flex: 20,
      renderCell: (params) => {
        const cx = params.row.cx || "";
        const prj = params.row.prj || "";

        return (
          <div>
            <div
              style={{
                maxWidth: "17rem",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {cx}
            </div>
            <div
              className="prj"
              style={{
                maxWidth: "17rem",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {prj}
            </div>
          </div>
        );
      },
    },
    {
      field: "developer",
      headerName: "Developer",
      headerClassName: "head",
      headerAlign: "center",
      flex: 20,
      renderCell: (params) => {
        const zuid = params.row.zuid || "";
        const dev = (params.row.dev || []).map(dev => dev.slice(0, dev.indexOf(" "))).join(", ");
        const imgSrc =
          `https://contacts.zoho.com/file?ID=${zuid}&exp=6000&t=user&fs=thumb` ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGpXECSrkSUG28Is9hrX5VcmTiUk_QxvxHWSwi1wcO-lklAYEU_jbmWeRj7-XzHuTtCAc&usqp=CAU";
        return (
          <div className="devWrapper">
            <img src={imgSrc} alt="" className="image" />
            <p>{dev}</p>
          </div>
        );
      },
    },
    {
      field: "progress",
      headerName: "Progress",
      headerAlign: "center",
      headerClassName: "head",
      sortable: false,
      flex: 22,
      renderCell: (params) => {
        const subStage = params.row.subStage || "";
        const percentage = params.row.per || "";

        return (
          <ProgressBar
            subStage={subStage}
            percentage={percentage}
          ></ProgressBar>
        );
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      headerClassName: "head",
      headerAlign: "center",
      flex: 23,
      sortable: false,
      subStage: "At Development",
      percentage: "50%",
      renderCell: (params) => {
        return (
          <div className="actionContainer">
            <div className="menu-option start">
              {activePrj.prjID === params.row.id ? (
                <svg
                  className="stopSvg"
                  onClick={() => {
                    stopTask(
                      param.data.filter((data) => data.id === params.row.id)
                    );
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#206db3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-stop-circle"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <rect x="9" y="9" width="6" height="6"></rect>
                </svg>
              ) : (
                <svg
                  onClick={() => {
                    startTask(
                      param.data.filter((data) => data.id === params.row.id)
                    );
                  }}
                  className="startSvg"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#206db3"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-play-circle"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
              )}
            </div>
            <div className="menu-option edit">
              <svg
                onClick={() => {
                  editproject(params.row.recID);
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#206db3"
                stroke-width="1.3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-edit"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <div className="menu-option phone" onClick={() => CopyToClipboardhandleClick(params.row.phoneNo)}>
              <img className="icon" src={phone} alt="phone icon" />
            </div>

            <div className="menu-option cliq" onClick={() => opencliqchannel(params.row.cliqchannelID)}>
              <img class="icon" src={cliq}></img>
            </div>
            <div className="menu-option desk" onClick={() => opendeskticket(params.row.deskticketID)}>
              <img class="icon" src={desk}></img>
            </div>
          </div>
        );
      },
    },
    {
      field: "tat",
      headerName: "Duration",
      headerAlign: "center",
      headerClassName: "head",
      flex: 10,
      sortable: false,
      subStage: "At Development",
      percentage: "50%",
      renderCell: (params) => {
        return <p className="timer">{formatSecondsToHoursAndMinutes(params.row.tatInSecs)}</p>;
      },
    },
  ];
  return (
    <div className="myProjectsContainer component">
      <h1>My Projects</h1>
      <div className="tableFunctions">
        <ul className="left">
          <li
            className={`filters ${filter === "Active" ? "active" : ""}`}
            onClick={() => toggleStatus("Active")}
          >
            Active <div className="badge">{statusCounts["Active"]}</div>
          </li>
          <li
            className={`filters ${filter === "Lead Lost" ? "active" : ""}`}
            onClick={() => toggleStatus("Lead Lost")}
          >
            Lead Lost <div className="badge">{statusCounts["Lead Lost"]}</div>
          </li>
          <li
            className={`filters ${filter === "On Hold" ? "active" : ""}`}
            onClick={() => toggleStatus("On Hold")}
          >
            On Hold <div className="badge">{statusCounts["On Hold"]}</div>
          </li>
          <li
            className={`filters ${filter === "Launched" ? "active" : ""}`}
            onClick={() => toggleStatus("Launched")}
          >
            Launched <div className="badge">{statusCounts["Launched"]}</div>
          </li>
        </ul>
        <div className="right search">
          <svg
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.50002 14.5C9.28795 14.5 10.0682 14.3448 10.7961 14.0433C11.5241 13.7417 12.1855 13.2998 12.7427 12.7426C13.2998 12.1855 13.7418 11.5241 14.0433 10.7961C14.3448 10.0681 14.5 9.28793 14.5 8.5C14.5 7.71207 14.3448 6.93185 14.0433 6.2039C13.7418 5.47595 13.2998 4.81451 12.7427 4.25736C12.1855 3.70021 11.5241 3.25825 10.7961 2.95672C10.0682 2.65519 9.28795 2.5 8.50002 2.5C6.90872 2.5 5.38259 3.13214 4.25737 4.25736C3.13216 5.38258 2.50002 6.9087 2.50002 8.5C2.50002 10.0913 3.13216 11.6174 4.25737 12.7426C5.38259 13.8679 6.90872 14.5 8.50002 14.5ZM14.82 13.406L18.4 16.986C18.4955 17.0783 18.5716 17.1887 18.6239 17.3108C18.6762 17.4328 18.7037 17.564 18.7048 17.6968C18.7058 17.8296 18.6804 17.9613 18.63 18.0841C18.5797 18.207 18.5053 18.3186 18.4114 18.4124C18.3174 18.5062 18.2057 18.5804 18.0828 18.6306C17.9599 18.6808 17.8282 18.706 17.6954 18.7047C17.5626 18.7035 17.4314 18.6758 17.3095 18.6233C17.1875 18.5708 17.0772 18.4946 16.985 18.399L13.405 14.819C11.7975 16.0668 9.77481 16.6552 7.74877 16.4642C5.72273 16.2732 3.84562 15.3173 2.49957 13.7911C1.15351 12.2648 0.4397 10.2829 0.503441 8.24892C0.567182 6.2149 1.40368 4.28162 2.84266 2.84265C4.28164 1.40367 6.21492 0.567167 8.24894 0.503426C10.283 0.439685 12.2648 1.1535 13.7911 2.49955C15.3173 3.84561 16.2732 5.72271 16.4642 7.74875C16.6552 9.77479 16.0669 11.7975 14.819 13.405L14.82 13.406Z"
              fill="#697077"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
          />
        </div>
      </div>
      <div className="hr"></div>
      <div className="table">
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            className="custom-data-grid"
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </div>
      {/* Dialog Start*/}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Start Project Task?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Starting a new task will halt any currently active task to
            accommodate the new one.
          </DialogContentText>
        </DialogContent>
        <DialogActions id="actionButtons">
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={startTask} autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog End*/}
      <Snackbar
  TransitionComponent={TransitionLeft} 
  message="Copied to clipboard"
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
  autoHideDuration={2000}
  onClose={() => setopenCopyAlert(false)}
  open={openCopyAlert}

  ContentProps={{
    style: {
      fontSize: "16px", // Adjust the font size as needed
    },
  }}
/>

    </div>
  );

  //-------------------------------Open edit mode of the PROJECT--------------------------
  function editproject(prjid) {
    window.open(
      "https://creatorapp.zoho.com/zohointranet/creator-jumpstart/#Form:Project?recLinkID=" +
        prjid +
        "&viewLinkName=My_Projects",
      "_blank"
    );
  }
  function TransitionLeft(props) {
    return <Slide {...props} direction="bottom" />;
  }
  
}
//-------------------------------Open Desk ticket--------------------------
   function opendeskticket(ticketnum)
   {
     window.open("https://crmplus.zoho.com/zohocorppace/index.do/cxapp/agent/zohocorp/zoho-creator-jumpstart/requests/details/"+ticketnum, "_blank");
   }
 
//-------------------------------Open Cliq chat--------------------------
   function opencliqchannel(channelname)
   {
     window.open("https://one.zoho.com/zohoone/zohocorp/home/cxapp/cliq/company/64396901/chats/"+channelname,"_blank");
   }
//------------------------------- Format Tat--------------------------
   function formatSecondsToHoursAndMinutes(seconds) {
    if(seconds == -1){
      return "NA";
    }
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);

    const daysDisplay = days > 0 ? days + 'd ' : '';
    const hoursDisplay = hours > 0 ? hours + 'h ' : '';

    return daysDisplay + hoursDisplay;
}

export default Table;
