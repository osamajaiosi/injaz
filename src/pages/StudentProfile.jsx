import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import "./StudentProfile.css";

function StudentProfile() {
  const { userType } = useAuth();
  const initialForm = {
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    specialty: "",
    university: "",
    mainService: "",
    subService: "",
    servicePrice: "",
    bio: "",
    profileImage: "",
    rating: "",
  };
  const [selectedImage, setSelectedImage] = useState(null); // لرفع الصورة الجديدة
  const [formData, setFormData] = useState(initialForm);
  const [originalData, setOriginalData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idPerson = 1; // لاحقاً من الوجين
        const idStudent = 2; // لاحقاً من الوجين

        // ✅ API 1: معلومات الطالب الأساسية (الاسم، الجنس، إيميل، هاتف، نبذة، صورة)
        const personRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Person/GET_Info_PERSON_BY_ID_Person_Using_Profile_Person${idPerson}`
        );

        const person = personRes.data;
        const academicRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Student_/GET_INFO_FROM_STUDENT_UNVIRSTY_PERSON_USED_SHOW_SERVES_BY_ID_STUDENT${idStudent}`
        );

        const academic = academicRes.data;
        // ✅ API الخدمات
        const serviceRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Serves_Student/GET_Serves_Student_By_Id_Student${idStudent}`
        );
        const service = serviceRes.data;
        const ratingRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Rating/Get_Avrge_Rating_Sarves_By_Id_Student ${idStudent}`
        );
        const mainServiceRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/ Name_Serves/GET_SERVES ${service.serveS_ID}`
        );
        const subServiceRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Branch_Serves/GET_BRANCH_SERVES_BY_ID${service.branch_Server_Id}`
        );
        const subService = subServiceRes.data;

        const mainService = mainServiceRes.data;
        const rating = ratingRes.data;

        setFormData({
          firstName: person.f_name || "",
          lastName: person.l_name || "",
          gender: person.gender === "M" ? "ذكر" : "أنثى",
          email: person.email || "",
          phone: person.phone || "",
          specialty: academic.universityMajor || "",
          university: academic.universityName || "",
          mainService: mainService.name_Serves || "",

          subService: subService.name || "", // ✅ بدل الـ ID
          servicePrice: service.price || "",
          bio: person.personal_profile || "",
          profileImage: academic.mainImageUrl || "/avatar/avatar.png",
          rating: rating, // <<< من API التقييم
        });

        setOriginalData((prev) => ({ ...prev, ...formData }));
      } catch (error) {
        console.error("فشل في تحميل البيانات:", error);
      }
    };

    fetchData();
  }, []);

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
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);

    try {
      const idPerson = 1; // لاحقاً من الوجين
      const formDataImage = new FormData();
      formDataImage.append("imageFile", file);

      await axios.put(
        `http://eallaenjazapi.runasp.net/api/Person/Update_Imege_Profile ${idPerson}`,
        formDataImage,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      window.location.reload();
    } catch (err) {
      console.error("❌ فشل في رفع الصورة:", err);
      alert("حدث خطأ أثناء رفع الصورة");
    }
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
    if (!/^07[0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 10 أرقام فقط.";
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const idPerson = 1; // لاحقاً من الوجين

    const updateBody = {
      id: idPerson,
      f_name: formData.firstName,
      l_name: formData.lastName,
      email: formData.email || "", // إذا بدك تبقيه
      gender: formData.gender === "ذكر" ? "M" : "F",
      mainImageUrl: "string", // ممكن تبقيه ثابت أو تأخذه من `formData.profileImage`
      phone: formData.phone,
      ID_State: 0, // حسب الـ API
      personal_profile: formData.bio,
    };

    try {
      await axios.put(
        `http://eallaenjazapi.runasp.net/api/Person/UPDATE_PERSON ${idPerson}`,
        updateBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setOriginalData(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("❌ فشل في حفظ البيانات:", error);
      alert("حدث خطأ أثناء حفظ البيانات");
    }
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
              <img src={formData.profileImage} alt="صورة المستخدم" />
            </div>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="profileImageInput"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="profileImageInput"
              className="btn btn-secondary btn-change-avatar"
            >
              <i className="fas fa-camera"></i> تغيير الصورة
            </label>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">المشاريع المنجزة</span>
              <span className="stat-value">12</span>
              {/* لاحقاً: اربطها بـ API المشاريع */}
            </div>
            <div className="stat-item">
              <span className="stat-label">الطلبات الحالية</span>
              <span className="stat-value">3</span>
              {/* لاحقاً: API الطلبات الحالية */}
            </div>
            <div className="stat-item">
              <span className="stat-label">التقييم</span>
              <span className="stat-value">{formData.rating}/5</span>
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
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
