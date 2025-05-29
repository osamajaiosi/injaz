import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Providerstudnts.css";
import "./AddRequest.css";
import { Link } from "react-router-dom";
import Rating from "react-rating";
import "@fortawesome/fontawesome-free/css/all.min.css";

const StepTwo = ({ onNext, saveData, initialData }) => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [providers, setProviders] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState(
    initialData.selectedProviders || []
  );
  const [activeFilter, setActiveFilter] = useState("latest");
  const [errorMessage, setErrorMessage] = useState("");

  const branchId = initialData.subService;
  const locationId = initialData.locationId;
  const branchName = initialData.subServiceName || "الخدمة المختارة";

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const url = locationId
          ? `http://eallaenjazapi.runasp.net/api/Unvirsty/GET_ALL_UNVIRSTY_BY_ID_LOCATION?id_location=${locationId}`
          : "http://eallaenjazapi.runasp.net/api/Unvirsty/GET_ALL_UNVIRSTY";

        const res = await axios.get(url);
        setUniversities(res.data);

        if (res.data.length > 0) {
          const firstUniId = res.data[0].id.toString();
          setSelectedUniversity(firstUniId);
          fetchProviders("latest", firstUniId);
        }
      } catch (err) {
        console.error("فشل في جلب الجامعات", err);
      }
    };

    fetchUniversities();
  }, [locationId]);

  const fetchProviders = async (
    filterType,
    universityId = selectedUniversity
  ) => {
    if (!universityId) return;

    setActiveFilter(filterType);
    setProviders([]);

    let endpoint = "";
    switch (filterType) {
      case "latest":
        endpoint =
          "GET_SAMPLE_INFO_FROM_SERVER_STUDENT_BY_ID_Branch_serves_and_ID_Unvirsty_For_modern_services";
        break;
      case "oldest":
        endpoint =
          "GET_SAMPLE_INFO_FROM_SERVER_STUDENT_BY_ID_Branch_serves_and_ID_Unvirsty_For_Older_services";
        break;
      case "topRated":
        endpoint =
          "GET_SAMPLE_INFO_FROM_SERVER_STUDENT_BY_ID_Branch_serves_and_ID_Unvirsty_For_The_most_distinguished";
        break;
      default:
        return;
    }

    const url = `http://eallaenjazapi.runasp.net/api/Serves_Student/${endpoint}?id_branch_serves=${branchId}&id_unvirsty=${universityId}`;

    try {
      const res = await axios.get(url);
      setProviders(res.data);
    } catch (err) {
      console.error("فشل تحميل الخدمات", err);
    }
  };

  const handleUniversityChange = (e) => {
    const selectedId = e.target.value;
    setSelectedUniversity(selectedId);
    setProviders([]);
    if (selectedId) {
      fetchProviders("latest", selectedId);
    }
  };

  const handleSelect = (provider) => {
    const alreadySelected = selectedProviders.find(
      (p) => p.iD_Serves === provider.iD_Serves
    );

    let updatedSelectedProviders;

    if (alreadySelected) {
      updatedSelectedProviders = selectedProviders.filter(
        (p) => p.iD_Serves !== provider.iD_Serves
      );
    } else {
      if (selectedProviders.length >= 3) {
        setErrorMessage("🚫 يمكنك اختيار 3 مزودين كحد أقصى.");
        return;
      }

      updatedSelectedProviders = [...selectedProviders, provider];
    }

    setSelectedProviders(updatedSelectedProviders);
    saveData({ selectedProviders: updatedSelectedProviders });
    setErrorMessage("");
  };

  const handleSubmit = () => {
    if (selectedProviders.length === 0) {
      setErrorMessage("⭐ يجب اختيار مزود خدمة واحد على الأقل");
      return;
    }
    saveData({ selectedProviders });
    setErrorMessage("");
    onNext();
  };

  return (
    <section className="providers-section">
      <div className="providers-container">
        <div className="section-header">
          <h2>{branchName}</h2>
          <p>اختر الجامعة لرؤية المزودين</p>

          <select value={selectedUniversity} onChange={handleUniversityChange}>
            <option value="">اختر جامعة</option>
            {universities.map((uni) => (
              <option key={`uni-${uni.id}`} value={uni.id}>
                {uni.name}
              </option>
            ))}
          </select>

          {selectedUniversity && (
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => fetchProviders("latest")}
                className={`select-button ${
                  activeFilter === "latest" ? "active" : ""
                }`}
              >
                الأحدث
              </button>
              <button
                onClick={() => fetchProviders("oldest")}
                className={`select-button ${
                  activeFilter === "oldest" ? "active" : ""
                }`}
              >
                الأقدم
              </button>
              <button
                onClick={() => fetchProviders("topRated")}
                className={`select-button ${
                  activeFilter === "topRated" ? "active" : ""
                }`}
              >
                الأعلى تقييمًا
              </button>
            </div>
          )}
        </div>

        <div className="providers-grid">
          {providers.length > 0 ? (
            providers.map((provider) => {
              console.log("provider obj:", provider); // ✅ ضيفه هون

              const isSelected = selectedProviders.some(
                (p) => p.iD_Serves === provider.iD_Serves
              );

              return (
                <div
                  key={`provider-${provider.iD_Serves}`}
                  className="provider-card"
                >
                  <div className="provider-image">
                    <img
                      src={
                        provider.imege_url?.startsWith("http")
                          ? provider.imege_url
                          : "/for-test-provider/software-developer-6521720-scaled.webp"
                      }
                      alt={provider.service_Address}
                    />
                  </div>
                  <div className="provider-info">
                    <h3>{provider.service_Address}</h3>
                    <p className="price">ابتداءً من {provider.price} دينار</p>

                    {/* ⭐ تقييم بالنجوم فقط */}
                    <Rating
                      readonly
                      initialRating={provider.avg_rating}
                      emptySymbol={
                        <i
                          className="far fa-star"
                          style={{ color: "#ccc", fontSize: 20 }}
                        ></i>
                      }
                      fullSymbol={
                        <i
                          className="fas fa-star"
                          style={{ color: "#fbc02d", fontSize: 20 }}
                        ></i>
                      }
                      halfSymbol={
                        <i
                          className="fas fa-star-half-alt"
                          style={{ color: "#fbc02d", fontSize: 20 }}
                        ></i>
                      }
                    />

                    <div className="card-actions">
                      <Link
                        to={`/show-info/${provider.iD_Serves}`}
                        className="provider-link"
                      >
                        عرض
                      </Link>
                      <button
                        onClick={() => handleSelect(provider)}
                        className={`select-button ${
                          isSelected ? "selected" : ""
                        }`}
                      >
                        {isSelected ? "✅ تم الاختيار" : "اختيار"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: "center" }}>لا توجد بيانات متاحة حاليًا.</p>
          )}
        </div>

        {errorMessage && (
          <div className="error-message" style={{ marginBottom: "1rem" }}>
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="provider-link"
          style={{ marginTop: "0.5rem", width: "100%" }}
        >
          تابع
        </button>
      </div>
    </section>
  );
};

export default StepTwo;
