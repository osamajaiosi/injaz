import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import "./StudentProfile.css";

function StudentProfile() {
  const { userType } = useAuth();
  const initialForm = {
    firstName: "مجد",
    lastName: "ابو قبع",
    gender: "ذكر",
    email: "ahmed@example.com",
    phone: "962501234567",
    specialty: "هندسة برمجيات",
    university: "جامعة الحسين بن طلال",
    mainService: "تطوير واجهات المستخدم",
    subService: "تصميم مكونات React",
    servicePrice: "1500",
    bio: "طالب هندسة برمجيات في السنة الثالثة، مهتم بتطوير الويب وتطبيقات الموبايل.",
  };

  const [formData, setFormData] = useState(initialForm);
  const [originalData, setOriginalData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  if (userType !== "student") {
    return (
      <div className="unauthorized-message">
        <h2>غير مصرح بالوصول</h2>
        <p>هذه الصفحة متاحة فقط للطلاب</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[name];
      return updatedErrors;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (
      !formData.firstName.trim() ||
      formData.firstName.length < 2 ||
      formData.firstName.length > 30 ||
      /[^\u0621-\u064Aa-zA-Z\s]/.test(formData.firstName)
    ) {
      newErrors.firstName =
        "الاسم الأول يجب أن يحتوي على 2-30 حرفًا ولا يحتوي على رموز أو أرقام.";
    }
    if (
      !formData.lastName.trim() ||
      formData.lastName.length < 2 ||
      formData.lastName.length > 30 ||
      /[^\u0621-\u064Aa-zA-Z\s]/.test(formData.lastName)
    ) {
      newErrors.lastName =
        "الاسم الأخير يجب أن يحتوي على 2-30 حرفًا ولا يحتوي على رموز أو أرقام.";
    }
    if (!["ذكر", "أنثى"].includes(formData.gender)) {
      newErrors.gender = "يرجى اختيار الجنس الصحيح.";
    }
    if (!/^962[0-9]{8,9}$/.test(formData.phone)) {
      newErrors.phone =
        "رقم الهاتف يجب أن يبدأ بـ 962 ويحتوي على 11 إلى 12 رقمًا كحد أقصى.";
    }
    if (
      !formData.bio ||
      formData.bio.length < 20 ||
      formData.bio.length > 500
    ) {
      newErrors.bio = "النبذة الشخصية يجب أن تكون بين 20 و500 حرف.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setOriginalData(formData);
    setIsEditing(false);
    console.log("Profile data updated:", formData);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">الملف الشخصي</h2>
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <img src="/avatar/avatar.png" alt="صورة المستخدم" />
            </div>
            <button className="btn btn-secondary btn-change-avatar">
              <i className="fas fa-camera"></i> تغيير الصورة
            </button>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">المشاريع المنجزة</span>
              <span className="stat-value">12</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">الطلبات الحالية</span>
              <span className="stat-value">3</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">التقييم</span>
              <span className="stat-value">4.8/5</span>
            </div>
          </div>
        </div>
        <div className="profile-main">
          <div className="profile-header">
            <h3>
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="profile-tagline">
              {formData.specialty} | {formData.university}
            </p>
          </div>
          <div className="profile-actions">
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              تعديل البيانات
            </button>
          </div>
          <form className="profile-form" onSubmit={handleSubmit} noValidate>
            {isEditing ? (
              <>
                <div className="form-grid">
                  {["firstName", "lastName", "gender", "phone"].map((field) => (
                    <div className="form-group" key={field}>
                      <label>
                        {field === "firstName"
                          ? "الاسم الأول"
                          : field === "lastName"
                          ? "الاسم الأخير"
                          : field === "gender"
                          ? "الجنس"
                          : "رقم الهاتف"}
                      </label>
                      {field === "gender" ? (
                        <select
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                        >
                          <option value="ذكر">ذكر</option>
                          <option value="أنثى">أنثى</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                        />
                      )}
                      {errors[field] && (
                        <span className="error-msg">{errors[field]}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="form-group full-width">
                  <label>نبذة شخصية</label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                  />
                  {errors.bio && (
                    <span className="error-msg">{errors.bio}</span>
                  )}
                </div>

                <div className="form-buttons">
                  <button type="submit" className="btn btn-success">
                    حفظ التغييرات
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleCancel}
                  >
                    إلغاء
                  </button>
                </div>
              </>
            ) : (
              <div className="profile-details-view">
                <div className="details-section">
                  <h4>معلومات شخصية</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">الاسم الأول:</span>
                      <span className="detail-value">{formData.firstName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">الاسم الأخير:</span>
                      <span className="detail-value">{formData.lastName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">الجنس:</span>
                      <span className="detail-value">{formData.gender}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">البريد الإلكتروني:</span>
                      <span className="detail-value">{formData.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">رقم الهاتف:</span>
                      <span className="detail-value">{formData.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h4>المعلومات الأكاديمية</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">التخصص:</span>
                      <span className="detail-value">{formData.specialty}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">الجامعة:</span>
                      <span className="detail-value">
                        {formData.university}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h4>نبذة عن خدمتي</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">الخدمة الرئيسية:</span>
                      <span className="detail-value">
                        {formData.mainService}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">الخدمة الفرعية:</span>
                      <span className="detail-value">
                        {formData.subService}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">سعر الخدمة:</span>
                      <span className="detail-value">
                        {formData.servicePrice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h4>نبذة شخصية</h4>
                  <p className="bio-text">{formData.bio}</p>
                </div>

                <div className="details-section"></div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
