import { useEffect, useState } from "react";
import "./CardInfo.css";

const CardInfo = () => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        name: "أحمد محمد",
        number: "1234-5678-9012",
        expiresAt: "2027-01-01",
        iban: "SA1234567890123456789012",
        balance: "5,300 ر.س",
        status: "مفعلة",
      };

      setTimeout(() => {
        setCardData(data);
        setLoading(false);
      }, 500);
    };

    fetchData();
  }, []);

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
          <span>{cardData.name}</span>
        </div>
        <div className="card-field">
          <label>رقم البطاقة:</label>
          <span>{cardData.number}</span>
        </div>
        <div className="card-field">
          <label>IBAN:</label>
          <span>{cardData.iban}</span>
        </div>
        <div className="card-field">
          <label>الرصيد:</label>
          <span>{cardData.balance}</span>
        </div>

        <div className="card-field">
          <label>تاريخ الانتهاء:</label>
          <span>{cardData.expiresAt}</span>
        </div>
        <div className="card-field status-row">
          <label>الحالة:</label>
          <span
            className={
              cardData.status === "مفعلة" ? "status-active" : "status-inactive"
            }
          >
            {cardData.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
