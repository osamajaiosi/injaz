import { useAuth } from "../Contexts/AuthContext"; // ⬅️ جديد
import HeroSection from "../components/home/HeroSection";
import BenefitsSection from "../components/home/BenefitsSection";
import ServicesSection from "../components/home/ServicesSection";
import StatisticsSection from "../components/home/StatisticsSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import CTASection from "../components/home/CTASection";
import { servicesData } from "../data/servicesData";
import "./Home.css";

function Home() {
  const { userType } = useAuth(); // ⬅️ نحصل على نوع المستخدم

  return (
    <div className="home">
      <HeroSection userType={userType} />
      <BenefitsSection />
      <ServicesSection services={servicesData.slice(0, 6)} />
      <StatisticsSection />
      <HowItWorksSection />
      <CTASection userType={userType} />
    </div>
  );
}

export default Home;
