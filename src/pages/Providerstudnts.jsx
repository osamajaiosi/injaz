import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Providerstudnts.css";

const Providerstudents = () => {
  const { subServiceId } = useParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Serves_Student/Get_ALL_INFO_SAMPLE_STUDENT_PROVEDER_BRANCH_SERVER?id_branch_serves=${subServiceId}`
        );
        setProviders(response.data);
      } catch (error) {
        console.error("Error fetching providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [subServiceId]);

  if (loading) return <p>جاري تحميل البيانات...</p>;

  return (
    <section className="providers-section">
      <div className="providers-container">
        <div className="section-header">
          <h2>مزودي الخدمة</h2>
          <p>اختر من بين مزودي الخدمة المتاحين.</p>
        </div>

        <div className="providers-grid">
          {providers.length > 0 ? (
            providers.map((provider) => (
              <div key={provider.id} className="provider-card">
                <div className="provider-image">
                  <img
                    src={
                      provider.image ||
                      "/public/for-test-provider/software-developer-6521720-scaled.webp"
                    }
                    alt={provider.service_Address}
                  />
                </div>
                <div className="provider-info">
                  <h3>{provider.service_Address}</h3>
                  <p className="price">ابتداءً من {provider.price} ريال</p>
                  <p className="rating">التقييم: ⭐ {provider.avg_rating}</p>
                  <a
                    href={`/providerdetails/${provider.id}`}
                    className="provider-link"
                  >
                    المزيد
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="no-services">لا توجد بيانات لمزودي الخدمة.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Providerstudents;
