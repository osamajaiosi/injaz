import { useEffect, useState } from "react";
import "./CardInfo.css";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";

const CardInfo = () => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { idPerson } = useAuth();

  useEffect(() => {
    if (idPerson == null) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Cradt_Card/GET_CRADET_CARD_BY_ID_Person?ID_Person=${idPerson}`
        );
        setCardData(response.data);
      } catch (error) {
        console.error("خطأ بجلب معلومات البطاقة:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idPerson]);

  if (loading) {
    return <div className="loading">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="card-wrapper">
      <div className="card">
        <h2 className="card-title">
          <span role="img" aria-label="card">
            💳
          </span>{" "}
          معلومات البطاقة
        </h2>
        <div className="card-field">
          <label>الاسم:</label>
          <span>{cardData.full_name}</span>
        </div>
        <div className="card-field">
          <label>البريد الإلكتروني:</label>
          <span>{cardData.email}</span>
        </div>
        <div className="card-field">
          <label>رقم البطاقة:</label>
          <span>{cardData.number_Card}</span>
        </div>
      
        <div className="card-field">
          <label>الرصيد:</label>
          <span>{cardData.palnce} دينار </span>
        </div>

        <div className="card-field">
          <label>تاريخ الانتهاء:</label>
          <span>{cardData.end_date}</span>
        </div>
        <div className="card-field">
          <label>رمز الأمان:</label>
          <span>{cardData.pin_Code}</span>
        </div>
        <div className="card-field status-row">
          <label>الحالة:</label>
          <span
            className={
              cardData.status_card === 1 ? "status-active" : "status-inactive"
            }
          >
            {cardData.status_card === 1 ? "نشطة" : "غير نشطة"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
