import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerifyOTP.css';

function ForgotPasswordOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email: stateEmail, otp: stateOtp } = location.state || {};
  const email = stateEmail || localStorage.getItem('fpEmail');
  // Trim the OTP code from state or localStorage to remove any whitespace
  const code = (stateOtp ?? localStorage.getItem('fpOtp') ?? '').trim();

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(300);
  const [resendClicked, setResendClicked] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email || !code) navigate('/forgot-password', { replace: true });
    else {
      localStorage.setItem('fpEmail', email);
      localStorage.setItem('fpOtp', code);
    }
  }, [email, code, navigate]);

  useEffect(() => {
    const key = `fpOtpSentAt_${email}`;
    const sentAt = parseInt(localStorage.getItem(key), 10);
    if (sentAt) {
      const elapsed = Math.floor((Date.now() - sentAt) / 1000);
      setTimer(Math.max(0, 300 - elapsed));
    } else {
      localStorage.setItem(key, Date.now().toString());
      setTimer(300);
    }
    const id = setInterval(() => setTimer(t => {
      if (t <= 1) { clearInterval(id); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [email]);

  const handleResend = async () => {
    setResendClicked(true);
    const key = `fpOtpSentAt_${email}`;
    localStorage.setItem(key, Date.now().toString());
    try {
      const otpRes = await fetch(
        `http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/Send_OTP_Into_Email_And_Return/${encodeURIComponent(email)}`
      );
      const newCode = await otpRes.text();
      localStorage.setItem('fpOtp', newCode);
      setOtp(['', '', '', '', '']);
      setError('تم إرسال رمز جديد');
      setTimer(300);
      inputsRef.current[0]?.focus();
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, '');
    const newOtp = [...otp];
    if (val) {
      newOtp[idx] = val;
      setOtp(newOtp);
      if (idx < otp.length - 1) inputsRef.current[idx + 1]?.focus();
    } else {
      newOtp[idx] = '';
      setOtp(newOtp);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entered = otp.join('');
 
    if (entered.length < code.length) {
      setError('الرجاء إدخال الرمز بالكامل');
      return;
    }
    if (entered !== code) {
      setError('الرمز خاطئ');
      return;
    }
    // show success overlay then redirect
    setSuccess(true);
    return;
  };

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => navigate('/forgot-password/reset', { state: { email }, replace: true }), 2000);
      return () => clearTimeout(t);
    }
  }, [success, navigate, email]);

  return (
    <div className={`otp-container ${success ? 'fade-out' : ''}`}>
      {success && (
        <div className="success-overlay">
          <div className="success-message">تم التحقق بنجاح!</div>
        </div>
      )}
      <h2>إعادة تعيين كلمة المرور</h2>
      <p>أدخل رمز التحقق المرسل إلى <span className="ltr-text" style={{direction:'ltr'}}>{email}</span></p>
      <form className="otp-form" onSubmit={handleSubmit}>
        <div className="otp-inputs">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength="1"
              className="otp-input"
              value={digit}
              onChange={e => handleChange(e, idx)}
              onKeyDown={e => {
                if (e.key === 'Backspace') {
                  e.preventDefault();
                  const newOtp = [...otp];
                  newOtp[idx] = '';
                  setOtp(newOtp);
                  if (idx > 0) inputsRef.current[idx - 1]?.focus();
                }
              }}
              ref={el => inputsRef.current[idx] = el}
            />
          ))}
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn otp-submit">تحقق</button>
        <div className="otp-actions">
          {!resendClicked && (
            <span className="timer">
              {Math.floor(timer/60).toString().padStart(2,'0')}:{(timer%60).toString().padStart(2,'0')}
            </span>
          )}
          <button type="button" className="btn resend-btn" onClick={handleResend} disabled={timer>0}>
            إعادة إرسال
          </button>
          {resendClicked && (
            <button
              type="button"
              className="btn support-btn"
              onClick={() => window.open(
                'https://wa.me/962799561057?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%AA%D8%BA%D9%8A%D9%8A%D8%B1%20%D8%A7%D9%84%D8%A8%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A',
                '_blank'
              )}
            >
              التواصل مع الدعم الفني
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordOTP;
