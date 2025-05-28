import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>اتصل بنا</h1>
        <p>نحن هنا للإجابة على استفساراتك ومساعدتك</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <h3>معلومات التواصل</h3>
            <ul>
              <li>
                <strong>العنوان:</strong>
                <p>عمان، الأردن</p>
              </li>
              <li>
                <strong>البريد الإلكتروني:</strong>
                <p>info@studentservices.com</p>
              </li>
              <li>
                <strong>الهاتف:</strong>
                <p>+962 XXXXXXXXX</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="contact-form">
          <h3>أرسل لنا رسالة</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">الاسم</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">الموضوع</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">الرسالة</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">إرسال</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;