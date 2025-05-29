import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../Contexts/AuthContext";
import './OrdersInbox.css'; // reuse styles

const StudentCompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { idPerson } = useAuth();

  useEffect(() => {
    axios
      .get(`http://eallaenjazapi.runasp.net/api/Orders/GET_LIST_ID_ORDER_complemnt_BY_ID_PERSON${idPerson}`)
      .then((res) => setOrders(res.data.sort((a, b) => a - b)))
      .catch((err) => console.error('فشل في جلب الطلبات المكتملة للطالب:', err));
  }, [idPerson]);

  const handleSelectOrder = (orderId) => {
    navigate(`/student-completed-orders/${orderId}`);
  };

  return (
    <div className="add-service-container">
      <h2 className="section-title-main">الطلبات المكتملة للطالب</h2>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentCompletedOrders;
