import React from 'react';
import { testimonialData } from '../../data/servicesData';
import './styles/TestimonialsSection.css';

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="section-header">
          <h2>آراء المستخدمين</h2>
          <p>ماذا يقول مستخدمو المنصة عن تجربتهم</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonialData.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <p>"{testimonial.text}"</p>
              </div>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} />
                <div>
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
