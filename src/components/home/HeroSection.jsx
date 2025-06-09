import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './styles/HeroSection.css';

const images = [
  "/images-home/assets_task_01jxade5ekfjc9ttgp23vszhpv_1749475180_img_1.webp",
  "/images-home/assets_task_01jxae1rdkffpaygang7rbw1vs_1749475825_img_2 (1).webp",
  "/images-home/assets_task_01jxadwnx4frbazmbadtp33pcx_1749475646_img_3 (1).webp",
  "/images-home/assets_task_01jxad8gzbf0mtjcbj48v7zrx5_1749474988_img_3 (1) (1).webp"
];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    const fadeDuration = 1000;
    const displayDuration = 5000;
    const fadeOutTimer = setTimeout(() => setLoaded(false), displayDuration - fadeDuration);
    const changeTimer = setTimeout(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
      setLoaded(true);
    }, displayDuration);
    return () => { clearTimeout(fadeOutTimer); clearTimeout(changeTimer); };
  }, [currentImage]);

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
          <Link to="/register" className="hero-btn hero-btn-primary">انضم لتقديم خدمة</Link>
          <Link to="/servicespage" className="hero-btn hero-btn-secondary">تصفح الخدمات</Link>
        </div>
      </div>
      <div className="hero-image">
        <img
          src={images[currentImage]}
          alt="طلاب جامعيين"
          className={`slide-image ${loaded ? 'loaded' : ''}`}
        />
      </div>
    </section>
  );
};

export default HeroSection;
