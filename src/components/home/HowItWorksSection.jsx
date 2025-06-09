import React from 'react';
import './styles/HowItWorksSection.css';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "إنشاء حساب",
      description: "سجل حسابك على المنصة  كمقدم خدمة او كعميل"
    },
    {
      number: 2,
      title: "اضافة طلب",
      description: "قم باضافة طلبك للحصول على خدمة من احد مقدمين الخدمة"
    },
    {
      number: 3,
      title: "اخيتار مزود خدمة ",
      description: "قم باختيار مقدمين الخدمة الملائمين للطلب الخاص بك"
    },
    {
      number: 4,
      title: "احصل على خدمتك",
      description: "استلم خدمتك بالجودة المطلوبة وفي الوقت المحدد"
    }
  ];

  return (
    <section className="how-it-works">
      <div className="how-it-works-container">
        <div className="section-header">
          <h2>كيف تعمل المنصة</h2>
          <p>خطوات بسيطة للحصول على الخدمة التي تحتاجها</p>
        </div>
        
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
