import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // مؤقتًا: تحديد نوع المستخدم بناءً على الإيميل
    const isStudent = formData.email.includes("student");

    const userType = isStudent ? "student" : "user";
    login(userType); // سجل نوع المستخدم

    // ✅ توجيه المستخدم إلى الصفحة الرئيسية بعد تسجيل الدخول
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>تسجيل الدخول</h2>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="password">كلمة المرور</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            تسجيل الدخول
          </button>
        </form>
        <p className="register-link">
          ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
