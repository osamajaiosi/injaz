import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import "./StudentProfile.css";

function StudentProfile() {
  const { userType } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966 50 123 4567",
    specialty: "هندسة برمجيات",
    bio: "طالب هندسة برمجيات في السنة الثالثة، مهتم بتطوير الويب وتطبيقات الموبايل.",
    address: "الرياض، المملكة العربية السعودية",
    university: "جامعة الملك سعود",
    graduationYear: "2026"
  });

  // Redirect if not a student
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
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the updated profile data to your API
    console.log('Profile data updated:', formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">الملف الشخصي</h2>
      <a href="/test">test</a>
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
            <h3>{formData.name}</h3>
            <p className="profile-tagline">{formData.specialty} | {formData.university}</p>
          </div>
          
          <div className="profile-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "إلغاء التعديل" : "تعديل البيانات"}
            </button>
          </div>
          
          <form className="profile-form" onSubmit={handleSubmit}>
            {isEditing ? (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label>الاسم</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>رقم الهاتف</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>التخصص</label>
                    <input 
                      type="text" 
                      name="specialty" 
                      value={formData.specialty} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>الجامعة</label>
                    <input 
                      type="text" 
                      name="university" 
                      value={formData.university} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>سنة التخرج</label>
                    <input 
                      type="text" 
                      name="graduationYear" 
                      value={formData.graduationYear} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>العنوان</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>نبذة شخصية</label>
                  <textarea 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange}
                    rows="4"
                  ></textarea>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="btn btn-success">حفظ التغييرات</button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={() => setIsEditing(false)}
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
                      <span className="detail-label">الاسم:</span>
                      <span className="detail-value">{formData.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">البريد الإلكتروني:</span>
                      <span className="detail-value">{formData.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">رقم الهاتف:</span>
                      <span className="detail-value">{formData.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">العنوان:</span>
                      <span className="detail-value">{formData.address}</span>
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
                      <span className="detail-value">{formData.university}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">سنة التخرج:</span>
                      <span className="detail-value">{formData.graduationYear}</span>
                    </div>
                  </div>
                </div>
                
                <div className="details-section">
                  <h4>نبذة شخصية</h4>
                  <p className="bio-text">{formData.bio}</p>
                </div>
                
                <div className="details-section">
                  <h4>المهارات</h4>
                  <div className="skills-list">
                    <span className="skill-tag">JavaScript</span>
                    <span className="skill-tag">React</span>
                    <span className="skill-tag">Node.js</span>
                    <span className="skill-tag">HTML/CSS</span>
                    <span className="skill-tag">تصميم واجهات المستخدم</span>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;