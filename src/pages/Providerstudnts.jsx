import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
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
            providers.map((provider) => {
              console.log('provider obj:', provider);
              return (
                <div key={provider.id} className="provider-card">
                  <div className="provider-image">
                    <img
                      src={
                        provider.imege_url &&
                        provider.imege_url.startsWith("http")
                          ? provider.imege_url
                          : "/for-test-provider/software-developer-6521720-scaled.webp"
                      }
                      alt={provider.service_Address}
                    />
                  </div>
                  <div className="provider-info">
                    <h3>{provider.service_Address}</h3>
                    <p className="price">ابتداءً من {provider.price} دينار</p>
                    <div className="rating-box" dir="ltr">
                      <Rating
                        name="read-only"
                        value={parseFloat(provider.avg_rating)}
                        precision={0.5}
                        readOnly
                        sx={{ direction: 'ltr' }}
                        icon={<StarIcon style={{ color: "#fbc02d" }} fontSize="inherit" />}
                        emptyIcon={<StarBorderIcon style={{ color: "#ccc" }} fontSize="inherit" />}  
                      />
                    </div>
                    <Link
                      to={`/show-info/${provider.id}`}
                      className="provider-link"
                    >
                      المزيد
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-services">لا توجد بيانات لمزودي الخدمة.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Providerstudents;
