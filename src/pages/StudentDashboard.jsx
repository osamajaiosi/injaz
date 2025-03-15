import './StudentDashboard.css';

function StudentDashboard() {
  return (
    <div className="dashboard-container">
      <h2>لوحة التحكم</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>خدماتي</h3>
          <p>لا توجد خدمات مضافة</p>
          <button className="btn btn-primary">إضافة خدمة جديدة</button>
        </div>
        <div className="dashboard-card">
          <h3>الطلبات</h3>
          <p>لا توجد طلبات حالية</p>
        </div>
        <div className="dashboard-card">
          <h3>الإحصائيات</h3>
          <ul>
            <li>عدد الخدمات: 0</li>
            <li>عدد الطلبات: 0</li>
            <li>التقييم العام: -</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;