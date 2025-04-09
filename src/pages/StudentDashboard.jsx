import "./StudentDashboard.css";

function StudentDashboard() {
  return (
    <div className="dashboard-container">
      <h2>لوحة التحكم</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>خدماتي</h3>
          <p>اضف الخدمة الخاصة بك</p>
          <button className="btn btn-primary">إضافة خدمة </button>
        </div>
        <div className="dashboard-card">
          <h3>الطلبات</h3>
          <p>لا توجد طلبات حالية</p>
        </div>
        <div className="dashboard-card">
          <h3>الإحصائيات</h3>
          <ul>
            <li>عدد الخدمات المنجزة: 0</li>
            <li>عدد الطلبات : 0</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
