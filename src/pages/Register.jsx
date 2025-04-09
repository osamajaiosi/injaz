import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ChevronLeft, BookOpen, Brush, Code, Briefcase } from "lucide-react";
import axios from "axios";
import "./Services.css";

const iconMap = {
  تعليمة: BookOpen,
  ابداعية: Brush,
  تقنية: Code,
  مهنية: Briefcase,
};

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://eallaenjazapi.runasp.net/api/ Name_Serves/GET_ALL_NAME_SERVES"
        ); // استبدل بالرابط الصحيح
        setServices(response.data);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="services-section">
      <div className="services-container">
        <div className="section-header">
          <h2>خدماتنا المميزة</h2>
          <p>مجموعة متنوعة من الخدمات المقدمة من طلاب متميزين</p>
        </div>

        {loading ? (
          <p>جاري تحميل البيانات...</p>
        ) : (
          <div className="services-grid">
            {services.map((service) => {
              const IconComponent = iconMap[service.name_Serves] || ChevronLeft; // أيقونة افتراضية
              return (
                <div key={service.id} className="service-card">
                  <div className="service-icon">
                    <IconComponent size={24} />
                  </div>
                  <h3>{service.name_Serves}</h3>
                  <Link to={`/services/${service.id}`} className="service-link">
                    اكتشف المزيد <ChevronLeft size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <div className="view-all-container">
          <Link to="/services" className="view-all-btn">
            عرض جميع الخدمات
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
