import { useEffect, useState } from "react";
import axios from "axios";
import "./ShowInfo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useParams } from "react-router-dom";
import { BookOpen, PenTool, Code, Calendar, Heart, Stethoscope, Home, ShoppingCart, Globe, Truck, Users, ChevronLeft } from "lucide-react";
import "./AddsService.css";

const iconMap = {
  تعليمة: BookOpen,
  ابداعية: PenTool,
  تقنية: Code,
  فعاليات: Calendar,
  الرعاية: Heart,
  الصحية: Stethoscope,
  المنزلية: Home,
  التسويق: ShoppingCart,
  الترجمة: Globe,
  النقل: Truck,
  متنوعة: Users,
  مهنية: Users,
};

const CustomShowInfo = () => {
  const { serviceId } = useParams();
  const currentId = serviceId;

  const [personalInfo, setPersonalInfo] = useState(null);
  const [serviceInfo, setServiceInfo] = useState(null);
  const [images, setImages] = useState([]);
  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState([]);
  const [serviceNotFound, setServiceNotFound] = useState(false);

  const [mainServiceName, setMainServiceName] = useState("");
  const [subServiceName, setSubServiceName] = useState("");
  const [mainServiceId, setMainServiceId] = useState(null);
  const [subServiceId, setSubServiceId] = useState(null);

  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      // أولاً: جلب بيانات الخدمة
      let mainId, subId, studentId, serviceRecordId;
      try {
        const serviceRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Serves_Student/GET_Serves_Student_By_Id_Student${currentId}`
        );
        setServiceInfo(serviceRes.data);
        mainId = serviceRes.data.serveS_ID;
        subId = serviceRes.data.branch_Server_Id;
        serviceRecordId = serviceRes.data.id;
        console.log("رقم الخدمة:", serviceRecordId);
        setMainServiceId(mainId);
        setSubServiceId(subId);
        studentId = serviceRes.data.iD_Student;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setServiceNotFound(true);
        } else {
          console.error("فشل في جلب بيانات الخدمة:", error);
        }
        return;
      }

      // باقي الطلبات بعد التأكد من وجود الخدمة
      try {
        // ثانياً: جلب بيانات الطالب
        const personalRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Student_/GET_INFO_FROM_STUDENT_UNVIRSTY_PERSON_USED_SHOW_SERVES_BY_ID_STUDENT${studentId}`
        );
        setPersonalInfo(personalRes.data);

        // ثالثاً: جلب اسم الخدمة الرئيسية
        const mainNameRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/ Name_Serves/GET_SERVES ${mainId}`
        );
        setMainServiceName(mainNameRes.data.name_Serves);

        // رابعاً: جلب اسم الخدمة الفرعية
        const subNameRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Branch_Serves/GET_BRANCH_SERVES_BY_ID ${subId}`
        );
        setSubServiceName(subNameRes.data.name);

        // خامساً: جلب الصور
        const imgRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Imege/GET_ALL_IMEGES_BY_ID_SERVES ${serviceRecordId}`
        );
        setImages(Array.isArray(imgRes.data) ? imgRes.data : []);

        // سادساً: جلب التقييم
        const ratingRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Rating/Get_Avrge_Rating_Sarves_By_Id_Student ${studentId}`
        );
        setRating(ratingRes.data);

        // سابعاً: جلب التعليقات
        const commentsRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Rating/Get_Ratings_By_Student_ID${studentId}`
        );
        setComments(commentsRes.data);
      } catch (error) {
        console.error("فشل في تحميل البيانات:", error);
      }
    };

    fetchData();
  }, [currentId]);

  if (serviceNotFound) {
    return (
      <div className="service-warning-container">
        <div className="service-warning-card">
          <h2>تنبيه</h2>
          <p>لا يوجد لديك خدمة ليتم عرضها</p>
        </div>
      </div>
    );
  }

  if (!personalInfo || !serviceInfo)
    return <div className="show-info-container">جاري التحميل...</div>;

  return (
    <div className="show-info-container">
      <div className="steps-navigation labeled">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className="step-item"
            onClick={() => setActiveStep(step)}
          >
            <div className={`circle ${activeStep === step ? "active" : ""}`}>
              {step}
            </div>
            <span className="step-label">
              {
                { 1: "معلومات الخدمة", 2: "المعلومات الشخصية", 3: "التقييم" }[
                  step
                ]
              }
            </span>
          </div>
        ))}
      </div>

      {activeStep === 1 && (
        <>
          <h2>معلومات الخدمة</h2>
          <div className="main-image-wrapper">
            <img src={images[0]?.imeg_Url || ""} alt="الصورة الرئيسية" />
          </div>

          {(() => {
            const Icon = iconMap[mainServiceName?.trim()] || ChevronLeft;
            return (
              <div className="service-title-center with-icon">
                <Icon size={32} />
                <span>{serviceInfo?.service_Address || ""}</span>
              </div>
            );
          })()}

          <div className="service-info-grid">
            <div className="info-item">
              <label><i className="fas fa-layer-group"></i> الخدمة الرئيسية:</label>
              <div className="info-value-box">
                {mainServiceName} 
              </div>
            </div>
            <div className="info-item">
              <label><i className="fas fa-project-diagram"></i> الخدمة الفرعية:</label>
              <div className="info-value-box">
                {subServiceName} 
              </div>
            </div>
            <div className="info-item">
              <label><i className="fas fa-dollar-sign"></i> السعر:</label>
              <div className="info-value-box">{serviceInfo?.price || ""}</div>
            </div>
       
            <div className="info-item">
              <label><i className="fas fa-link"></i> رابط معاينة الخدمة:</label>
              <div className="info-value-box">
                <a
                  href={serviceInfo?.preview_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preview-button"
                >
                  <i className="fas fa-eye"></i> عرض المعاينة
                </a>
              </div>
            </div>
            <div className="info-item">
              <label><i className="fas fa-truck"></i> طريقة التسليم:</label>
              <div className="info-value-box">{serviceInfo?.description_works || ""}</div>
            </div>
            <div className="info-item">
              <label><i className="fas fa-star"></i> مميزات الخدمة:</label>
              <div className="info-value-box">{serviceInfo?.service_Features || ""}</div>
            </div>     <div className="info-item full-width">
              <label><i className="fas fa-info-circle "></i> وصف الخدمة:</label>
              <div className="info-value-box">{serviceInfo?.service_Description || ""}</div>
            </div>
          </div>

          {images.length > 1 && (
            <>
              <h3 className="section-title">صور إضافية</h3>
              <div className="extra-images-grid">
                {images.slice(1, 4).map((img, index) => (
                  <img
                    key={index}
                    src={img.imeg_Url}
                    alt={`صورة ${index + 2}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {activeStep === 2 && (
        <>
          <h2 className="service-title-center with-icon">
            <i className="fas fa-id-card"></i> المعلومات الشخصية
          </h2>
          <div className="personal-info-section">
            <div className="personal-image">
              <img
                src={personalInfo?.mainImageUrl || ""}
                alt="الصورة الشخصية"
              />
            </div>
            <div className="personal-details">
              <div className="info-item">
                <label><i className="fas fa-user"></i> الاسم الكامل:</label>
                <div className="info-value-box">
                  {personalInfo?.fullName || ""}
                </div>
              </div>
              <div className="info-item">
                <label><i className="fas fa-envelope"></i> البريد الإلكتروني:</label>
                <div className="info-value-box">
                  {personalInfo?.email || ""}
                </div>
              </div>
              <div className="info-item">
                <label><i className="fas fa-graduation-cap"></i> التخصص الجامعي:</label>
                <div className="info-value-box">
                  {personalInfo?.universityMajor || ""}
                </div>
              </div>
              <div className="info-item">
                <label><i className="fas fa-university"></i> اسم الجامعة:</label>
                <div className="info-value-box">
                  {personalInfo?.universityName || ""}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeStep === 3 && (
        <>
          <h2>التقييم</h2>
          {rating !== null && (
            <div className="rating-box enhanced-rating" dir="ltr">
              <div className="rating-circle">
                {parseFloat(rating).toFixed(1)}
              </div>
              <div className="rating-label">متوسط التقييمات </div>
              <Rating
                name="read-only"
                value={parseFloat(rating)}
                precision={0.5}
                readOnly
                sx={{ direction: 'ltr' }}
                icon={
                  <StarIcon style={{ color: "#fbc02d" }} fontSize="inherit" />
                }
                emptyIcon={
                  <StarBorderIcon
                    style={{ color: "#ccc" }}
                    fontSize="inherit"
                  />
                }
              />
            </div>
          )}
          <hr className="separator-line" />
          <div className="comments-section">
            <h3>التعليقات</h3>
            {comments.length > 0 ? (
              comments.map((c, idx) => (
                <div className="comment-item" key={idx}>
                  <p className="comment-text-show">{c.comment_Text || c.comment}</p>
                  <div className="comment-rating">
                    <Rating
                      name={`rating-${idx}`}
                      value={c.rating}
                      readOnly
                      precision={0.5}
                      sx={{ direction: 'ltr' }}
                      icon={<StarIcon style={{ color: "#fbc02d" }} fontSize="inherit" />}
                      emptyIcon={<StarBorderIcon style={{ color: "#ccc" }} fontSize="inherit" />}
                    />
                  </div>
                  
                </div>
              ))
            ) : (
              <p>لا توجد تعليقات بعد.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomShowInfo;
