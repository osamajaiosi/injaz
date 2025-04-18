import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdateService.css";

const UpdateService = () => {
  const studentId = 2;

  const [serviceData, setServiceData] = useState(null);
  const [images, setImages] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [platformLink, setPlatformLink] = useState("");
  const [clientDetails, setClientDetails] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mainServiceName, setMainServiceName] = useState("");
  const [subServiceName, setSubServiceName] = useState("");

  const [errors, setErrors] = useState({});
  const [isActive, setIsActive] = useState(true); // الحالة الفعالة أو المتوقفة

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Serves_Student/GET_Serves_Student_By_Id_Student${studentId}`
        );
        const data = serviceRes.data;

        if (!data || Object.keys(data).length === 0) {
          toast.error("🚫 لم يتم العثور على بيانات لهذه الخدمة.");
          return;
        }

        setServiceData(data);
        setTitle(data.service_Address || "");
        setDescription(data.service_Description || "");
        setFeatures(data.service_Features || "");
        setPlatformLink(data.preview_link || "");
        setClientDetails(data.description_works || "");
        setServicePrice(data.price || "");
        setPhoneNumber(data.number_Phone || "");

        const mainNameRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/ Name_Serves/GET_SERVES ${data.serveS_ID}`
        );
        setMainServiceName(mainNameRes.data.name_Serves);

        const subNameRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Branch_Serves/GET_BRANCH_SERVES_BY_ID${data.branch_Server_Id}`
        );
        setSubServiceName(subNameRes.data.name);

        setIsActive(data.iD_Statue_Serves === 3); // تعيين الحالة بناءً على iD_Statue_Serves

        try {
          const imgRes = await axios.get(
            `http://eallaenjazapi.runasp.net/api/Imege/GET_ALL_IMEGES_BY_ID_SERVES ${data.id}`
          );
          const sortedImages = Array.isArray(imgRes.data)
            ? imgRes.data.sort((a, b) => a.imeg_Order - b.imeg_Order)
            : [];
          setImages(sortedImages);
        } catch {
          console.warn("⚠️ لا توجد صور مرفوعة لهذه الخدمة.");
          setImages([]);
        }
      } catch (error) {
        toast.error("فشل في تحميل البيانات.");
        console.error("❌ API Error:", error);
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async () => {
    if (!serviceData) {
      toast.error("⚠️ لا توجد بيانات خدمة حالياً!");
      return;
    }

    const newErrors = {};
    if (!title.trim()) newErrors.title = true;
    if (!description.trim()) newErrors.description = true;
    if (!features.trim()) newErrors.features = true;
    if (!platformLink.trim()) newErrors.platformLink = true;
    if (!clientDetails.trim()) newErrors.clientDetails = true;
    if (servicePrice === "" || isNaN(servicePrice))
      newErrors.servicePrice = true;
    if (
      !phoneNumber.trim() ||
      phoneNumber.length !== 10 ||
      !/^079\d{7}$/.test(phoneNumber)
    ) {
      newErrors.phoneNumber = true;
      toast.error("📱 رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 079");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة.");
      return;
    }

    const serviceStatus = isActive ? 3 : 1; // تحديد حالة الخدمة بناءً على الزر المضغوط

    const payload = {
      id: serviceData.id,
      service_Address: title,
      serveS_ID: serviceData.serveS_ID,
      branch_Server_Id: serviceData.branch_Server_Id,
      price: Number(servicePrice),
      service_Description: description,
      service_Features: features,
      number_Phone: phoneNumber,
      preview_link: platformLink,
      description_works: clientDetails,
      iD_Statue_Serves: serviceStatus, // هنا القيمة المحدثة
      iD_Student: studentId,
      date_Enroll: new Date().toISOString(),
    };

    try {
      await axios.put(
        `http://eallaenjazapi.runasp.net/api/Serves_Student/UPDATE_Serves_Student${studentId}`,
        payload
      );

      const updatedImages = images.filter((img) => img.file); // رفع الصور المعدّلة
      let allImagesUpdated = true; // متغير للتأكد من أن كل الصور تم رفعها

      for (const img of updatedImages) {
        const formData = new FormData();
        formData.append("imageFile", img.file);

        try {
          await axios.put(
            `http://eallaenjazapi.runasp.net/api/Imege/Updata_imege?id_imege=${img.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(`✅ تم تحديث صورة رقم ${img.id} بنجاح`);
        } catch (error) {
          console.error(`❌ فشل في رفع صورة ID ${img.id}`, error);
          toast.error(`فشل في تحديث صورة (ID: ${img.id})`);
          allImagesUpdated = false; // إذا فشل رفع صورة، نغير القيمة
        }
      }

      if (allImagesUpdated) {
        // يظهر التوست فقط عند إتمام العملية بالكامل
        toast.success("✅ تم تحديث الخدمة والصور بنجاح!");
      }
    } catch (error) {
      console.error("❌ تحديث الخدمة فشل:", error);
      toast.error("فشل في تحديث الخدمة.");
    }
  };

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

      <h2>تعديل الخدمة</h2>

      {images.length > 0 && (
        <div className="main-image-overlay-wrapper">
          <img
            src={images[0].preview || images[0].imeg_Url}
            alt="الصورة الرئيسية"
            className="main-editable-image"
          />
          <label className="edit-main-image-btn">
            ✏️
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const updatedImages = [...images];
                    updatedImages[0] = {
                      ...updatedImages[0],
                      preview: reader.result,
                      file: file,
                    };
                    setImages(updatedImages);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
      )}

      <label>الخدمة الرئيسية:</label>
      <input type="text" value={mainServiceName} readOnly disabled />

      <label>الخدمة الفرعية:</label>
      <input type="text" value={subServiceName} readOnly disabled />

      <label>عنوان الخدمة:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={errors.title ? "input-error" : ""}
      />

      <label>تفاصيل الخدمة:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={errors.description ? "input-error" : ""}
      />

      <label>مميزات الخدمة:</label>
      <textarea
        value={features}
        onChange={(e) => setFeatures(e.target.value)}
        className={errors.features ? "input-error" : ""}
      />

      <label>رابط معرض الأعمال:</label>
      <input
        type="url"
        value={platformLink}
        onChange={(e) => setPlatformLink(e.target.value)}
        className={errors.platformLink ? "input-error" : ""}
      />

      <label>تفاصيل مع العميل:</label>
      <textarea
        value={clientDetails}
        onChange={(e) => setClientDetails(e.target.value)}
        className={errors.clientDetails ? "input-error" : ""}
      />

      <label>رقم الهاتف:</label>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        maxLength={10}
        className={errors.phoneNumber ? "input-error" : ""}
      />

      <label>السعر:</label>
      <input
        type="number"
        value={servicePrice}
        onChange={(e) => setServicePrice(e.target.value)}
        className={errors.servicePrice ? "input-error" : ""}
      />

      {images.length > 1 && (
        <>
          <label>صور العمل:</label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {images.slice(1).map((img, index) => (
              <div key={img.id} className="image-edit-overlay-wrapper">
                <img
                  src={img.preview || img.imeg_Url}
                  alt={`صورة ${index + 2}`}
                  className="editable-image"
                />
                <label className="edit-image-overlay-btn">
                  ✏️
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const updatedImages = [...images];
                          updatedImages[index + 1] = {
                            ...updatedImages[index + 1],
                            preview: reader.result,
                            file: file,
                          };
                          setImages(updatedImages);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="status-toggle-container">
        <button
          className={`status-toggle-btn ${
            isActive ? "status-active" : "status-inactive"
          }`}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? "إيقاف الخدمة مؤقتًا" : "تفعيل الخدمة"}
        </button>
        <span className={`status-label ${isActive ? "active" : "inactive"}`}>
          {isActive ? "الخدمة فعّالة ✅" : "الخدمة متوقفة مؤقتًا ⏸️"}
        </span>
      </div>

      <button onClick={handleSubmit}>تحديث الخدمة</button>
    </div>
  );
};

export default UpdateService;
