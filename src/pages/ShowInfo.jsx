import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ShowInfo.css";
import Rating from "react-rating";
import "@fortawesome/fontawesome-free/css/all.min.css"; // تأكد إنه موجود

const ShowInfo = () => {
  const studentId = 2;

  const [personalInfo, setPersonalInfo] = useState(null);
  const [serviceInfo, setServiceInfo] = useState(null);
  const [images, setImages] = useState([]);
  const [rating, setRating] = useState(null); // تقييم تجريبي

  const [mainServiceName, setMainServiceName] = useState("");
  const [subServiceName, setSubServiceName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personalRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Student_/GET_INFO_FROM_STUDENT_UNVIRSTY_PERSON_USED_SHOW_SERVES_BY_ID_STUDENT${studentId}`
        );
        setPersonalInfo(personalRes.data);

        const serviceRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Serves_Student/GET_Serves_Student_By_Id_Student${studentId}`
        );
        setServiceInfo(serviceRes.data);

        const mainNameRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/ Name_Serves/GET_SERVES ${studentId}`
        );
        setMainServiceName(mainNameRes.data.name_Serves);

        const subNameRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Branch_Serves/GET_BRANCH_SERVES_BY_ID${studentId}`
        );
        setSubServiceName(subNameRes.data.name);

        const imgRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Imege/GET_ALL_IMEGES_BY_ID_SERVES ${serviceRes.data.id}`
        );
        setImages(Array.isArray(imgRes.data) ? imgRes.data : []);

        const ratingRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Rating/Get_Avrge_Rating_Sarves_By_Id_Student ${studentId}`
        );
        setRating(ratingRes.data);
      } catch (error) {
        console.error("فشل في تحميل البيانات:", error);
      }
    };

    fetchData();
  }, [studentId]);

  if (!personalInfo || !serviceInfo)
    return <div className="show-info-container">جاري التحميل...</div>;

  return (
    <div className="show-info-container">
      <h2>معلومات الخدمة</h2>

      {images.length > 0 && (
        <div className="main-image-wrapper">
          <img src={images[0].imeg_Url} alt="الصورة الرئيسية" />
        </div>
      )}

      {/* المعلومات الشخصية */}
      <h3 className="section-title">المعلومات الشخصية</h3>
      <div className="personal-info-section">
        <div className="personal-image">
          <img src={personalInfo.mainImageUrl} alt="الصورة الشخصية" />
        </div>
        <div className="personal-details">
          <div className="info-item">
            <label>الاسم الكامل:</label>
            <div className="info-value-box">{personalInfo.fullName}</div>
          </div>
          <div className="info-item">
            <label>البريد الإلكتروني:</label>
            <div className="info-value-box">{personalInfo.email}</div>
          </div>
          <div className="info-item">
            <label>التخصص الجامعي:</label>
            <div className="info-value-box">{personalInfo.universityMajor}</div>
          </div>
          <div className="info-item">
            <label>اسم الجامعة:</label>
            <div className="info-value-box">{personalInfo.universityName}</div>
          </div>
        </div>
      </div>

      {/* معلومات الخدمة */}
      <h3 className="section-title">معلومات الخدمة</h3>
      <div className="service-info-section">
        <div className="info-item">
          <label>عنوان الخدمة:</label>
          <div className="info-value-box">{serviceInfo.service_Address}</div>
        </div>
        <div className="info-item">
          <label>الخدمة الرئيسية:</label>
          <div className="info-value-box">{mainServiceName}</div>
        </div>
        <div className="info-item">
          <label>الخدمة الفرعية:</label>
          <div className="info-value-box">{subServiceName}</div>
        </div>
      </div>

      {/* الصور الإضافية */}
      {Array.isArray(images) && images.length > 1 && (
        <>
          <h3 className="section-title">صور إضافية</h3>
          <div className="extra-images-grid">
            {images.slice(1, 4).map((img, index) => (
              <img key={index} src={img.imeg_Url} alt={`صورة ${index + 2}`} />
            ))}
          </div>
        </>
      )}

      {rating !== null && rating !== undefined && (
        <>
          <h3 className="section-title">التقييم</h3>
          <div className="rating-box enhanced-rating">
            <div className="rating-circle">{parseFloat(rating).toFixed(1)}</div>
            <div className="rating-label">تقييم المستخدم</div>
            <Rating
              readonly
              initialRating={rating}
              emptySymbol={
                <i
                  className="far fa-star"
                  style={{ color: "#ccc", fontSize: 30 }}
                ></i>
              }
              fullSymbol={
                <i
                  className="fas fa-star"
                  style={{ color: "#fbc02d", fontSize: 30 }}
                ></i>
              }
              halfSymbol={
                <i
                  className="fas fa-star-half-alt"
                  style={{ color: "#fbc02d", fontSize: 30 }}
                ></i>
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ShowInfo;
