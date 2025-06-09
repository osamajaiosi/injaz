import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DeleteService.css";
import "./AddsService.css";
import { useAuth } from "../Contexts/AuthContext";

const DeleteService = () => {
  const { serviceId } = useParams();
  const { idStudent } = useAuth();
  const navigate = useNavigate();

  const [serviceData, setServiceData] = useState(null);
  const [mainServiceName, setMainServiceName] = useState("");
  const [subServiceName, setSubServiceName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [serviceNotFound, setServiceNotFound] = useState(false);

  useEffect(() => {
    if (idStudent == null) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Serves_Student/GET_Serves_Student_By_Id_Student${idStudent}`
        );
        const data = res.data;
        if (!data) {
          setServiceNotFound(true);
          return;
        }
        setServiceData(data);

        const mainNameRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/ Name_Serves/GET_SERVES ${data.serveS_ID}`
        );
        setMainServiceName(mainNameRes.data.name_Serves);

        const subNameRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Branch_Serves/GET_BRANCH_SERVES_BY_ID${data.branch_Server_Id}`
        );
        setSubServiceName(subNameRes.data.name);

        const imgRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Imege/GET_ALL_IMEGES_BY_ID_SERVES ${data.id}`
        );
        const images = Array.isArray(imgRes.data) ? imgRes.data : [];
        if (images.length > 0) setImageUrl(images[0].imeg_Url);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setServiceNotFound(true);
          return;
        }
        console.error("خطأ في جلب البيانات:", err);
        toast.error("فشل في تحميل البيانات.");
      }
    };
    fetchData();
  }, [idStudent, serviceId]);

  if (serviceNotFound) {
    return (
      <div className="service-warning-container">
        <div className="service-warning-card">
          <h2>تنبيه</h2>
          <p>لا يوجد لديك خدمة بعد لحذفها</p>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://eallaenjazapi.runasp.net/api/Serves_Student/Delete_Serves_Student ${serviceId}`
      );
      toast.success("✅ تم حذف الخدمة بنجاح!");
      navigate('/student-dashboard');
    } catch (err) {
      console.error("فشل في حذف الخدمة:", err);
      toast.error("❌ فشل في تنفيذ عملية الحذف.");
    }
  };

  if (!serviceData)
    return <div className="add-service-container">جاري التحميل...</div>;
  return (
    <div className="add-service-container">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <h2>تأكيد حذف الخدمة</h2>

      <div className="delete-service-layout">
        <div className="delete-info-wrapper">
          <div className="info-top-row">
            <div className="delete-image-wrapper">
              <img src={imageUrl || "/default-image.png"} alt="صورة الخدمة" />
            </div>

            <div className="text-info-section">
              <div className="info-item">
                <label>عنوان الخدمة:</label>
                <div className="info-value-box">
                  {serviceData.service_Address}
                </div>
              </div>

              <div className="info-item">
                <label>الخدمة الرئيسية:</label>
                <div className="info-value-box">{mainServiceName}</div>
              </div>

              <div className="info-item">
                <label>الخدمة الفرعية:</label>
                <div className="info-value-box">{subServiceName}</div>
              </div>
            </div>
          </div>

          <p className="delete-warning-box">
            ⚠️ سيتم حذف هذه الخدمة نهائيًا مع جميع البيانات المرتبطة بها.
          </p>

          <div className="delete-buttons-wrapper">
            <button className="delete-confirm-btn" onClick={handleDelete}>
              موافق
            </button>
            <button
              className="cancel-delete-btn"
              onClick={() => navigate('/student-dashboard')}
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteService;
