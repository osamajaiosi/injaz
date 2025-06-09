import React from 'react';
import { Link } from 'react-router-dom';
import './styles/CTASection.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2><i className="fas fa-user-graduate"></i> هل أنت طالب جامعي؟</h2>
          <p><i className="fas fa-lightbulb"></i> انضم إلينا اليوم وابدأ في عرض مهاراتك وكسب دخل إضافي</p>
          <Link to="/register" className="cta-button"><i className="fas fa-user-plus"></i> سجل الآن <i className="fas fa-arrow-right"></i></Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
