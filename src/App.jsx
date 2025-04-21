import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "@fortawesome/fontawesome-free/css/all.min.css";

// الصفحات الرئيسية
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

// صفحات الطالب
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import ChangePassword from "./pages/ChangePassword";
import CardInfo from "./pages/CardInfo";

// صفحات الخدمات
import Servicespage from "./pages/Services";
import SubServicesPage from "./pages/SubServicesPage";
import Providerstudents from "./pages/Providerstudnts";
import AddService from "./pages/AddService";
import UpdateService from "./pages/UpdateService";
import DeleteService from "./pages/DeleteService";

// ✅ صفحة عرض معلومات الخدمة
import ShowInfo from "./pages/ShowInfo";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* صفحات عامة */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* صفحات الطالب */}
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/card-info" element={<CardInfo />} />
            {/* صفحات الخدمات */}
            <Route path="/servicespage" element={<Servicespage />} />
            <Route
              path="/services/:serviceName"
              element={<SubServicesPage />}
            />
            <Route
              path="/providerstudents/:subServiceId"
              element={<Providerstudents />}
            />
            <Route path="/AddService" element={<AddService />} />
            <Route
              path="/update-service/:serviceId"
              element={<UpdateService />}
            />
            <Route
              path="/delete-service/:serviceId"
              element={<DeleteService />}
            />
            <Route path="/show-info/:serviceId" element={<ShowInfo />} />{" "}
            {/* ✅ راوت ShowInfo */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
