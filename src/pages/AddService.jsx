import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddsService.css";
import { useAuth } from "../Contexts/AuthContext";

const AddService = () => {
  const { idStudent } = useAuth();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [platformLink, setPlatformLink] = useState("");
  const [clientDetails, setClientDetails] = useState("");
  const [servicePrice, setServicePrice] = useState("10");
  const [phoneNumber, setPhoneNumber] = useState("07");
  const [previousWorkImages, setPreviousWorkImages] = useState([
    null,
    null,
    null,
  ]);
  const [errors, setErrors] = useState({});

  const [mainServices, setMainServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [selectedMainServiceId, setSelectedMainServiceId] = useState("");
  const [selectedSubServiceId, setSelectedSubServiceId] = useState("");

  useEffect(() => {
    axios
      .get(
        "http://eallaenjazapi.runasp.net/api/ Name_Serves/GET_ALL_NAME_SERVES"
      )
      .then((response) => setMainServices(response.data))
      .catch((error) => console.error("خطأ بجلب الخدمات الرئيسية:", error));
  }, []);

  useEffect(() => {
    if (selectedMainServiceId) {
      axios
        .get(
          `http://eallaenjazapi.runasp.net/api/Branch_Serves/GET_ALL_BRANCH_SERVES_USING_ID_NAME_SERVES${selectedMainServiceId}`
        )
        .then((response) => setSubServices(response.data))
        .catch((error) => console.error("خطأ بجلب الخدمات الفرعية:", error));
    }
  }, [selectedMainServiceId]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleWorkImageChange = (index, file) => {
    const updatedImages = [...previousWorkImages];
    updatedImages[index] = file;
    setPreviousWorkImages(updatedImages);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!imageFile) newErrors.imageFile = true;
    if (!title.trim()) newErrors.title = true;
    if (!description.trim()) newErrors.description = true;
    if (!features.trim()) newErrors.features = true;
    if (!platformLink.trim()) newErrors.platformLink = true;
    if (!clientDetails.trim()) newErrors.clientDetails = true;
    if (!/^07[0-9]{8}$/.test(phoneNumber)) {
      newErrors.phoneNumber = true;
      toast.error("📱 رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 10 أرقام فقط");
    }
    if (!servicePrice.trim()) newErrors.servicePrice = true;
    if (!selectedMainServiceId) newErrors.selectedMainServiceId = true;
    if (!selectedSubServiceId) newErrors.selectedSubServiceId = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة.");
      return;
    }

    const payload = {
      service_Address: title,
      serveS_ID: Number(selectedMainServiceId),
      branch_Server_Id: Number(selectedSubServiceId),
      price: Number(servicePrice),
      service_Description: description,
      service_Features: features,
      number_Phone: phoneNumber,
      preview_link: platformLink,
      description_works: clientDetails,
      iD_Statue_Serves: 3,
      iD_Student: idStudent,
      date_Enroll: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        "http://eallaenjazapi.runasp.net/api/Serves_Student/ADD_SERVESS_STUDENT",
        payload
      );

      const servesId = response.data.id;

      const allImages = [imageFile, ...previousWorkImages];
      const uploadPromises = allImages.map((img, index) => {
        if (!img) return null;
        const formData = new FormData();
        formData.append("imageFile", img);
        return axios.post(
          `http://eallaenjazapi.runasp.net/api/Imege/Upload_Imege_In_Servs_Student?serves_id=${servesId}&Imeg_Order=${
            index + 1
          }`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      });

      await Promise.all(uploadPromises.filter(Boolean));
      toast.success("✅ تمت إضافة الخدمة والصور بنجاح!");
      navigate('/student-dashboard');
    } catch (error) {console.log( idStudent);
      toast.error("❌ فشل في إرسال البيانات أو الصور.");
      console.error(error);
    }
  };

  // check existing student service
  const [hasService, setHasService] = useState(null);
  useEffect(() => {
    axios.get(`http://eallaenjazapi.runasp.net/api/Serves_Student/GET_Serves_Student_By_Id_Student${idStudent}`)
      .then(res => {
        console.log('Service-check API response:', res.data);
        const data = res.data;
        const exists = Array.isArray(data) ? data.length > 0 : Boolean(data);
        console.log('Computed hasService:', exists);
        setHasService(exists);
      })
      .catch(err => {
        if (err.response?.status === 404) setHasService(false);
        else { console.error("Error checking services:", err); setHasService(false); }
      });
  }, [idStudent]);

  if (hasService === null) {
    return <div>جارٍ التحقق من وجود خدمة...</div>;
  }
  if (hasService) {
    return (
      <div className="service-warning-container">
        <div className="service-warning-card">
          <h2>تنبيه</h2>
          <p>لديك خدمة بالفعل، لا يمكنك إضافة أكثر من خدمة في الوقت الحالي.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-service-container">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="custom-toast"
        closeButton={false}
      />

      <h2>إضافة خدمة</h2>

      <label>صورة الخدمة الرئيسية:</label>
      <input
        type="file"
        onChange={handleMainImageChange}
        className={errors.imageFile ? "input-error" : ""}
      />
      {imagePreview && (
        <>
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            📸 الصورة الرئيسية:
          </p>
          <img
            src={imagePreview}
            alt="معاينة"
            style={{
              width: "100%",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          />
        </>
      )}

      {previousWorkImages.filter(Boolean).length > 0 && (
        <>
          <p style={{ fontWeight: "bold", marginTop: "15px" }}>📂 صور العمل:</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {previousWorkImages.map(
              (img, index) =>
                img && (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt={`عمل ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )
            )}
          </div>
        </>
      )}

      <label>عنوان الخدمة:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={errors.title ? "input-error" : ""}
      />

      <label>الخدمة الرئيسية:</label>
      <select
        value={selectedMainServiceId}
        onChange={(e) => setSelectedMainServiceId(e.target.value)}
        className={errors.selectedMainServiceId ? "input-error" : ""}
      >
        <option value="">اختر خدمة رئيسية</option>
        {mainServices.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name_Serves}
          </option>
        ))}
      </select>

      {selectedMainServiceId && (
        <>
          <label>الخدمة الفرعية:</label>
          <select
            value={selectedSubServiceId}
            onChange={(e) => setSelectedSubServiceId(e.target.value)}
            className={errors.selectedSubServiceId ? "input-error" : ""}
          >
            <option value="">اختر خدمة فرعية</option>
            {subServices.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </>
      )}

      <label>تفاصيل الخدمة:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        className={errors.description ? "input-error" : ""}
      />

      <label>مميزات الخدمة:</label>
      <textarea
        name="features"
        value={features}
        onChange={(e) => setFeatures(e.target.value)}
        rows="2"
        className={errors.features ? "input-error" : ""}
      />

      <label>إضافة صور لعملك السابق (اختياري):</label>
      <div className="image-upload">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="image-upload-item">
            <input
              type="file"
              onChange={(e) => handleWorkImageChange(index, e.target.files[0])}
            />
          </div>
        ))}
      </div>

      <label>رابط معرض أعمال:</label>
      <input
        type="url"
        value={platformLink}
        onChange={(e) => setPlatformLink(e.target.value)}
        placeholder="https://"
        className={errors.platformLink ? "input-error" : ""}
      />

      <label>تفاصيل مع العميل:</label>
      <textarea
        value={clientDetails}
        onChange={(e) => setClientDetails(e.target.value)}
        placeholder="آلية التسليم بعد انتهاء العمل"
        rows="3"
        className={errors.clientDetails ? "input-error" : ""}
      />

      <label>رقم الهاتف:</label>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => {
          const value = e.target.value;
          if (/^07\d{0,8}$/.test(value)) {
            setPhoneNumber(value);
          }
        }}
        maxLength={10}
        className={errors.phoneNumber ? "input-error" : ""}
      />

      <label>السعر الابتدائي:</label>
      <div className="price-container">
        <span className="currency-symbol">د.أ</span>
        <input
          type="number"
          value={servicePrice}
          onChange={(e) => setServicePrice(e.target.value)}
          className={errors.servicePrice ? "input-error" : ""}
        />
      </div>

      <button onClick={handleSubmit}>إضافة الخدمة</button>
    </div>
  );
};

export default AddService;
