import React, { useEffect, useState } from "react";
import { studentServicesApi } from "../../api/studentServicesApi";
import "./ServicesSection.css";

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const servicesData = await studentServicesApi.getServices();
        setServices(servicesData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch services", err);
        setError("فشل في تحميل الخدمات. يرجى المحاولة مرة أخرى لاحقاً.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleAddService = () => {
    // In a real app, this would open a modal or navigate to a service selection page
    alert("سيتم توجيهك إلى صفحة إضافة خدمة جديدة");
  };

  return (
    <div className="services-section">
      <div className="section-header">
        <h2>خدماتي</h2>
        <button className="btn btn-primary" onClick={handleAddService}>
          إضافة خدمة جديدة
        </button>
      </div>
      <p>يمكنك هنا إدارة الخدمات التي اشتركت بها.</p>

      {loading ? (
        <div className="loading-indicator">جاري تحميل الخدمات...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : services.length > 0 ? (
        <div className="services-table">
          <div className="table-header">
            <div>اسم الخدمة</div>
            <div>تاريخ الاشتراك</div>
            <div>الحالة</div>
            <div>الإجراءات</div>
          </div>
          {services.map((service) => (
            <div key={service.id} className="table-row">
              <div>{service.name}</div>
              <div>{service.subscriptionDate}</div>
              <div>
                <span className={`status-badge ${service.status === "نشط" ? "active" : "inactive"}`}>
                  {service.status}
                </span>
              </div>
              <div>
                <button className="btn btn-small" onClick={() => handleServiceDetails(service.id)}>
                  تفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-layer-group fa-3x"></i>
          <p>لا توجد خدمات مسجلة حالياً</p>
          <button className="btn btn-primary" onClick={handleAddService}>
            إضافة خدمة جديدة
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function for service details
const handleServiceDetails = (serviceId) => {
  // In a real app, this would open a modal or navigate to service details
  alert(`عرض تفاصيل الخدمة رقم ${serviceId}`);
};

export default ServicesSection;