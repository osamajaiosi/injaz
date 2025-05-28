import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    if (!email.trim()) {
      setErrors('البريد الإلكتروني مطلوب');
      return;
    }
    try {
      // Verify email existence
      const checkRes = await fetch(
        `http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/check-email?email=${encodeURIComponent(email)}`,
        { method: 'GET', headers: { 'Accept': 'text/plain' } }
      );
      if (!checkRes.ok) {
        setErrors('حدث خطأ في التحقق');
        return;
      }
      const existsText = await checkRes.text();
      if (existsText.trim().toLowerCase() !== 'true') {
        setErrors('البريد الإلكتروني غير مسجل');
        return;
      }
      const res = await fetch(`http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/Send_OTP_Into_Email_And_Return/${email}`, {
        method: 'GET',
        headers: { 'Accept': 'text/plain' },
      });
      if (!res.ok) {
        const errText = await res.text();
        setErrors(errText || 'حدث خطأ في الإرسال');
        return;
      }
      const otp = await res.text();
      navigate('/forgot-password/otp', { state: { email, otp } });
    } catch {
      setErrors('فشل في الاتصال بالخادم');
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-box">
        <h2>نسيت كلمة المرور</h2>
        <form onSubmit={handleSubmit}>
          <div className="fp-form-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="fp-input"
            />
            {errors && <p className="fp-error">{errors}</p>}
          </div>
          <button type="submit" className="btn fp-submit-btn">
            إرسال
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
