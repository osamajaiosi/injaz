import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const containerRef = useRef(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  // animate circle on page load
  useEffect(() => {
    // delay to ensure initial render with hidden circle
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
    setErrors({});
    if (!formData.email.trim()) {
      setErrors({ email: 'البريد الإلكتروني مطلوب' });
      return;
    }
    if (!formData.password) {
      setErrors({ password: 'كلمة المرور مطلوبة' });
      return;
    }
    if (formData.password.length < 6) {
      setErrors({ password: 'يجب أن تكون كلمة المرور 6 أحرف أو أكثر' });
      return;
    }
    try {
      const resp = await fetch(
        `http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/LOGIN_BERSON_BY_EMAIL_AND_PASSOWRD/${encodeURIComponent(
          formData.email
        )},${encodeURIComponent(formData.password)}`
      );
      const text = await resp.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        result = { message: text };
      }
      if (!resp.ok) {
        const errorText = await resp.text();
        setErrors({ email: errorText });
        return;
      }
      // if account inactive, send activation OTP and show VerifyOTP screen
      if (result.is_Stutas_Accunt === 1) {
        try {
          const otpRes = await fetch(
            `http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/Send_OTP_Into_Email_And_Return/${encodeURIComponent(formData.email)}`
          );
          const otpCode = await otpRes.text();
          // set auth context to preserve IDs during activation
          const studentId = result.iD_Student ?? result.iD_student ?? null;
          login(result.account_Type, formData.email, studentId, result.iD_Person);
          navigate('/activate-account', { state: { email: formData.email, formData, otpCode, personId: result.iD_Person, studentId } });
          return;
        } catch (err) {
          console.error(err);
        }
      }
      // else, active account: update context and redirect
      const studentId = result.iD_Student ?? result.iD_student ?? null;
      login(result.account_Type, formData.email, studentId, result.iD_Person);
      navigate('/home');
    } catch (error) {
      console.error(error);
      setErrors({ email: 'حدث خطأ أثناء التحقق. حاول مرة أخرى لاحقاً' });
    }
  };

  const handleRegisterTransition = (e) => {
    e.preventDefault();
    // remove initial entrance class
    containerRef.current.classList.remove('show-circle');
    containerRef.current.classList.add('slide-register');
    setTimeout(() => navigate('/register'), 600);
  };

  return (
    <div className="login-container" ref={containerRef}>
      <div className="left-section">
        <div className="info-content">
          <img
            src="/logo/WhatsApp Image 2025-03-16 at 10.58.45 PM (1).png"
            alt="Logo"
            className="logo"
          />
          <p className="info-text">
            ليس لديك حساب؟ أنشئ حسابك في أقلِّ من دقيقة
          </p>
          <Link to="/register" className="btn login-btn" onClick={handleRegisterTransition}>
            إنشاء حساب جديد
          </Link>
          <img
            src="/avatar/transparent_image.png"
            alt="Illustration"
            className="illustration"
          />
        </div>
      </div>
      <div className="login-right-section">
        <div className="form-wrapper">
          <h2 className="form-title">تسجيل الدخول</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label>كلمة المرور</label>
              <input
                type="password"
                name="password"
                placeholder="كلمة المرور"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            <button type="submit" className="btn submit-btn">
              دخول
            </button>
            <div className="forgot-password">
              <Link to="/forgot-password" className="btn forgot-btn">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
