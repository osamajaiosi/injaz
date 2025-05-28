import React from 'react';
import { statisticsData } from '../../data/servicesData';
import './styles/StatisticsSection.css';

const StatisticsSection = () => {
  return (
    <section className="statistics-section">
      <div className="statistics-container">
        {statisticsData.map((stat, index) => (
          <div key={index} className="statistic-item">
            <div className="statistic-value">{stat.value}</div>
            <div className="statistic-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatisticsSection;
