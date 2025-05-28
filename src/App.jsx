import { Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "./Contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "@fortawesome/fontawesome-free/css/all.min.css";

// الصفحات العامة
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import CompleteStudentInfo from "./pages/CompleteStudentInfo"; // ✅ جديد
import ForgotPassword from "./pages/ForgotPassword"; // ✅ جديد
import ForgotPasswordReset from "./pages/ForgotPasswordReset"; // ✅ جديد
import ForgotPasswordOTP from "./pages/ForgotPasswordOTP"; // ✅ جديد
import ActivateAccount from "./pages/ActivateAccount"; // ✅ جديد
import UserProfile from "./pages/UserProfile";

// صفحات الطالب
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import ChangePassword from "./pages/ChangePassword";
import CardInfo from "./pages/CardInfo";
import StudentCompletedOrders from "./pages/orders/StudentCompletedOrders"; // ✅ جديد
import StudentCompletedOrderDetails from "./pages/orders/StudentCompletedOrderDetails"; // ✅ جديد

// صفحات الخدمات
import Servicespage from "./pages/Services";
import SubServicesPage from "./pages/SubServicesPage";
import Providerstudents from "./pages/Providerstudnts";
import AddService from "./pages/AddService";
import UpdateService from "./pages/UpdateService";
import DeleteService from "./pages/DeleteService";
import ShowInfo from "./pages/ShowInfo";
import CustomShowInfo from "./pages/CustomShowInfo";
import AddRequest from "./pages/AddRequest";

// الطلبات
import OrdersInbox from "./pages/orders/OrdersInbox";
import OrderDetailsPage from "./pages/orders/OrderDetailsPage";
import CompletedOrdersInbox from "./pages/orders/CompletedOrdersInbox"; // ✅ جديد
import CompletedOrderDetails from "./pages/orders/CompletedOrderDetails"; // ✅ جديد
import OnProgress from "./pages/orders/OnProrgress";
import OnProgressDetails from "./pages/orders/OnProgressDetails"; // ✅ جديد
import OnProgressOrders from "./pages/orders/OnProgressOrders"; // ✅ جديد
import OnProgressOrdersDetails from "./pages/orders/OnProgressOrdersDetails"; // ✅ جديد
import OrdersNotapproved from "./pages/orders/OrdersNotapproved";
import UnapprovedOrderDetails from "./pages/orders/UnapprovedOrderDetails";

// Layout للوحة التحكم
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Reviews from "./pages/orders/Reviews";
import DashboardContent from "./components/dashboard/DashboardContent";

// redirect component for legacy route
const ProviderDetailsRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/show-info/${id}`} replace />;
};

function App() {
  const { userType } = useAuth();
  const location = useLocation();
  const hideNavbar = ['/login','/register','/verify-otp','/complete-student-info','/pages/CompleteStudentInfo','/forgot-password','/forgot-password/otp','/forgot-password/reset','/verify-activation','/activate-account'].includes(location.pathname);
  return (
    <div className="app">
      {hideNavbar ? null : <Navbar />}
      <main className="main-content">
        <Routes>
          {/* catch old '/user-profile' route */}
          <Route path="/user-profile" element={<Navigate to="/profile" replace />} />
          {/* صفحات عامة */}
          <Route
            path="/"
            element={
              userType === 'STUDENT' ? <Navigate to="/student-dashboard" replace /> :
              userType === 'PROVIDER' ? <Navigate to="/provider-dashboard" replace /> :
              <Home />
            }
          />
          {/* Allow students to view general Home via /home */}
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password/otp" element={<ForgotPasswordOTP />} />
          <Route path="/forgot-password/reset" element={<ForgotPasswordReset />} />
          <Route path="/verify-activation" element={<ActivateAccount />} />
          <Route path="/activate-account" element={<ActivateAccount />} />
          <Route path="/complete-student-info" element={<CompleteStudentInfo />} />
          <Route path="/pages/CompleteStudentInfo" element={<CompleteStudentInfo />} />
          {/* unified profile route for STUDENT or USER */}
          <Route path="/profile" element={
            userType === 'STUDENT' ? <StudentProfile /> :
            userType === 'USER' ? <UserProfile /> :
            <Navigate to="/" replace />
          } />
          {/* صفحات الطالب */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/card-info" element={
            <DashboardLayout activeTab="cards" openDropdown="">
              <CardInfo />
            </DashboardLayout>
          } />
          <Route path="/student-completed-orders" element={<StudentCompletedOrders />} />
          <Route path="/student-completed-orders/:id" element={<StudentCompletedOrderDetails />} />

          {/* الخدمات خارج لوحة التحكم */}
          <Route path="/servicespage" element={<Servicespage />} />
          <Route
            path="/services/:serviceName"
            element={<SubServicesPage />}
          />
          <Route
            path="/providerstudents/:subServiceId"
            element={<Providerstudents />}
          />
          {/* عرض تفاصيل الخدمة بدون DashboardLayout */}
          <Route path="/show-info/:serviceId" element={<ShowInfo />} />
          {/* legacy providerdetails route redirect to show-info */}
          <Route path="/providerdetails/:id" element={<ProviderDetailsRedirect />} />

          {/* الخدمات داخل DashboardLayout */}
          <Route
            path="/AddService"
            element={
              <DashboardLayout
                activeTab="services-add"
                openDropdown="services"
              >
                <AddService />
              </DashboardLayout>
            }
          />
          <Route
            path="/update-service/:serviceId"
            element={
              <DashboardLayout
                activeTab="services-edit"
                openDropdown="services"
              >
                <UpdateService />
              </DashboardLayout>
            }
          />
          <Route
            path="/delete-service/:serviceId"
            element={
              <DashboardLayout
                activeTab="services-delete"
                openDropdown="services"
              >
                <DeleteService />
              </DashboardLayout>
            }
          />
          {/* المسار داخل DashboardLayout للحالة الافتراضية */}
          <Route
            path="/dashboard/show-info/:serviceId"
            element={
              <DashboardLayout
                activeTab="services-view"
                openDropdown="services"
              >
                <ShowInfo />
              </DashboardLayout>
            }
          />
          {/* Custom view page, clone of ShowInfo for further customization */}
          <Route
            path="/dashboard/custom-show-info/:serviceId"
            element={
              <DashboardLayout activeTab="services-view" openDropdown="services">
                <CustomShowInfo />
              </DashboardLayout>
            }
          />
          {/* sales diagnostics داخل DashboardLayout */}
          <Route
            path="/sales-diagnostics"
            element={
              <DashboardLayout activeTab="sales-diagnostics" openDropdown="sales">
                <Reviews />
              </DashboardLayout>
            }
          />
          <Route
            path="/sales-stats"
            element={
              <DashboardLayout activeTab="sales-stats" openDropdown="sales">
                <DashboardContent activeTab="sales-stats" />
              </DashboardLayout>
            }
          />
          {/* الطلبات داخل DashboardLayout */}
          <Route
            path="/orders-inbox"
            element={
              <DashboardLayout activeTab="orders-inbox" openDropdown="orders">
                <OrdersInbox />
              </DashboardLayout>
            }
          />
          <Route path="/orders-not-approved" element={<OrdersNotapproved />} />
          <Route
            path="/orders-not-approved/:id"
            element={<UnapprovedOrderDetails />}
          />
          
          <Route
            path="/on-progress"
            element={
              <DashboardLayout activeTab="underworking" openDropdown="request">
                <OnProgress />
              </DashboardLayout>
            }
          />
          <Route
            path="/on-progress-orders"
            element={<OnProgressOrders />}
          />
          <Route
            path="/in-progress-orders/:id"
            element={
              <DashboardLayout activeTab="underworking" openDropdown="request">
                <OnProgressDetails />
              </DashboardLayout>
            }
          />
          <Route
            path="/in-progress-orders-details/:id"
            element={<OnProgressOrdersDetails />}
          />
          <Route
            path="/completed-orders"
            element={
              <DashboardLayout
                activeTab="orders-completed"
                openDropdown="orders"
              >
                <CompletedOrdersInbox />
              </DashboardLayout>
            }
          />

          {/* صفحات تفاصيل الطلب ضمن لوحة التحكم */}
          <Route
            path="/orders/:id"
            element={
              <DashboardLayout activeTab="orders-inbox" openDropdown="request">
                <OrderDetailsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/completed-orders/:id"
            element={
              <DashboardLayout
                activeTab="orders-completed"
                openDropdown="request"
              >
                <CompletedOrderDetails />
              </DashboardLayout>
            }
          />

          {/* صفحة خارجية لإضافة طلب */}
          <Route path="/add-request" element={<AddRequest />} />
        </Routes>
      </main>
      {hideNavbar ? null : <Footer />}
    </div>
  );
}

export default App;
