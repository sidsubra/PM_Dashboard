import React, { useState } from 'react';
import './cardContainer.css';
import Card from './card/Card';

function CardContainer(param) {
  const { cards } = param;
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="cardContainer component">
      <div className="header">
        <select value={filter} onChange={handleFilterChange}>
          <option value="all">All Time</option>
          <option value="quarter">This Quarter</option>
          <option value="month">This Month</option>
        </select>
      </div>
      <div className="Cards">
        {cards.map((card, index) => (
          <Card key={index} data={card} filter={filter} />
        ))}
      </div>
    </div>
  );
}

export default CardContainer;
