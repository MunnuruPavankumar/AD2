// src/components/Results.js
import React from 'react';

const Results = ({ results }) => {
  return (
    <div className="results">
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <h3>{result.productName}</h3>
          <p>Price: {result.price}</p>
          <p>Rating: {result.rating}</p>
          <p>Availability: {result.availability}</p>
        </div>
      ))}
    </div>
  );
};

export default Results;