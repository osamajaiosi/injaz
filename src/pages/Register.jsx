import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      containerRef.current.classList.add('show-circle');
    }, 50);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!formData.lastName.trim()) newErrors.lastName = 'الاسم الثاني مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) newErrors.email = 'صيغة البريد غير صحيحة';
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
    else if (formData.password.length < 6) newErrors.password = 'يجب أن تكون كلمة المرور 6 أحرف أو أكثر';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'يرجى تأكيد كلمة المرور';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'تأكيد كلمة المرور غير متطابق';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    // Email uniqueness check and OTP send
    try {
      const res = await fetch(
        `http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/check-email?email=${encodeURIComponent(formData.email)}`
      );
      const exists = await res.json();
      if (exists) {
        setErrors(prev => ({ ...prev, email: 'هذا البريد مستخدم من قبل' }));
        return;
      }
      const otpRes = await fetch(
        `http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/Send_OTP_Into_Email_And_Return/${encodeURIComponent(formData.email)}`
      );
      const otpCode = await otpRes.text();
      navigate('/verify-otp', { state: { email: formData.email, formData, otpCode } });
      return;
    } catch (err) {
      console.error('Error checking email:', err);
    }
    // proceed with registration if OTP flow skipped
  };

  const handleLoginTransition = (e) => {
    e.preventDefault();
    // remove entrance animation class
    containerRef.current.classList.remove('show-circle');
    containerRef.current.classList.add('slide-login');
    setTimeout(() => navigate('/login'), 600);
  };

  return (
    <div className="register-container" ref={containerRef}>
      <div className="left-section">
        <div className="form-wrapper">
          <h2 className="form-title">إنشاء حساب جديد</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>الاسم الأول</label>
              <input type="text" name="firstName" placeholder="الاسم الأول" value={formData.firstName} onChange={handleChange} required />
              {errors.firstName && <p className="error-message">{errors.firstName}</p>}
            </div>
            <div className="form-group">
              <label>الاسم الثاني</label>
              <input type="text" name="lastName" placeholder="الاسم الثاني" value={formData.lastName} onChange={handleChange} required />
              {errors.lastName && <p className="error-message">{errors.lastName}</p>}
            </div>
            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input type="email" name="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={handleChange} required />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label>كلمة المرور</label>
              <input type="password" name="password" placeholder="كلمة المرور" value={formData.password} onChange={handleChange} required />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            <div className="form-group">
              <label>تأكيد كلمة المرور</label>
              <input type="password" name="confirmPassword" placeholder="تأكيد كلمة المرور" value={formData.confirmPassword} onChange={handleChange} required />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>
            <button type="submit" className="btn submit-btn">إنشاء حساب</button>
          </form>
        </div>
      </div>
      <div className="right-section">
        <div className="info-content">
          <img
            src="/logo/WhatsApp Image 2025-03-16 at 10.58.45 PM (1).png"
            alt="Logo"
            className="logo"
          />
          <p className="info-text">
            للبقاء على اتصال معنا، يرجى تسجيل الدخول باستخدام معلوماتك الشخصية
          </p>
          <Link to="/login" className="btn login-btn" onClick={handleLoginTransition}>
            تسجيل الدخول
          </Link>
          <img
            src="/avatar/isolated_person (1).png"
            alt="Illustration"
            className="illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;