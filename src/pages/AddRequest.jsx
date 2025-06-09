import React, { useState, useEffect } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import "./AddRequest.css";

const AddRequest = () => {
  const savedState = JSON.parse(localStorage.getItem("addRequestState") || "null");
  const [step, setStep] = useState(savedState?.step || 1);
  const [formData, setFormData] = useState(savedState?.formData || {});
  const [shakeStep, setShakeStep] = useState(false);
  const [shakeSecondStep, setShakeSecondStep] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSaveStepOne = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSaveStepTwo = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmitRequest = () => {
    console.log("🚀 تم تأكيد وإرسال الطلب");
    // هنا ترسل البيانات للـ API
  };

  const validateStepOne = () => {
    const requiredFields = [
      formData.title,
      formData.mainService,
      formData.subService,
      formData.description,
      formData.deadline,
      formData.price,
    ];
    const hasError = requiredFields.some((val) => !val || val === "");
    const needsLocation =
      formData.serviceMode === "خارجي" && !formData.location;

    return !(hasError || needsLocation);
  };

  const validateStepTwo = () => {
    return formData.selectedProviders?.length > 0;
  };

  const handleStepClick = (num) => {
    setErrorMessage(""); // مسح الرسائل القديمة

    if (num === 2) {
      if (!validateStepOne()) {
        setShakeStep(true);
        setTimeout(() => setShakeStep(false), 500);
        setErrorMessage("يرجى تعبئة جميع الحقول المطلوبة ✏️");
        return;
      }
    }

    if (num === 3) {
      if (!validateStepOne()) {
        setShakeStep(true);
        setTimeout(() => setShakeStep(false), 500);
        setStep(1);
        setErrorMessage("يرجى تعبئة بيانات الطلب أولاً 📋");
        return;
      }

      const hasProviders =
        formData.selectedProviders && formData.selectedProviders.length > 0;

      if (!hasProviders) {
        setShakeSecondStep(true);
        setTimeout(() => setShakeSecondStep(false), 500);
        setStep(2);
        setErrorMessage("يجب اختيار مزود خدمة واحد على الأقل ⭐");
        return;
      }

      // ✅ جاهز للانتقال للثالثة
      setStep(3);
      return;
    }

    setStep(num);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="fade">
            <StepOne
              onNext={() => setStep(2)}
              saveData={handleSaveStepOne}
              initialData={formData}
            />
          </div>
        );
      case 2:
        return (
          <div className={`fade ${shakeSecondStep ? "shake" : ""}`}>
            <StepTwo
              onNext={() => setStep(3)}
              saveData={handleSaveStepTwo}
              initialData={formData}
            />
          </div>
        );
      case 3:
        return (
          <div className="fade">
            <StepThree
              formData={formData}
              onBack={() => setStep(2)}
              onSubmit={handleSubmitRequest}
            />
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    localStorage.setItem("addRequestState", JSON.stringify({ step, formData }));
  }, [step, formData]);

  return (
    <div className="add-service-container">
      <h2>إضافة طلب</h2>

      <div className="steps-navigation stepper">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`circle ${step === num ? "active" : ""} ${
              (num === 1 && shakeStep) || (num === 2 && shakeSecondStep)
                ? "shake"
                : ""
            }`}
            onClick={() => handleStepClick(num)}
          >
            {num}
          </div>
        ))}
      </div>

      {errorMessage && (
        <p
          className="error-message"
          style={{
            textAlign: "center",
            background: "#ffe5e5",
            color: "red",
            padding: "10px",
            borderRadius: "8px",
            margin: "20px auto",
            maxWidth: "400px",
            fontWeight: "bold",
          }}
        >
          ⭐ {errorMessage}
        </p>
      )}

      <div className="step-content step-box">{renderStepContent()}</div>
    </div>
  );
};

export default AddRequest;
