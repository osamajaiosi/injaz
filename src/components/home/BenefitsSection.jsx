import React from 'react';
import { Star, Shield, Users, Clock } from 'lucide-react';
import { benefitsData } from '../../data/servicesData';
import './styles/BenefitsSection.css';

const BenefitsSection = () => {
  const getIconComponent = (iconName) => {
    const icons = {
      Star: <Star size={24} />,
      Shield: <Shield size={24} />,
      Users: <Users size={24} />,
      Clock: <Clock size={24} />
    };
    
    return icons[iconName] || null;
  };

  return (
    <section className="benefits-section">
      <div className="benefits-container">
        {benefitsData.map((benefit, index) => (
          <div key={index} className="benefit-card">
            <div className="benefit-icon">
              {getIconComponent(benefit.icon)}
            </div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
