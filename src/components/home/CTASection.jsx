import React from 'react';
import { Link } from 'react-router-dom';
import './styles/CTASection.css';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2>هل أنت طالب جامعي؟</h2>
          <p>انضم إلينا اليوم وابدأ في عرض مهاراتك وكسب دخل إضافي</p>
          <Link to="/register" className="cta-button">سجل الآن</Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
