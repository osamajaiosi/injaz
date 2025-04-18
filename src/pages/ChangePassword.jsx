import { useState } from "react";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("كلمة المرور الجديدة غير متطابقة");
      return;
    }

    try {
      console.log("🚀 إرسال إلى السيرفر:", {
        currentPassword,
        newPassword,
      });

      setSuccess("تم تغيير كلمة المرور بنجاح ✅");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("حدث خطأ أثناء تغيير كلمة المرور ❌");
    }
  };

  return (
    <div className="change-password-container">
      <h2 className="form-title">تغيير كلمة المرور</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>كلمة المرور الحالية</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>كلمة المرور الجديدة</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>تأكيد كلمة المرور الجديدة</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          تغيير
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
