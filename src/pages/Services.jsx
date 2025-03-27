import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  BookOpen,
  PenTool,
  Code,
  Calendar,
  Heart,
  Stethoscope,
  Home,
  ShoppingCart,
  Globe,
  Truck,
  Users,
} from "lucide-react";
import axios from "axios";
import "./Services.css";

// خريطة تطابق أسماء الخدمات مع الأيقونات
const iconMap = {
  تعليمة: BookOpen,
  ابداعية: PenTool,
  تقنية: Code,
  فعاليات: Calendar,
  الرعاية: Heart,
  الصحية: Stethoscope,
  المنزلية: Home,
  التسويق: ShoppingCart,
  الترجمة: Globe,
  النقل: Truck,
  متنوعة: Users,
  مهنية: Users,
};

const ServicesPage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get(
        "http://eallaenjazapi.runasp.net/api/ Name_Serves/GET_ALL_NAME_SERVES"
      )
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  return (
    <section className="services-section">
      <div className="services-container">
        <div className="section-header">
          <h2>خدماتنا المميزة</h2>
          <p>مجموعة متنوعة من الخدمات المقدمة من طلاب متميزين</p>
        </div>

        <div className="services-grid">
          {services.map((service) => {
            // تنظيف اسم الخدمة لإزالة المسافات الزائدة والتأكد من التطابق مع خريطة الأيقونات
            const serviceName = service.name_Serves.trim();
            const IconComponent = iconMap[serviceName] || ChevronLeft;

            return (
              <div key={service.id} className="service-card">
                <div className="service-icon">
                  <IconComponent size={24} />
                </div>
                <h3>{serviceName}</h3>
                <Link
                  to={`/services/${encodeURIComponent(serviceName)}`}
                  className="service-link"
                >
                  اكتشف المزيد <ChevronLeft size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
