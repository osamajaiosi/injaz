import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const StepThree = ({ formData, onBack }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  console.log(" selectedProviders:", formData.selectedProviders);

  const { idPerson } = useAuth();
  const navigate = useNavigate();

  const handleConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleAgree = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        id: 0,
        titel_serves: formData.title,
        iD_Name_Serves: parseInt(formData.mainService),
        iD_branch_Serves: parseInt(formData.subService),
        describtion_Serves: formData.description,
        price: parseFloat(formData.price),
        delivery_time: formData.deadline,
        iD_pesron_Presenter_Order: idPerson,
        type_serves: formData.serviceMode === "أونلاين" ? 1 : 2,
        iD_state_Order: 3,
        iD_Location: formData.locationId || null,
        dtae_Order: new Date().toISOString(),
        iD_Student_Service_provider: `(${formData.selectedProviders
          .map((p) => p.iD_Student)
          .join(",")})`,

        iD_Files: formData.file ? formData.file : null, // غيّره لاحقاً للرقم الصحيح بعد الرفع
      };
      console.log(" البيانات المرسلة إلى API:", payload);

      await axios.post(
        "http://eallaenjazapi.runasp.net/api/Request_Order/ADD_REQUEST_ORDER",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setShowConfirmModal(false);
      localStorage.removeItem("addRequestState");
      toast.success(
        "تم إرسال طلبك بنجاح وسيتم مراجعته من قبل مزودي الخدمة. عند قبول الطلب، سيصلك إشعار رسمي عبر البريد الإلكتروني."
      );
      navigate("/home");
    } catch (error) {
      console.error("فشل الإرسال:", error.response?.data || error.message);
      setSubmitError("حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="step-three-container">
      <h2>استكمال تأكيد الطلب</h2>

      {submitError && <p className="error-message">{submitError}</p>}

      <div className="buttons-row">
        <button className="confirm-button" onClick={handleConfirm}>
          تأكيد
        </button>
        <button className="cancel-button" onClick={onBack}>
          إلغاء
        </button>
      </div>

      {showConfirmModal && (
        <div className="confirm-modal">
          <div className="modal-content">
            <p>
              بالضغط على موافق، سيتم إرسال الطلب. لا يمكنك التعديل أو الإلغاء
              وقد تترتب عليك رسوم مالية.
            </p>
            <div className="modal-buttons">
              <button
                className="agree-button"
                onClick={handleAgree}
                disabled={submitting}
              >
                {submitting ? "جارٍ الإرسال..." : "موافق"}
              </button>
              <button onClick={() => setShowConfirmModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepThree;
