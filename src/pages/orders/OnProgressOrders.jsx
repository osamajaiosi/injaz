import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OrdersInbox.css";

const OnProgressOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const personid = 1; // TODO: replace with actual logged-in student ID

  useEffect(() => {
    axios
      .get(
        `http://eallaenjazapi.runasp.net/api/Orders/GET_LIST_ID_ORDERS_In_PROGGRES_BY_ID_Person${personid}`
      )
      .then((res) => {
        setOrders(res.data.sort((a, b) => a - b));
      })
      .catch((err) => console.error(
        "فشل في جلب الطلبات الجاري العمل عليها للطالب:",
        err
      ));
  }, []);

  const handleOrderSelect = (orderId) => {
    navigate(`/in-progress-orders-details/${orderId}`);
  };

  return (
    <div className="add-service-container">
      <h2 className="section-title-main">طلبات جاري العمل عليها لطالب الخدمة</h2>
      <div className="orders-section">
        <div className="orders-grid">
          {orders.map((orderId, index) => (
            <div
              key={orderId}
              className="order-card-modern"
              onClick={() => handleOrderSelect(orderId)}
            >
              <div className="order-icon">
                <i className="fas fa-spinner"></i>
              </div>
              <span>طلب {index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnProgressOrders;
