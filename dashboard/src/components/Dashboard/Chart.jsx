
import React from 'react';
import './Chart.css';

const Chart = ({ type = 'bar', data = [], title, height = 300 }) => {
  // Simulation d'un graphique simple avec CSS
  const maxValue = Math.max(...data.map(item => item.value));
  
  const renderBarChart = () => (
    <div className="chart-container bar-chart" style={{ height }}>
      <div className="chart-title">{title}</div>
      <div className="chart-content">
        <div className="chart-grid">
          {data.map((item, index) => (
            <div key={index} className="bar-container">
              <div 
                className="bar"
                style={{ 
                  height: `${(item.value / maxValue) * 80}%`,
                  backgroundColor: item.color || 'var(--primary-color)'
                }}
              >
                <span className="bar-value">{item.value}</span>
              </div>
              <span className="bar-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLineChart = () => {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((item.value / maxValue) * 80);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container line-chart" style={{ height }}>
        <div className="chart-title">{title}</div>
        <div className="chart-content">
          <svg className="line-svg" viewBox="0 0 100 100">
            <polyline
              points={points}
              fill="none"
              stroke="var(--primary-color)"
              strokeWidth="2"
              className="line-path"
            />
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((item.value / maxValue) * 80);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="var(--primary-color)"
                  className="line-point"
                />
              );
            })}
          </svg>
          <div className="line-labels">
            {data.map((item, index) => (
              <span key={index} className="line-label">{item.label}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="chart-container pie-chart" style={{ height }}>
        <div className="chart-title">{title}</div>
        <div className="chart-content">
          <div className="pie-container">
            <svg className="pie-svg" viewBox="0 0 200 200">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const angle = (item.value / total) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                
                const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
                const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 100 100`,
                  `L ${x1} ${y1}`,
                  `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                currentAngle += angle;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={item.color || `hsl(${index * 45}, 70%, 60%)`}
                    className="pie-slice"
                  />
                );
              })}
            </svg>
            <div className="pie-legend">
              {data.map((item, index) => (
                <div key={index} className="legend-item">
                  <div 
                    className="legend-color"
                    style={{ backgroundColor: item.color || `hsl(${index * 45}, 70%, 60%)` }}
                  ></div>
                  <span className="legend-label">{item.label}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  switch (type) {
    case 'line': return renderLineChart();
    case 'pie': return renderPieChart();
    default: return renderBarChart();
  }
};

export default Chart;
