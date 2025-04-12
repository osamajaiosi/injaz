import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { Link } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  const { userType } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Redirect if not a student
  if (userType !== "student") {
    return (
      <div className="unauthorized-message">
        <h2>غير مصرح بالوصول</h2>
        <p>هذه الصفحة متاحة فقط للطلاب</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">
            <img src="/avatar/avatar.png" alt="صورة المستخدم" />
          </div>
          <h3>مرحبا، أحمد</h3>
          <span className="user-role">طالب</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={activeTab === "dashboard" ? "active" : ""}>
              <button onClick={() => setActiveTab("dashboard")}>
                <i className="fas fa-home"></i>
                <span>لوحة التحكم</span>
              </button>
            </li>
            <li className={activeTab === "services" ? "active" : ""}>
              <button onClick={() => setActiveTab("services")}>
                <i className="fas fa-book"></i>
                <span>خدماتي</span>
              </button>
            </li>
            <li className={activeTab === "requests" ? "active" : ""}>
              <button onClick={() => setActiveTab("requests")}>
                <i className="fas fa-tasks"></i>
                <span>الطلبات</span>
              </button>
            </li>
            <li className={activeTab === "messages" ? "active" : ""}>
              <button onClick={() => setActiveTab("cards")}>
                <i className="fas fa-envelope"></i>
                <span>بطاقاتي</span>
              </button>
            </li>
            <li className={activeTab === "messages" ? "active" : ""}>
              <button onClick={() => setActiveTab("messages")}>
                <i className="fas fa-envelope"></i>
                <span>مبيعاتي</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="dashboard-content">
        {activeTab === "dashboard" && (
          <div className="dashboard-overview">
            <h2>لوحة التحكم</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="card-content">
                  <h3>المواد الدراسية</h3>
                  <p className="card-number">5</p>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">
                  <i className="fas fa-tasks"></i>
                </div>
                <div className="card-content">
                  <h3>الواجبات</h3>
                  <p className="card-number">3</p>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="card-content">
                  <h3>المهام المكتملة</h3>
                  <p className="card-number">12</p>
                </div>
              </div>
            </div>

            <div className="upcoming-activities">
              <h3>المهام القادمة</h3>
              <ul className="activities-list">
                <li>
                  <div className="activity-date">15 أبريل</div>
                  <div className="activity-content">
                    <h4>تسليم مشروع الفيزياء</h4>
                    <p>تجربة فيزيائية عملية</p>
                  </div>
                </li>
                <li>
                  <div className="activity-date">20 أبريل</div>
                  <div className="activity-content">
                    <h4>اختبار الرياضيات</h4>
                    <p>الوحدة الثالثة - المعادلات التفاضلية</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="services-section">
            <h2>خدماتي</h2>
            <p>يمكنك هنا إدارة الخدمات التي اشتركت بها.</p>
            <button className="btn btn-primary">إضافة خدمة جديدة</button>

            <div className="services-table">
              <div className="table-header">
                <div>اسم الخدمة</div>
                <div>تاريخ الاشتراك</div>
                <div>الحالة</div>
                <div>الإجراءات</div>
              </div>
              <div className="table-row">
                <div>المساعدة في الواجبات</div>
                <div>10 أبريل 2025</div>
                <div>نشط</div>
                <div>
                  <button className="btn btn-small">تفاصيل</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="requests-section">
            <h2>طلباتي</h2>
            <p>هنا يمكنك متابعة حالة طلباتك</p>

            <div className="empty-state">
              <i className="fas fa-inbox fa-3x"></i>
              <p>لا توجد طلبات حالية</p>
              <button className="btn btn-primary">إنشاء طلب جديد</button>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="messages-section">
            <h2>الرسائل</h2>
            <div className="messages-container">
              <div className="message-item unread">
                <div className="message-sender">أحمد السيد (مشرف)</div>
                <div className="message-preview">
                  مرحباً، هل يمكنك مراجعة التقرير الأخير؟
                </div>
                <div className="message-time">منذ ساعتين</div>
              </div>
              <div className="message-item">
                <div className="message-sender">سارة محمد (معلم)</div>
                <div className="message-preview">
                  تم تحديث موعد الاختبار القادم
                </div>
                <div className="message-time">5 أبريل</div>
              </div>
            </div>
          </div>
        )}

{activeTab === "cards" && (
  <div className="cards-section">
    <h2>بطاقاتي</h2>
    <div className="student-card">
      <div className="card-header">
        <i className="fas fa-id-card fa-2x"></i>
        <h3>بطاقة الطالب</h3>
      </div>
      <div className="card-details">
        <p><strong>الاسم:</strong> أحمد محمد</p>
        <p><strong>رقم البطاقة:</strong> 123234345</p>
        <p><strong>الكلية:</strong> كلية الهندسة</p>
        <p><strong>القسم:</strong> قسم الكهرباء</p>
        <p><strong>المرحلة:</strong> الثالثة</p>
        <p><strong>الحالة:</strong> فعالة</p>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default StudentDashboard;
