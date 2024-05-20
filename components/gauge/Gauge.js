import React, { useContext, useState, useEffect } from 'react';
import './gauge.css';
import PieChart from './Chart';
import { ProductivityContext } from '../../context/productivity';

function Gauge(param) {
  const [productivity, setProductivity] = useContext(ProductivityContext);
  const [activeFilter, setActiveFilter] = useState('today');
  const [val, setValue] = useState(productivity.today);
  const [target, setTarget] = useState(productivity.todayTarget);

  const toggleData = (filter) => {
    if (filter === 'today') {
      setValue(productivity.today);
      setTarget(productivity.todayTarget);
    } else {
      setValue(productivity.month);
      setTarget(productivity.monthTarget);
    }
    setActiveFilter(filter);
  };

  // useEffect to update the component state when productivity.today changes
  useEffect(() => {
    setValue(productivity.today);
    setTarget(productivity.todayTarget);
  }, [productivity.today]);

  return (
    <div className="chartContainer">
      <ul className="chartFilter">
        <li
          className={activeFilter === 'today' ? 'active' : ''}
          onClick={() => {
            toggleData('today');
          }}
        >
          Today
        </li>
        <li
          className={activeFilter === 'month' ? 'active' : ''}
          onClick={() => {
            toggleData('month');
          }}
        >
          This Month
        </li>
      </ul>
      <PieChart target={target} completed={val} />
    </div>
  );
}

export default Gauge;
