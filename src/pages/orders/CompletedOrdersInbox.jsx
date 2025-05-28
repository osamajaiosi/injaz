import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import "./OrdersInbox.css"; // إعادة استخدام نفس التنسيق

const CompletedOrdersInbox = () => {
  const { idStudent: studentId } = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (studentId == null) return;
    axios
      .get(
        `http://eallaenjazapi.runasp.net/api/Orders/GET_LIST_ID_ORDER_complemnt_BY_ID_STUDENT${studentId}`
      ) // استبدل هذا بالرابط الصحيح
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("فشل في جلب الطلبات المكتملة:", err));
  }, [studentId]);
  console.log("studentid= ",studentId);

  const handleSelectOrder = (id) => {
    navigate(`/completed-orders/${id}`);
  };

  return (
    <div className="add-service-container">
      <h2 className="section-title-main">الطلبات المكتملة</h2>
      <div className="orders-section">
        <div className="orders-grid">
          {orders.map((orderId, index) => (
            <div
              key={orderId}
              className="order-card-modern"
              onClick={() => handleSelectOrder(orderId)}
            >
              <div className="order-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <span>طلب {index + 1}</span>
              <div className="status-dot green"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedOrdersInbox;
