import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerifyOTP.css';

function ForgotPasswordReset() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state && location.state.email) || localStorage.getItem('fpEmail') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password.trim()) {
      setError('كلمة المرور مطلوبة');
      return;
    }
    // require at least 6 characters
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 خانات أو أكثر');
      return;
    }
    if (password !== confirm) {
      setError('كلمة المرور غير متطابقة');
      return;
    }
    try {
      const res = await fetch(
        `http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/Forget_Passowrd/${encodeURIComponent(email)},${encodeURIComponent(password)}`,
        { method: 'GET', headers: { 'Accept': 'text/plain' } }
      );
      if (!res.ok) {
        const errText = await res.text();
        setError(errText || 'فشل في تغيير كلمة المرور');
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch {
      setError('فشل في الاتصال بالخادم');
    }
  };

  return (
    <div className={`otp-container ${success ? 'fade-out' : ''}`}>
      {success && (
        <div className="success-overlay">
          <div className="success-message">تم تغيير كلمة المرور بنجاح!</div>
        </div>
      )}
      <h2>تعيين كلمة المرور الجديدة</h2>
      <form className="otp-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>كلمة المرور الجديدة</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>تأكيد كلمة المرور الجديدة</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn otp-submit">تعيين</button>
      </form>
    </div>
  );
}

export default ForgotPasswordReset;
