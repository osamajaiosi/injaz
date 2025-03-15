import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './styles/HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">اكتشف مواهب <span className="highlight">الطلاب الجامعيين</span></h1>
        <p className="hero-subtitle">منصة تربط طلاب الجامعات بالمجتمع المحلي لتقديم خدمات متميزة بأسعار تنافسية</p>
        
        <div className="search-container">
          <div className="search-box">
            <Search size={20} />
            <input type="text" placeholder="ابحث عن خدمة..." />
            <button className="search-btn">ابحث</button>
          </div>
        </div>
        
        <div className="hero-buttons">
          <Link to="/register" className="hero-btn hero-btn-primary">انضم كطالب</Link>
          <Link to="/services" className="hero-btn hero-btn-secondary">تصفح الخدمات</Link>
        </div>
      </div>
      <div className="hero-image">
        <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="طلاب جامعيين" />
      </div>
    </section>
  );
};

export default HeroSection;
