import React from 'react';
import { seasonalData } from '../data/seasonalData';
import './SeasonalChart.css';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function SeasonalChart() {
  return (
    <div className="seasonal-chart-container">
      <h2 className="chart-title">Kerala Agricultural Seasonality Matrix</h2>
      <p className="chart-subtitle">Gantt-style representation of harvest seasons</p>
      
      <div className="chart-legend">
        <span className="legend-item"><span className="legend-color early"></span> Early / Growth</span>
        <span className="legend-item"><span className="legend-color moderate"></span> Moderate / Harvest</span>
        <span className="legend-item"><span className="legend-color peak"></span> Peak / High Yield</span>
      </div>

      <div className="chart-scroll-wrapper">
        <table className="seasonal-matrix">
          <thead>
            <tr>
              <th className="crop-header">Crop</th>
              {months.map(month => (
                <th key={month} className="month-header">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {seasonalData.map(data => (
              <tr key={data.crop}>
                <td className="crop-name">{data.crop}</td>
                {monthKeys.map((key, index) => {
                  const status = data[key];
                  return (
                    <td key={index} className="month-cell">
                      {status && (
                        <div className={`season-bar ${status}`}></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SeasonalChart;
