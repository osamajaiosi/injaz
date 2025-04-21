// import React from "react";
import PropTypes from "prop-types";
import ReviewList from "./control-pages/ReviewList";
import { useEffect, useState } from "react";
import axios from "axios";

const DashboardContent = ({ activeTab }) => {
  // ✅ الهوكس لازم تكون فوق
  const [reviews, setReviews] = useState([
    {
      id: 1,
      comment: "خدمة ممتازة وسريعة 👌",
      rating: 5,
    },
    {
      id: 2,
      comment: "المراجعة كانت مفيدة ولكن تأخرت.",
      rating: 4,
    },
  ]);
  const [loading, setLoading] = useState(false); // false لأننا نستخدم بيانات وهمية مؤقتًا

  // ✅ مهيأ للـ API لاحقًا
  // useEffect(() => {
  //   setLoading(true);
  //   axios
  //     .get("https://your-api.com/reviews")
  //     .then((response) => {
  //       setReviews(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("فشل في جلب المراجعات", error);
  //       setLoading(false);
  //     });
  // }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "services-add":
        return (
          <div className="content-section">
            <h2>add خدمة</h2>
            <p>أدخل بيانات الخدمة الجديدة هنا.</p>
          </div>
        );
      case "services-edit":
        return (
          <div className="content-section">
            <h2>تعديل خدمة</h2>
            <p>اختر الخدمة لتعديل تفاصيلها.</p>
          </div>
        );
      case "services-delete":
        return (
          <div className="content-section">
            <h2>حذف خدمة</h2>
            <p>اختر الخدمة التي تريد حذفها.</p>
          </div>
        );
      case "services-view":
        return (
          <div className="content-section">
            <h2>عرض الخدمات</h2>
            <p>جميع خدماتك الحالية تظهر هنا.</p>
          </div>
        );
      case "underworking":
        return (
          <div className="content-section">
            <h2>طلبات قيد التنفيذ</h2>
            <p>لا توجد طلبات حالياً.</p>
          </div>
        );
      case "completed":
        return (
          <div className="content-section">
            <h2>طلبات مكتملة</h2>
            <p>قائمة بجميع الطلبات التي اكتملت.</p>
          </div>
        );
      case "cancelled":
        return (
          <div className="content-section">
            <h2>طلبات ملغاة</h2>
            <p>الطلبات التي تم إلغاؤها.</p>
          </div>
        );
      case "cards":
        return (
          <div className="cards-section content-section">
            <h2>بطاقاتي</h2>
            <div className="student-card">
              <div className="card-header">
                <i className="fas fa-id-card fa-2x"></i>
                <h3>بطاقة الطالب</h3>
              </div>
              <div className="card-details">
                <p>
                  <strong>الاسم:</strong> أحمد محمد
                </p>
                <p>
                  <strong>رقم البطاقة:</strong> 123234345
                </p>
                <p>
                  <strong>الكلية:</strong> كلية الهندسة
                </p>
                <p>
                  <strong>القسم:</strong> قسم الكهرباء
                </p>
                <p>
                  <strong>المرحلة:</strong> الثالثة
                </p>
                <p>
                  <strong>الحالة:</strong> فعالة
                </p>
              </div>
            </div>
          </div>
        );

      // التقييمات والمراجعات
      case "sales-diagnostics":
        return (
          <div className="content-section">
            <h2 className="section-title">
              <span className="title-icon">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="#f6b800"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2l2.9 6h6.1l-4.95 4.25L17.8 20 12 16.5 6.2 20l1.75-7.75L3 8h6.1z" />
                </svg>
              </span>
              التقييم والمراجعات
            </h2>

            <ReviewList reviews={reviews} />
          </div>
        );

      case "sales-stats":
        return (
          <div className="content-section">
            <h2>إحصائيات</h2>
            <p>12 خدمة مكتملة | 1500 ريال إجمالي المبيعات</p>
          </div>
        );
      default:
        return (
          <div className="content-section welcome">
            <h2>مرحبا بك في لوحة التحكم</h2>
            <p>يرجى اختيار قسم من القائمة الجانبية للبدء</p>
          </div>
        );
    }
  };

  return <div className="dashboard-content">{renderContent()}</div>;
};

DashboardContent.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default DashboardContent;
