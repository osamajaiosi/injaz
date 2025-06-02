import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerifyOTP.css';

function ActivateAccount() {
  const location = useLocation();
  const navigate = useNavigate();

  // retrieve state and fallback to storage
  const { email: stateEmail, otpCode: stateOtpState, personId: statePersonId } = location.state || {};
  const email = stateEmail || localStorage.getItem('otpEmail') || '';
  // combine state and stored personId without mixing ?? and ||
  const personId = statePersonId || localStorage.getItem('otpPersonId') || '';

  // persist on mount: email, code, and personId
  useEffect(() => {
    if (stateEmail) {
      localStorage.setItem('otpEmail', stateEmail);
      localStorage.setItem('otpCode', stateOtpState);
    }
    if (statePersonId) {
      localStorage.setItem('otpPersonId', statePersonId);
    }
  }, [stateEmail, stateOtpState, statePersonId]);

  // timer logic
  const [timer, setTimer] = useState(300);
  useEffect(() => {
    const key = `otpSentAt_${email}`;
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

  // resend OTP
  const [resendClicked, setResendClicked] = useState(false);
  const handleResend = async () => {
    setResendClicked(true);
    const key = `otpSentAt_${email}`;
    localStorage.setItem(key, Date.now().toString());
    try {
      const otpRes = await fetch(
        `http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/Send_OTP_Into_Email_And_Return/${encodeURIComponent(email)}`
      );
      const newCode = await otpRes.text();
      localStorage.setItem('otpCode', newCode);
      setOtp(['','','','','']);
      setError('تم إرسال رمز جديد');
      setTimer(300);
      inputsRef.current[0]?.focus();
    } catch (e) {
      console.error(e);
    }
  };

  // OTP inputs
  const [otp, setOtp] = useState(['','','','','']);
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, '');
    const newOtp = [...otp];
    if (val) {
      newOtp[idx] = val;
      setOtp(newOtp);
      if (idx < otp.length - 1) inputsRef.current[idx+1]?.focus();
    } else {
      newOtp[idx] = '';
      setOtp(newOtp);
    }
  };

  // submit activation code
  const handleSubmit = async (e) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < otp.length) {
      setError('الرجاء إدخال الرمز بالكامل');
      return;
    }
    const currentOtp = localStorage.getItem('otpCode');
    if (entered !== currentOtp) {
      setError('الرمز خاطئ');
      return;
    }
    // ensure valid personId from state
    if (!personId) {
      setError('معرّف المستخدم غير موجود');
      return;
    }
    try {

      console.log(personId);
      // activate account API call (with slash before ID)
      const res = await fetch(
        `http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/Update_Student_Is_Avtive${personId}`
      );
      if (!res.ok) {
        const errText = await res.text();
        setError(errText || 'فشل في تفعيل الحساب');
        return;
      }
      navigate('/home');
    } catch {
      setError('حدث خطأ أثناء تفعيل الحساب');
    }
  };

  // redirect browser back button to login
  useEffect(() => {
    const handlePop = () => navigate('/login');
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [navigate]);

  return (
    <div className="otp-container">
      <h2>تفعيل الحساب</h2>
      <p>أدخل رمز التحقق المرسل إلى <span className="ltr-text" style={{direction: 'ltr'}}>{email}</span></p>
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
                  if (idx > 0) inputsRef.current[idx-1]?.focus();
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
          <button type="button" className="btn resend-btn" onClick={handleResend} disabled={timer>0}>إعادة إرسال</button>
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

export default ActivateAccount;
