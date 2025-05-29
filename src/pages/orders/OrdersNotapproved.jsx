import { useState, useEffect } from 'react';
import axios from 'axios';
import "./OrdersInbox.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../Contexts/AuthContext";

const OrdersNotapproved = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { idPerson } = useAuth();

  useEffect(() => {
    // Fetch unapproved orders
    axios.get(`http://eallaenjazapi.runasp.net/api/Request_Order/GET_LIST_ID_REQUEST_ORDER_BY_ID_Person${idPerson}`)
      .then(response => {
        setOrders(response.data.sort((a, b) => a - b));
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, [idPerson]);

  const handleOrderSelect = (orderId) => navigate(`/orders-not-approved/${orderId}`);

  return (
    <div className="add-service-container">
      <h2 className="section-title-main">طلبات لم يتم الموافقة عليها</h2>
      <div className="orders-section">
        <div className="orders-grid">
          {orders.map((orderId, index) => (
            <div
              key={orderId}
              className="order-card-modern"
              onClick={() => handleOrderSelect(orderId)}
            >
              <div className="order-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <span>طلب {index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersNotapproved;
