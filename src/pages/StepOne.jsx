import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./AddRequest.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useAuth } from "../Contexts/AuthContext";

const StepOne = ({ onNext, saveData, initialData }) => {
  const [form, setForm] = useState({
    title: "",
    mainService: "",
    subService: "",
    serviceMode: "",
    location: "",
    description: "",
    deadline: "",
    file: "",
    price: "",
    ...initialData, // <<< هذه السطر هو المهم
  });

  const [mainServices, setMainServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [availableMode, setAvailableMode] = useState(""); // from API: "Both" or "Onsite"
  const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState({});
  const [balanceError, setBalanceError] = useState("");
  const { idPerson } = useAuth();

  // Get all main services
  useEffect(() => {
    axios
      .get(
        "http://eallaenjazapi.runasp.net/api/ Name_Serves/GET_ALL_NAME_SERVES"
      )
      .then((res) => setMainServices(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Get sub services when main service changes
  useEffect(() => {
    if (form.mainService) {
      axios
        .get(
          `http://eallaenjazapi.runasp.net/api/Branch_Serves/GET_ALL_BRANCH_SERVES_USING_ID_NAME_SERVES${form.mainService}`
        )
        .then((res) => setSubServices(res.data))
        .catch((err) => console.error(err));
    } else {
      setSubServices([]);
    }
  }, [form.mainService]);

  // Get locations once
  useEffect(() => {
    axios
      .get("http://eallaenjazapi.runasp.net/api/Location/GET_ALL_LOCATION")
      .then((res) => setLocations(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle service mode after selecting sub service
  useEffect(() => {
    const selected = subServices.find(
      (s) => s.id === parseInt(form.subService)
    );
    if (selected) {
      setAvailableMode(selected.mode); // "Onsite" or "Both"
      if (selected.mode === "Onsite") {
        setForm((prev) => ({ ...prev, serviceMode: "خارجي" }));
      } else {
        setForm((prev) => ({ ...prev, serviceMode: "" }));
      }
    }
  }, [form.subService, subServices]);

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = true;
    if (!form.mainService) newErrors.mainService = true;
    if (!form.subService) newErrors.subService = true;
    if (availableMode === "Both" && !form.serviceMode)
      newErrors.serviceMode = true;
    if (form.serviceMode === "خارجي" && !form.location)
      newErrors.location = true;
    if (!form.description) newErrors.description = true;
    if (!form.deadline) newErrors.deadline = true;
    if (!form.price) newErrors.price = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "serviceMode" && value === "أونلاين") {
      const updatedForm = {
        ...form,
        serviceMode: value,
        location: "", // مسح الموقع عند اختيار أونلاين
      };
      setForm(updatedForm);
      saveData(updatedForm); // <<< جديد
    } else if (name === "file" && files.length > 0) {
      const file = files[0];
      setUploading(true);

      const formDataFile = new FormData();
      formDataFile.append("file", file);

      try {
        const res = await axios.post(
          "http://eallaenjazapi.runasp.net/api/Files/UploadFile",
          formDataFile,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const { id, File_Path } = res.data;
        const updatedForm = {
          ...form,
          file: id, // هذا هو المطلوب: تخزين رقم الملف
          fileUrl: File_Path, // لو حبيت تستخدمه للعرض
        };

        setForm(updatedForm);
        saveData(updatedForm); // <<< جديد
      } catch (err) {
        console.error("فشل رفع الملف:", err);
      } finally {
        setUploading(false);
      }
    } else {
      const updatedForm = {
        ...form,
        [name]: value,
      };
      setForm(updatedForm);
      saveData(updatedForm); // <<< جديد
    }
  };

  const handleSubmit = async () => {
    setBalanceError("");
    try {
      const res = await axios.get(
        `http://eallaenjazapi.runasp.net/api/Cradt_Card/GET_CRADET_CARD_BY_ID_Person?ID_Person=${idPerson}`
      );
      const available = res.data.palnce;
      if (available < parseFloat(form.price)) {
        setBalanceError(`المبلغ المدفوع أكبر من المبلغ المتوفر. رصيدك الحالي ${available}`);
        return;
      }
    } catch {
      setBalanceError("خطأ في جلب الرصيد. حاول لاحقاً");
      return;
    }
    if (!validate()) return;
    const selectedSubService = subServices.find(
      (s) => s.id === parseInt(form.subService)
    );
    saveData({
      ...form,
      locationId: form.location,
      subServiceName: selectedSubService ? selectedSubService.name : "",
    });
    onNext();
  };

  return (
    <>
      <label><i className="fas fa-pencil-alt"></i> عنوان الخدمة:</label>
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        className={errors.title ? "input-error" : ""}
        placeholder="مثال: تصميم شعار احترافي"
      />

      <label><i className="fas fa-cog"></i> الخدمة الرئيسية:</label>
      <select
        name="mainService"
        value={form.mainService}
        onChange={handleChange}
        className={errors.mainService ? "input-error" : ""}
      >
        <option value="">اختر خدمة رئيسية</option>
        {mainServices.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name_Serves}
          </option>
        ))}
      </select>

      {subServices.length > 0 && (
        <>
          <label><i className="fas fa-tags"></i> الخدمة الفرعية:</label>
          <select
            name="subService"
            value={form.subService}
            onChange={handleChange}
            className={errors.subService ? "input-error" : ""}
          >
            <option value="">اختر خدمة فرعية</option>
            {subServices.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </>
      )}

      {availableMode === "Both" && (
        <>
          <label><i className="fas fa-sliders-h"></i> نوع الخدمة:</label>
          <select
            name="serviceMode"
            value={form.serviceMode}
            onChange={handleChange}
            className={errors.serviceMode ? "input-error" : ""}
          >
            <option value="">اختر نوع الخدمة</option>
            <option value="أونلاين">أونلاين</option>
            <option value="خارجي">خارجي</option>
          </select>
        </>
      )}

      {form.serviceMode === "خارجي" && (
        <>
          <label><i className="fas fa-map-marker-alt"></i> الموقع:</label>
          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            className={errors.location ? "input-error" : ""}
          >
            <option value="">اختر الموقع</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </>
      )}

      <label><i className="fas fa-align-left"></i> وصف العمل:</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className={errors.description ? "input-error" : ""}
        rows="3"
        placeholder="اشرح تفاصيل العمل المطلوب..."
      />
      <label><i className="fas fa-calendar-alt"></i> وقت الإنجاز:</label>
      <input
        type="text"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        placeholder="مثال: يومين / 3 أيام / أسبوع"
        className={errors.deadline ? "input-error" : ""}
      />
      <label><i className="fas fa-file-upload"></i> رفع ملف:</label>
      <input type="file" name="file" onChange={handleChange} />
      {uploading && <p>جارٍ رفع الملف...</p>}
      {form.file && <p style={{ color: "green" }}>✅ تم رفع الملف</p>}

      <label><i className="fas fa-dollar-sign"></i> المبلغ المدفوع:</label>
      
           <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className={`price-input ${errors.price ? "input-error" : ""}`}
       
        /> 
        {balanceError && <p className="error-message">⚠️ {balanceError}</p>}
      <button onClick={handleSubmit}>تابع</button>
    </>
  );
};

StepOne.propTypes = {
  onNext: PropTypes.func.isRequired,
  saveData: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default StepOne;
