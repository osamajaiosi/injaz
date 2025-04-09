import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "axios";
import * as Lucide from "lucide-react";
import "./SubServicesPage.css";

// خريطة تطابق الخدمات الرئيسية مع الأيقونات الخاصة بهم
const iconMap = {
  1: Lucide.BookOpen, // تعليمة
  2: Lucide.PenTool, // ابداعية
  3: Lucide.Code, // تقنية
  4: Lucide.Calendar, // فعاليات
  5: Lucide.Heart, // الرعاية
  6: Lucide.Stethoscope, // الصحية
  7: Lucide.Home, // منزلية
  8: Lucide.ShoppingCart, // التسويق
  9: Lucide.Globe, // الترجمة
  10: Lucide.Truck, // النقل
  11: Lucide.Users, // متنوعة
  12: Lucide.Users, // مهنية
};

const SubServicesPage = () => {
  const { serviceName } = useParams(); // استخراج اسم الخدمة من الـ URL
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubServices = async () => {
      try {
        setLoading(true);

        // مابنج اسم الخدمة مع ID الخاص فيها
        const serviceMapping = {
          تعليمة: 1,
          ابداعية: 2,
          تقنية: 3,
          فعاليات: 4,
          الرعاية: 5,
          الصحية: 6,
          المنزلية: 7,
          التسويق: 8,
          الترجمة: 9,
          النقل: 10,
          متنوعة: 11,
          مهنية: 12,
        };

        const serviceId = serviceMapping[serviceName];

        if (serviceId) {
          const response = await axios.get(
            `http://eallaenjazapi.runasp.net/api/Branch_Serves/GET_ALL_BRANCH_SERVES_USING_ID_BRANCH_SERVES${serviceId}`,
            { headers: { accept: "text/plain" } }
          );

          setSubServices(response.data);
        } else {
          console.error("Invalid service name!");
        }
      } catch (error) {
        console.error("Error fetching sub-services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubServices();
  }, [serviceName]);

  if (loading) {
    return <p>جاري تحميل البيانات...</p>;
  }

  return (
    <section className="subservices-section">
      <div className="subservices-container">
        <div className="section-header">
          <h2>{serviceName}</h2>
          <p>اختر من بين مجموعة متنوعة من الخدمات الفرعية المتاحة.</p>
        </div>

        <div className="subservices-grid">
          {subServices.length > 0 ? (
            subServices.map((sub, index) => {
              const IconComponent = iconMap[sub.id_name_serves] || ChevronLeft;

              return (
                <div key={index} className="subservice-card">
                  <div className="subservice-icon">
                    <IconComponent size={24} />
                  </div>
                  <h3>{sub.name}</h3>
                  <p>{sub.description}</p>
                  <Link
                    to={`/providerstudents/${sub.id}`} // ✅ هنا التعديل المهم
                    className="subservice-link"
                  >
                    اظهار موزدين الخدمة <ChevronLeft size={16} />
                  </Link>
                </div>
              );
            })
          ) : (
            <p className="no-services">
              لا توجد خدمات فرعية متاحة لهذه الخدمة.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SubServicesPage;
