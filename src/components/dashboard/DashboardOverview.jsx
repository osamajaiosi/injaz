import React, { useEffect, useState } from "react";
import { studentProfileApi } from "../../api/studentProfileApi";
import "./DashboardOverview.css";

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const courseDataResponse = await studentProfileApi.getCourseData();
        const tasksResponse = await studentProfileApi.getUpcomingTasks();
        
        setCourseData(courseDataResponse);
        setUpcomingTasks(tasksResponse);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى لاحقاً.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return <div className="loading-indicator">جاري التحميل...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-overview">
      <h2>لوحة التحكم</h2>
      <div className="dashboard-grid">
        <DashboardCard 
          icon="fa-graduation-cap" 
          title="المواد الدراسية" 
          value={courseData?.total || 0} 
        />
        <DashboardCard 
          icon="fa-tasks" 
          title="الواجبات" 
          value={courseData?.homework || 0} 
        />
        <DashboardCard 
          icon="fa-check-circle" 
          title="المهام المكتملة" 
          value={courseData?.completedTasks || 0} 
        />
      </div>
      
      <div className="upcoming-activities">
        <h3>المهام القادمة</h3>
        {upcomingTasks.length > 0 ? (
          <ul className="activities-list">
            {upcomingTasks.map((task) => (
              <li key={task.id}>
                <div className="activity-date">{task.date}</div>
                <div className="activity-content">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-tasks-message">لا توجد مهام قادمة حالياً</p>
        )}
      </div>
    </div>
  );
};

// DashboardCard subcomponent
const DashboardCard = ({ icon, title, value }) => (
  <div className="dashboard-card">
    <div className="card-icon">
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="card-content">
      <h3>{title}</h3>
      <p className="card-number">{value}</p>
    </div>
  </div>
);

export default DashboardOverview;