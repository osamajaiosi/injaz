import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CompleteStudentInfo.css';
import { useAuth } from '../Contexts/AuthContext';

function CompleteStudentInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, formData } = location.state || {};
  const { login } = useAuth();

  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [alternativeEmail, setAlternativeEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch list of universities from API
    fetch('http://eallaenjazapi.runasp.net/api/Unvirsty/GET_ALL_UNVIRSTY', {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => setUniversities(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUniversity || !major) {
      setError('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    // تحقق من استخدام البريد البديل
    if (alternativeEmail) {
      const resCheck = await fetch(
        `http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/check-email?email=${encodeURIComponent(alternativeEmail)}`
      );
      const exists = await resCheck.json();
      if (exists) {
        setError('هذا البريد الإلكتروني البديل مستخدم من قبل');
        return;
      }
    }
    try {
      const payload = {
        ID_person: 0,
        f_name: formData.firstName,
        l_name: formData.lastName,
        email,
        password: formData.password,
        account_Type: 'STUDENT',
        ID_student: 0,
        switch_Email: alternativeEmail,
        // match API expected field for major (correct spelling: mejor)
        university_mejor: major,
        ID_Unversty: parseInt(selectedUniversity, 10),
      };
      console.log('Submitting student info', payload);
      const res = await fetch('http://eallaenjazapi.runasp.net/api/Login_and_Sign_Up/Sign_Up_ADD_Student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Validation errors:', errorData.errors);
        setError(Object.values(errorData.errors).flat().join(' ، '));
        return;
      }
      const data = await res.json();
      console.log('API response:', data);
      // تسجيل idStudent و idPerson في السياق
      login(data.account_Type, email, data.iD_student, data.iD_Person);
      // redirect to custom home route to display Home page
      navigate('/home', { replace: true });
    } catch (err) {
      console.error(err);
      setError('حدث خطأ، حاول مرة أخرى');
    }
  };

  return (
    <div className="complete-student-container">
      <h2>إكمال معلومات الطالب</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>الجامعة</label>
          <select
            className="form-control"
            value={selectedUniversity}
            onChange={e => setSelectedUniversity(e.target.value)}
          >
            <option value="">اختر الجامعة</option>
            {universities.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>التخصص الجامعي</label>
          <input
            type="text"
            className="form-control"
            value={major}
            onChange={e => setMajor(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>البريد الإلكتروني البديل</label>
          <input
            type="email"
            className="form-control"
            value={alternativeEmail}
            onChange={e => setAlternativeEmail(e.target.value)}
          />
          <div className="help-text">
            <i className="fas fa-exclamation-triangle warning-icon"></i>
            <small>يرجى إدخال بريد إلكتروني بديل دائم، لضمان استمرارية الوصول إلى حسابك بعد انتهاء صلاحية البريد الجامعي.</small>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block">
          حفظ
        </button>
      </form>
    </div>
  );
}

export default CompleteStudentInfo;
