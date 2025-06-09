import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3><i className="fas fa-link section-icon" aria-hidden="true" /> روابط سريعة</h3>
          <ul className="footer-links">
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/about">من نحن</Link></li>
            <li><Link to="/register">التسجيل كمقدم خدمة</Link></li>
            <li><Link to="/faq">الاسئلة الشائعة</Link></li>
            <li><Link to="/privacy-policy">سياسة الخصوصية</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3><i className="fas fa-paint-brush section-icon" aria-hidden="true" /> الخدمات</h3>
          <ul className="footer-links">
            <li><Link to="/services/تعليمية">خدمات تعليمية</Link></li>
            <li><Link to="services/تقنية">خدمات تقنية</Link></li>
            <li><Link to="/services/إبداعية">خدمات إبداعية</Link></li>
            <li><Link to="/services/مهنية">خدمات مهنية</Link></li>
            <li><Link to="/servicespage">تصفح كل الخدمات</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3><i className="fas fa-envelope section-icon" aria-hidden="true" /> تواصل معنا</h3>
          <ul className="footer-links">
            <li>
              <i className="fas fa-envelope" aria-hidden="true" />
              البريد الإلكتروني: support@yallaenjaz.com
            </li>
            <li>
              <i className="fas fa-phone" aria-hidden="true" />
              الهاتف: 962799153468+
            </li>
            <li>
              <i className="fas fa-map-marker-alt" aria-hidden="true" />
              العنوان: معان، الأردن
            </li>
          </ul>
          <div className="social-links">
            <a
              href="https://wa.me/962799561057?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%AA%D8%BA%D9%8A%D9%8A%D8%B1%20%D8%A7%D9%84%D8%A8%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A"
              className="social-link whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp" aria-hidden="true" />
            </a>
            <a
              href="https://www.facebook.com/osama.aljaiosi/"
              className="social-link facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/"
              className="social-link instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>جميع الحقوق محفوظة {new Date().getFullYear()} خدمات الطلاب الجامعية</p>
      </div>
    </footer>
  );
}

export default Footer;