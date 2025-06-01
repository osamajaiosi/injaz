import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import {
  BookOpen,
  PenTool,
  Code,
  Calendar,
  Heart,
  Stethoscope,
  Home,
  ShoppingCart,
  Globe,
  Truck,
  Users,
  ChevronLeft,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./OrdersInbox.css";

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

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [requesterInfo, setRequesterInfo] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const { idStudent: studentProviderId } = useAuth();

  useEffect(() => {
    axios
      .get(
        `http://eallaenjazapi.runasp.net/api/Request_Order/GET_INFO_REQUEST_ORDER_BY_ID_REQUEST_ORDER${id}`
      )
      .then((res) => {
        setOrderDetails(res.data);
        const personId = res.data?.iD_pesron_Presenter_Order;
        if (personId) {
          axios
            .get(
              `http://eallaenjazapi.runasp.net/api/Person/GET_PERSON_PY_ID${personId}`
            )
            .then((res) => setRequesterInfo(res.data));
        }
      })
      .catch((err) => console.error("فشل في جلب الطلب:", err));
  }, [id]);

  const handleAcceptOrder = async () => {
    if (accepted) return;
    setAccepted(true);
    try {
      console.log(id);
      await axios.post(
        `http://eallaenjazapi.runasp.net/api/Orders/Accept_Request_orders_And_Add_Orders${id},${studentProviderId}`,
        {},
        {
          headers: {
            Accept: "text/plain",
          },
        }
      );

      toast.success("✅ تم قبول الطلب بنجاح", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          fontFamily: "Cairo, sans-serif",
          fontSize: "1rem",
          direction: "rtl",
        },
        onClose: () => navigate("/orders-inbox"),
      });
    } catch (error) {
      toast.error("❌ حدث خطأ أثناء قبول الطلب", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeButton: false,

        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          fontFamily: "Cairo, sans-serif",
          fontSize: "1rem",
          direction: "rtl",
        },
      });
    }
  };

  return (
    <div className="add-service-container">
      <h2 className="section-title-main">تفاصيل الطلب </h2>

      <div className="order-details-section fade">
        <div className="steps-navigation labeled">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className="step-item"
              onClick={() => setActiveStep(stepNum)}
            >
              <div
                className={`circle ${activeStep === stepNum ? "active" : ""}`}
              >
                {stepNum}
              </div>
              <span className="step-label">
                {stepNum === 1 && "معلومات الطلب"}
                {stepNum === 2 && "معلومات طالب الخدمة"}
                {stepNum === 3 && "قبول الطلب"}
              </span>
            </div>
          ))}
        </div>

        {activeStep === 1 && orderDetails && (
          <div className="step-content">
            <h3 className="section-title">معلومات الطلب</h3>
            {(() => {
              const Icon =
                iconMap[orderDetails.name_Serves?.trim()] || ChevronLeft;
              return (
                <div className="service-title-center with-icon">
                  <Icon size={24} color="#00a300" />
                  <span>{orderDetails.titel_serves}</span>
                </div>
              );
            })()}
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">
                  <i className="fas fa-layer-group icon"></i> الخدمة الرئيسية:
                </span>
                <span className="detail-value">{orderDetails.name_Serves}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <i className="fas fa-sitemap icon"></i> الخدمة الفرعية:
                </span>
                <span className="detail-value">
                  {orderDetails.branch_Serves}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <i className="fas fa-coins icon"></i> السعر:
                </span>
                <span className="detail-value">{orderDetails.price} دينار</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <i className="fas fa-clock icon"></i> الوقت المطلوب:
                </span>
                <span className="detail-value">
                  {orderDetails.delivery_time}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <i className="fas fa-globe icon"></i> طريقة التقديم:
                </span>
                <span className="detail-value">
                  {orderDetails.type_serves === "Online" ? "عن بعد" : "وجاهيا"}
                </span>
              </div>

              {orderDetails.type_serves !== "Online" && (
                <div className="detail-item">
                  <span className="detail-label">
                    <i className="fas fa-map-marker-alt icon"></i> الموقع:
                  </span>
                  <span className="detail-value">{orderDetails.location}</span>
                </div>
              )}

              <div className="detail-item">
                <span className="detail-label">
                  <i className="fas fa-calendar-alt icon"></i> تاريخ الطلب:
                </span>
                <span className="detail-value">
                  {new Date(orderDetails.dtae_Order).toLocaleDateString(
                    "ar-EG"
                  )}
                </span>
              </div>

              {orderDetails.files?.trim() && (
                <div className="detail-item full">
                  <span className="detail-label">
                    <i className="fas fa-paperclip icon"></i> الملف المرفق:
                  </span>
                  <a
                    className="file-download-link"
                    href={orderDetails.files}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fas fa-paperclip"></i> تحميل الملف
                  </a>
                </div>
              )}

              <div className="detail-item">
                <span className="detail-label">
                  <i className="fas fa-info-circle icon"></i> تفاصيل إضافية:
                </span>
                <span className="detail-value">
                  {orderDetails.describtion_Serves}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && requesterInfo && (
          <div className="step-content">
            <h3 className="section-title">معلومات طالب الخدمة</h3>
            <div className="details-grid">
              <div className="detail-item">
                <img
                  src={requesterInfo.main_Imege_Url}
                  alt="الصورة الشخصية"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/avatar/avatar.png";
                  }}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <i className="fas fa-user icon"></i> الاسم الكامل:
                </span>
                <span className="detail-value">
                  {(requesterInfo.f_name || "") +
                    " " +
                    (requesterInfo.l_name || "")}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <i className="fas fa-venus-mars icon"></i> الجنس:
                </span>
                <span className="detail-value">
                  {requesterInfo.gender === "M" ? "ذكر" : "أنثى"}
                </span>
              </div>
              {requesterInfo.personal_profile && (
                <div className="detail-item">
                  <span className="detail-label">
                    <i className="fas fa-id-badge icon"></i> نبذة شخصية:
                  </span>
                  <span className="detail-value">
                    {requesterInfo.personal_profile}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="step-content">
            <h3 className="section-title">قبول أو رفض الطلب</h3>
            <div className="review-buttons">
              <button
                className="select-button"
                onClick={handleAcceptOrder}
                disabled={accepted}
              >
                <i className="fas fa-check-circle icon"></i> قبول الطلب
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Toast container */}
      <ToastContainer />
    </div>
  );
};

export default OrderDetailsPage;
