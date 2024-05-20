import React, { useState, useEffect } from 'react';
import './loader.css';

function Loader() {
  const [loadingText, setLoadingText] = useState('Fetching Projects ...');
  const loadingTexts = ['Fetching Projects ...', 'Fetching Customers ...', 'Fetching Calls ...','Calculating Metrics ...','Creating Calendar ...','Creating Cards ...','Creating Tables ...','Loading Timer ...','Getting things set ...'];
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLoader(false);
    }, 6000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (showLoader) {
      const intervalId = setInterval(() => {
        setLoadingText((prevText) => {
          const currentIndex = loadingTexts.indexOf(prevText);
          const nextIndex = (currentIndex + 1) % loadingTexts.length;
          return loadingTexts[nextIndex];
        });
      }, 1200);

      return () => clearInterval(intervalId);
    }
  }, [showLoader]);

  return showLoader ? (
    <div className="loaderContainer">
      <div className="loadingText">{loadingText}</div>
    </div>
  ) : null;
}

export default Loader;
