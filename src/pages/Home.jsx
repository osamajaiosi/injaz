import { useAuth } from "../Contexts/AuthContext"; 
import { useState, useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import BenefitsSection from "../components/home/BenefitsSection";
import StatisticsSection from "../components/home/StatisticsSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import CTASection from "../components/home/CTASection";
import ServicesPage from "./Services";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const { userType } = useAuth(); 
  // fade-in on mount
  const [fade, setFade] = useState(false);
  useEffect(() => { setFade(true); }, []);

  return (
    <div className={`home ${fade ? 'fade-in' : 'fade-init'}`}>
      <HeroSection userType={userType} />
      <BenefitsSection />
      <ServicesPage limit={6} />
      <div className="show-more-container">
        <Link to="/servicespage" className="show-more-btn">عرض المزيد</Link>
      </div>
      {/* <StatisticsSection /> */}    <CTASection userType={userType} />
      <HowItWorksSection />
      {/* <CTASection userType={userType} /> */}
    </div>
  );
}

export default Home;
// import logo from '../../public/logo/WhatsApp Image 2025-03-16 at 10.58.45 PM (1).png';
// import illustration from '../../public/logo/WhatsApp Image 2025-03-16 at 10.58.45 PM (1).png';
