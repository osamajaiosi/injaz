import { useEffect, useState } from "react";
import "./CardInfo.css";

const CardInfo = () => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة جلب بيانات من API
    const fetchData = async () => {
      try {
        // لاحقًا: استبدل البيانات الثابتة بطلب فعلي
        const data = {
          number: "1234-5678-9012",
          issuedAt: "2024-01-01",
          expiresAt: "2027-01-01",
          status: "مفعلة",
        };

        // تأخير وهمي لمحاكاة تحميل البيانات
        setTimeout(() => {
          setCardData(data);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("فشل في جلب البيانات", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        جاري تحميل البيانات...
      </p>
    );
  }

  return (
    <div className="card-info-container">
      <h2 className="card-info-title">معلومات بطاقتي</h2>

      <div className="card-info-content">
        <div className="card-info-row">
          <span className="card-info-label">الاسم :</span>
          <span className="card-info-value">{cardData.issuedAt}</span>
        </div>
        <div className="card-info-row">
          <span className="card-info-label"> رقم البطاقه:</span>
          <span className="card-info-value">{cardData.number}</span>
        </div>

        <div className="card-info-row">
          <span className="card-info-label"> Iban:</span>
          <span className="card-info-value">{cardData.issuedAt}</span>
        </div>

        <div className="card-info-row">
          <span className="card-info-label">الرصيد :</span>
          <span className="card-info-value">{cardData.issuedAt}</span>
        </div>

        <div className="card-info-row">
          <span className="card-info-label">تاريخ الانتهاء:</span>
          <span className="card-info-value">{cardData.expiresAt}</span>
        </div>

        <div className="card-info-row">
          <span className="card-info-label">الحالة:</span>
          <span
            className={`card-info-value ${
              cardData.status === "مفعلة" ? "active" : "inactive"
            }`}
          >
            {cardData.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
