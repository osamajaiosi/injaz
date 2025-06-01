import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import './VerifyOTP.css';

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, userType } = useAuth();
  // redirect authenticated users away from OTP page
  useEffect(() => {
    if (userType !== 'guest') navigate('/home', { replace: true });
  }, [userType, navigate]);
  // support reload: get state or fallback to localStorage
  const { email: stateEmail, formData: stateFormData, otpCode: stateOtpCode } = location.state || {};
  const email = stateEmail || localStorage.getItem('otpEmail') || '';
  const rawFormData = localStorage.getItem('otpFormData');
  let formData;
  try {
    formData = stateFormData ?? JSON.parse(rawFormData ?? '{}');
  } catch {
    formData = {};
  }
  const otpCodeState = stateOtpCode || localStorage.getItem('otpCode') || '';
  const [timer, setTimer] = useState(300);
  const [resendClicked, setResendClicked] = useState(false);
  const [otp, setOtp] = useState(['','','','','']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputsRef = useRef([]);

  // persist on mount
  useEffect(() => {
    if (stateEmail) {
      localStorage.setItem('otpEmail', stateEmail);
      localStorage.setItem('otpFormData', JSON.stringify(stateFormData));
      localStorage.setItem('otpCode', stateOtpCode);
    }
  }, [stateEmail, stateFormData, stateOtpCode]);

  useEffect(() => {
    // initialize or restore OTP timer per email
    const key = `otpSentAt_${email}`;
    const sentAt = parseInt(localStorage.getItem(key), 10);
    if (sentAt) {
      const elapsed = Math.floor((Date.now() - sentAt) / 1000);
      setTimer(Math.max(0, 300 - elapsed));
    } else {
      localStorage.setItem(key, Date.now().toString());
      setTimer(300);
    }
    // countdown interval
    const id = setInterval(() => setTimer(t => {
      if (t <= 1) { clearInterval(id); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [email]);

  const handleResend = async () => {
    setResendClicked(true);
    // restart timer per email on resend
    const key = `otpSentAt_${email}`;
    localStorage.setItem(key, Date.now().toString());
    try {
      const otpRes = await fetch(
        `http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/Send_OTP_Into_Email_And_Return/${encodeURIComponent(email)}`
      );
      const newCode = await otpRes.text();
      // persist new OTP code for verification
      localStorage.setItem('otpCode', newCode);
      setOtp(['','','','','']);
      setError('تم إرسال رمز جديد');
      setTimer(300);
      inputsRef.current[0]?.focus();
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e, idx) => {
    const value = e.target.value;
    const val = value.replace(/\D/, '');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const entered = otp.join('');
    console.log('Submitting signup for email:', email);
    console.log('Signup payload:', JSON.stringify({
      id_user: 0,
      id_person: 0,
      f_name: formData.firstName,
      l_name: formData.lastName,
      email,
      passowrd: formData.password,
      account_Type: email.includes('.edu.jo') ? 'STUDENT' : 'USER'
    }));
    if (entered.length < 5) {
      setError('الرجاء إدخال الرمز بالكامل');
      return;
    }
    if (entered !== otpCodeState) {
      setError('الرمز خاطئ');
      return;
    }
    // Determine account type (student if .edu.jo)
    const accountType = email.includes('.edu.jo') ? 'STUDENT' : 'USER';
    // if student, route to complete-student-info form before signup
    if (accountType === 'STUDENT') {
      // use replace to prevent going back to OTP on browser back
      navigate('/complete-student-info', { state: { email, formData }, replace: true });
      return;
    }
    try {
      const res = await fetch('http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/Sign_Up_Add_User', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: 0,
          id_person: 0,
          f_name: formData.firstName,
          l_name: formData.lastName,
          email,
          passowrd: formData.password,
          account_Type: accountType
        })
      });
      // parse and log full API response
      const data = await res.json();
      console.log('API response:', data);
      const returnedType = data.account_Type;
      const studentId = data.iD_student ?? data.id_student ?? null;
      const personId = data.iD_Person ?? data.id_person ?? null;
      login(returnedType, email, studentId, personId);
      if (returnedType === 'STUDENT') {
        navigate('/student-dashboard', { replace: true });
      } else {
        // show success overlay and then redirect home
        setSuccess(true);
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('حدث خطأ أثناء إنشاء الحساب');
    }
  };

  // after success, navigate home after delay
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => navigate('/', { replace: true }), 2000);
      return () => clearTimeout(t);
    }
  }, [success, navigate]);

  return (
    <div className={`otp-container ${success ? 'fade-out' : ''}`}>
      {success && (
        <div className="success-overlay">
          <div className="success-message">تم التسجيل بنجاح!</div>
        </div>
      )}
      <h2>التحقق من البريد الإلكتروني</h2>
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

export default VerifyOTP;
