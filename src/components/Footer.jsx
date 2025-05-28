import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>روابط سريعة</h3>
          <ul className="footer-links">
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/about">من نحن</Link></li>
            <li><Link to="/contact">اتصل بنا</Link></li>
            <li><Link to="/register">التسجيل كطالب</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>الخدمات</h3>
          <ul className="footer-links">
            <li><Link to="/services/educational">خدمات تعليمية</Link></li>
            <li><Link to="/services/technical">خدمات تقنية</Link></li>
            <li><Link to="/services/creative">خدمات إبداعية</Link></li>
            <li><Link to="/services/professional">خدمات مهنية</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>تواصل معنا</h3>
          <ul className="footer-links">
            <li>البريد الإلكتروني: info@studentservices.com</li>
            <li>الهاتف: +962 XXXXXXXXX</li>
            <li>العنوان: عمان، الأردن</li>
          </ul>
          <div className="social-links">
            <a href="#" target="_blank">فيسبوك</a>
            <a href="#" target="_blank">تويتر</a>
            <a href="#" target="_blank">انستغرام</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} خدمات الطلاب الجامعية</p>
      </div>
    </footer>
  );
}

export default Footer;