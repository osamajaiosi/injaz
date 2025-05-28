import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import "./OrdersInbox.css";

const OrdersInbox = () => {
  const [orders, setOrders] = useState([]);
  const [clickedOrders, setClickedOrders] = useState([]);
  const navigate = useNavigate();
  const { idStudent: studentId } = useAuth();

  useEffect(() => {
    if (studentId == null) return;
    const savedClickedOrders =
      JSON.parse(localStorage.getItem("clickedOrders")) || [];
    setClickedOrders(savedClickedOrders);

    axios
      .get(
        `http://eallaenjazapi.runasp.net/api/Request_Order/GET_LIST_ID_REQUEST_ORDER_BY_ID_STUDENT${studentId}`
      )
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("فشل في جلب الطلبات:", err));
  }, [studentId]);
  console.log("studentid= ",studentId);

  const handleSelectOrder = (id) => {
    if (!clickedOrders.includes(id)) {
      const updated = [...clickedOrders, id];
      setClickedOrders(updated);
      localStorage.setItem("clickedOrders", JSON.stringify(updated));
    }

    navigate(`/orders/${id}`);
  };

  return (
    <div className="add-service-container">
      <h2 className="section-title-main">الطلبات الواردة</h2>
      <div className="orders-section">
        <div className="orders-grid">
          {orders.map((orderId, index) => (
            <div
              key={orderId}
              className="order-card-modern"
              onClick={() => handleSelectOrder(orderId)}
            >
              <div className="order-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <span>طلب {index + 1}</span>
              <div
                className={`status-dot ${
                  clickedOrders.includes(orderId) ? "green" : "yellow"
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersInbox;
