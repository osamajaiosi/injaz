import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './styles/ServicesSection.css';

const ServicesSection = ({ services }) => {
  return (
    <section className="services-section">
      <div className="services-container">
        <div className="section-header">
          <h2>خدماتنا المميزة</h2>
          <p>مجموعة متنوعة من الخدمات المقدمة من طلاب متميزين</p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="service-card">
                <div className="service-icon">
                  <IconComponent size={24} />
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <Link to={service.path} className="service-link">
                  اكتشف المزيد <ChevronLeft size={16} />
                </Link>
              </div>
            );
          })}
        </div>
        
        <div className="view-all-container">
          <Link to="/services" className="view-all-btn">عرض جميع الخدمات</Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
