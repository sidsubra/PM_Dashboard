import React from 'react';
import './progressBar.css';

function ProgressBar(param) {
    const {subStage,percentage} = param;
    let progressBarClass;
        // Determine the background color class based on the percentage
        if (percentage >= 80) {
          progressBarClass = 'progressBarGreen';
        } else if (percentage >= 50) {
          progressBarClass = 'progressBarYellow';
        }
       else if (percentage >= 30) {
        progressBarClass = 'progressBarBlue';
      }  
      else {
          progressBarClass = 'progressBarRed';
        }
        
  return (
    <div className="progressBarContainer">
        <div className='progressDetails'>
            <p className="subStage">{subStage}</p>
            <p className='percentage'>{percentage +`%` }</p>
        </div>
        <div className="progressBarOuter">
            <div className={`progressBar ${progressBarClass}`} style={{ width: percentage +`%` }}></div>
        </div>
    </div>
  )
}

export default ProgressBar;