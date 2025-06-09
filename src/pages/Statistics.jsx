import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import "../components/dashboard/Statistics.css";

const Statistics = () => {
  const { idStudent } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = `http://eallaenjazapi.runasp.net/api/Student_/ADMIN_GET_ALL_INFO_statistics_By_Id_Student${idStudent}`;
        const { data } = await axios.get(url);
        setStats(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (idStudent) fetchStats();
  }, [idStudent]);

  if (loading) return <div className="stats-loading">Loading...</div>;
  if (error || !stats) return <div className="stats-error">Error loading statistics.</div>;

  const cards = [
    { title: "إجمالي الطلبات", value: stats.totalOrders },
    { title: "الطلبات الواردة", value: stats.totalRequests },
    { title: "طلبات مكتملة", value: stats.completedOrders },
    { title: "طلبات قيد التنفيذ", value: stats.in_progeers_Orders },
    { title: "إجمالي الشكاوى", value: stats.totalComplaints },
    { title: "صافي الربح الاجمالي (دينار)", value: stats.totalAmount },
    { title: "صافي الربح هذا الشهر (دينار)", value: stats.amountThisMonth },
  ];
  const [primaryCard, ...otherCards] = cards;

  return (
    <div className="statistics-page">
      <h2 className="section-title">
        الإحصائيات العامة <i className="fas fa-chart-bar title-icon" />
      </h2>
      <div className="primary-stats">
        <div className="stats-card primary-card">
          <div className="card-title">{primaryCard.title}</div>
          <div className="card-value">{primaryCard.value}</div>
        </div>
      </div>
      <div className="stats-cards">
        {otherCards.map((card) => (
          <div key={card.title} className="stats-card">
            <div className="card-title">{card.title}</div>
            <div className="card-value">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
