import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import "./StudentProfile.css";

const UserProfile = () => {
  const { idPerson } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // تخصيص حالة التعديل
  const initialForm = { f_name: "", l_name: "", gender: "M", email: "", phone: "", personal_profile: "", profileImage: "" };
  const [formData, setFormData] = useState(initialForm);
  const [originalData, setOriginalData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (idPerson == null) return;
    const fetchData = async () => {
      try {
        console.log(idPerson);
        const response = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Person/GET_Info_PERSON_BY_ID_Person_Using_Profile_Person${idPerson}`
        );
        setData(response.data);
        // إعداد النموذج لبدء التعديل
        setFormData({
          f_name: response.data.f_name || "",
          l_name: response.data.l_name || "",
          gender: response.data.gender || "M",
          email: response.data.email || "",
          phone: response.data.phone || "",
          personal_profile: response.data.personal_profile || "",
          profileImage: response.data.main_Imege_Url || "/avatar/avatar.png",
        });
        setOriginalData({
          f_name: response.data.f_name || "",
          l_name: response.data.l_name || "",
          gender: response.data.gender || "M",
          email: response.data.email || "",
          phone: response.data.phone || "",
          personal_profile: response.data.personal_profile || "",
          profileImage: response.data.main_Imege_Url || "/avatar/avatar.png",
        });
      } catch (error) {
        console.error("فشل في تحميل بيانات المستخدم:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idPerson]);

  // دوال التعديل
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => { const u = { ...prev }; delete u[name]; return u; });
  };
  const handleImageUpload = async e => {
    const file = e.target.files[0]; if (!file) return;
    setSelectedImage(file);
    try {
      const fd = new FormData(); fd.append("imageFile", file);
      await axios.put(
        `http://eallaenjazapi.runasp.net/api/Person/Update_Imege_Profile ${idPerson}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // re-fetch updated profile data without full reload
      const resp = await axios.get(
        `http://eallaenjazapi.runasp.net/api/Person/GET_Info_PERSON_BY_ID_Person_Using_Profile_Person${idPerson}`
      );
      const imgUrl = resp.data.main_Imege_Url || resp.data.profileImageUrl || "/avatar/avatar.png";
      setData(resp.data);
      setFormData(prev => ({ ...prev, profileImage: imgUrl }));
      setOriginalData(prev => ({ ...prev, profileImage: imgUrl }));
      setSelectedImage(null);
    } catch (err) {
      console.error(err);
      alert("فشل في رفع الصورة");
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.f_name.trim() || formData.f_name.length < 2 || formData.f_name.length > 30 || /[^\u0621-\u064Aa-zA-Z\s]/.test(formData.f_name)) newErrors.f_name = "الاسم الأول يجب أن يحتوي على 2-30 حرفًا ولا يحتوي على رموز أو أرقام.";
    if (!formData.l_name.trim() || formData.l_name.length < 2 || formData.l_name.length > 30 || /[^\u0621-\u064Aa-zA-Z\s]/.test(formData.l_name)) newErrors.l_name = "الاسم الأخير يجب أن يحتوي على 2-30 حرفًا ولا يحتوي على رموز أو أرقام.";
    if (!["M","F"].includes(formData.gender)) newErrors.gender = "يرجى اختيار الجنس الصحيح.";
    if (!/^07[0-9]{8}$/.test(formData.phone)) newErrors.phone = "رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 10 أرقام.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "البريد الإلكتروني غير صالح.";
    if (!formData.personal_profile || formData.personal_profile.length < 20 || formData.personal_profile.length > 500) newErrors.personal_profile = "النبذة الشخصية يجب أن تكون بين 20 و500 حرف.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault(); if (!validateForm()) return;
    const body = { id: idPerson, f_name: formData.f_name, l_name: formData.l_name, email: formData.email, gender: formData.gender, mainImageUrl: "string", phone: formData.phone, ID_State: 0, personal_profile: formData.personal_profile };
    try { await axios.put(`http://eallaenjazapi.runasp.net/api/Person/UPDATE_PERSON ${idPerson}`, body, { headers: { "Content-Type": "application/json" } }); setOriginalData(formData); setIsEditing(false); setData(prev => ({ ...prev, ...formData })); } catch (e) { console.error(e); alert("حدث خطأ أثناء الحفظ"); }
  };
  const handleCancel = () => { setFormData(originalData); setErrors({}); setIsEditing(false); };

  if (loading) {
    return <div className="loading">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">الملف الشخصي</h2>
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <img src={selectedImage ? URL.createObjectURL(selectedImage) : formData.profileImage || "/avatar/avatar.png"} alt="صورة المستخدم" />
            </div>
            <input type="file" accept="image/*" style={{ display: "none" }} id="profileImageInput" onChange={handleImageUpload} />
            <label htmlFor="profileImageInput" className="btn btn-secondary btn-change-avatar">
              <i className="fas fa-camera"></i> تغيير الصورة
            </label>
          </div>
          
        </div>

        <div className="profile-main">
          <div className="profile-header">
            <h3>{data.f_name} {data.l_name}</h3>
            <p className="profile-tagline"></p>
          </div>
          <div className="profile-actions">
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>تعديل البيانات</button>
          </div>
          <form className="profile-form" onSubmit={handleSubmit} noValidate>
            {isEditing ? (
              <>
                <div className="form-grid">
                  { ["f_name","l_name","gender","phone"].map(field => (
                    <div className="form-group" key={field}>
                      <label>{field==="f_name"?"الاسم الأول":field==="l_name"?"الاسم الأخير":field==="gender"?"الجنس":field==="phone"?"رقم الهاتف":"البريد الإلكتروني"}</label>
                      {field==="gender"?(
                        <select name="gender" value={formData.gender} onChange={handleChange}><option value="M">ذكر</option><option value="F">أنثى</option></select>
                      ):(
                        <input type="text" name={field} value={formData[field]} onChange={handleChange} />
                      )}
                      {errors[field] && <span className="error-msg">{errors[field]}</span>}
                    </div>
                  ))}
                </div>
                <div className="form-group full-width">
                  <label>نبذة شخصية</label>
                  <textarea name="personal_profile" rows={4} value={formData.personal_profile} onChange={handleChange} />
                  {errors.personal_profile && <span className="error-msg">{errors.personal_profile}</span>}
                </div>
                <div className="form-buttons">
                  <button type="submit" className="btn btn-success">حفظ التغييرات</button>
                  <button type="button" className="btn btn-danger" onClick={handleCancel}>إلغاء</button>
                </div>
              </>
            ) : (
              <div className="profile-details-view">
                <div className="details-section">
                  <h4>المعلومات الشخصية</h4>
                  <div className="details-grid">
                    {data.f_name && <div className="detail-item"><span className="detail-label">الاسم الأول:</span><span className="detail-value">{data.f_name}</span></div>}
                    {data.l_name && <div className="detail-item"><span className="detail-label">الاسم الأخير:</span><span className="detail-value">{data.l_name}</span></div>}
                    {data.gender && <div className="detail-item"><span className="detail-label">الجنس:</span><span className="detail-value">{data.gender === "M" ? "ذكر" : "أنثى"}</span></div>}
                    {data.email && <div className="detail-item"><span className="detail-label">البريد الإلكتروني:</span><span className="detail-value">{data.email}</span></div>}
                    {data.phone && <div className="detail-item"><span className="detail-label">رقم الهاتف:</span><span className="detail-value">{data.phone}</span></div>}
                  </div>
                </div>

                {data.personal_profile && (
                <div className="details-section">
                  <h4>نبذة شخصية</h4>
                  <p className="bio-text">{data.personal_profile}</p>
                </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
