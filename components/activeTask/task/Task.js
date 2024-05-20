import React, { useRef, useState, useEffect, useContext } from 'react';
import './task.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { ActiveProjectContext } from "../../../context/activeProject";
import { TimerContext } from "../../../context/timer";
import { TimerRefContext } from "../../../context/timerRef";
const zohoinit = ZOHO.CREATOR.init(),zohoutil = ZOHO.CREATOR.UTIL,zohoapi = ZOHO.CREATOR.API;

function Task() {
  const [activePrj, setActivePrj] = useContext(ActiveProjectContext);
  const { timerIdRef, count, setCount } = useContext(TimerRefContext);


  const startHandler = () => {
    if (timerIdRef.current) return;
    timerIdRef.current = setInterval(() => setCount((c) => c + 1), 1000);
  };

  const stopHandler = async () => {
    if(activePrj.isTaskActive){
    clearInterval(timerIdRef.current);
    timerIdRef.current = 0;
    setCount(0);
    let formData = {"data" : {"Task_Status":"Completed"}};
      let config = {
        reportName : "Hours_utilised_per_day_Report_Dev_PM",
        id: `${activePrj.activeTaskID}`,
        data : formData
      }
      let resp = await zohoapi.updateRecord(config);
      if(resp.code == 3000){
        setActivePrj(() => ({
          isTaskActive: false,
          lapsedSeconds: 0,
        }));
      }
      else{
        alert("Error updating (Table.js. Line:32). Contact sidharth.sc@zohocorp.com.");
      }
    }
  };

  useEffect(() => {
    if (activePrj.isTaskActive) {
      startHandler();
    }
    return () => clearInterval(timerIdRef.current);
  }, [activePrj.isTaskActive]);

  useEffect(() => {
    if (!activePrj.isTaskActive) {
      stopHandler();
    }
  }, [activePrj.isTaskActive]);

  useEffect(() => {
    if (activePrj.isTaskActive) {
      const newCount = Number(activePrj.lapsedSeconds);
      if (!isNaN(newCount)) {
        setCount(newCount);
      }
    }
  }, [activePrj]);

  const isRunning = Boolean(activePrj.isTaskActive);

  const formatTime = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  const seconds = count % 60;
  const minutes = Math.floor(count / 60) % 60;
  const hours = Math.floor(count / 3600);

  return (
    <div className='activeTask'>
      {
        activePrj.isTaskActive ? (
          <>
            <p className="projectName">{activePrj.isTaskActive ? activePrj.prj : 'No active tasks found'}</p>
            <p className="subStage">{activePrj.isTaskActive ? activePrj.task : ''}</p>

          </>
        ) : (
          <>
            <p className="noActiveTasks">No active tasks found</p>
          </>
        )
      }
      <div className="timerContainer">
        <div className="timer">
          <span id="hrs">{formatTime(hours)}</span>
          <span style={{ color: "#c7c7c7" }}>:</span>
          <span id="mins">{formatTime(minutes)}</span>
          <span style={{ color: "#c7c7c7" }}>:</span>
          <span id="secs">{formatTime(seconds)}</span>
        </div>
        <div className="btnContainer">
          {isRunning ? (
            <div className="btn stop" onClick={stopHandler}>
              <StopIcon />
            </div>
          ) : (<></>)}
        </div>
      </div>
    </div>
  );
}

export default Task;
