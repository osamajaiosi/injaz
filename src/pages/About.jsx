import { Eye, Target, Heart } from "lucide-react";
import "./About.css";
function About() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>من نحن</h1>
        <p className="subtitle">
          منصة رائدة تربط طلاب الجامعات بالمجتمع المحلي
        </p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <div className="icon-wrapper">
            <Eye size={32} color=" #cdcd04" strokeWidth={2} />
          </div>
          <h2>رؤيتنا</h2>
          <p>
            نسعى لتمكين طلاب الجامعات من تقديم خدماتهم للمجتمع وبناء مستقبلهم
            المهني أثناء دراستهم.
          </p>
        </div>

        <div className="about-section">
          <div className="icon-wrapper">
            <Target size={32} color=" #cdcd04" strokeWidth={2} />
          </div>
          <h2>مهمتنا</h2>
          <p>
            توفير منصة آمنة وموثوقة تسهل التواصل بين الطلاب والمجتمع المحلي،
            وتساعد في خلق فرص عمل للطلاب.
          </p>
        </div>

        <div className="about-section">
          <div className="icon-wrapper">
            <Heart size={32} color=" #cdcd04" strokeWidth={2} />
          </div>
          <h2>قيمنا</h2>
          <ul>
            <li>الثقة والأمان</li>
            <li>الجودة في تقديم الخدمات</li>
            <li>دعم المواهب الشابة</li>
            <li>التطوير المستمر</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
