import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import "./OrdersInbox.css";

const OnProgress = () => {
  const [orders, setOrders] = useState([]);
  const [clickedOrders, setClickedOrders] = useState([]);
  const navigate = useNavigate();
  const { idStudent: studentId } = useAuth();

  useEffect(() => {
    if (studentId == null) return;
    // تحميل الطلبات التي تم النقر عليها سابقاً
    const saved = JSON.parse(localStorage.getItem("clickedProgressOrders")) || [];
    setClickedOrders(saved);
    axios
      .get(
        `http://eallaenjazapi.runasp.net/api/Orders/GET_LIST_ID_ORDERS_In_progress_BY_ID_STUDENT${studentId}`
      )
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("فشل في جلب الطلبات الجاري العمل عليها:", err));
  }, [studentId]);
  console.log("studentid= ",studentId);

  const handleSelectOrder = (id) => {
    let updated = clickedOrders;
    if (!clickedOrders.includes(id)) {
      updated = [...clickedOrders, id];
      setClickedOrders(updated);
      localStorage.setItem("clickedProgressOrders", JSON.stringify(updated));
    }
    navigate(`/in-progress-orders/${id}`);
  };

  return (
    <div className="add-service-container">
      <h2 className="section-title-main">طلبات جاري العمل عليها</h2>
      <div className="orders-section">
        <div className="orders-grid">
          {orders.map((orderId, index) => (
            <div
              key={orderId}
              className="order-card-modern"
              onClick={() => handleSelectOrder(orderId)}
            >
              <div className="order-icon">
                <i className="fas fa-spinner"></i>
              </div>
              <span>طلب {index + 1}</span>
              <div className={`status-dot ${clickedOrders.includes(orderId) ? 'green' : 'yellow'}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnProgress;