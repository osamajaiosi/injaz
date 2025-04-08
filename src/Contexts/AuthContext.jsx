import { createContext, useContext, useState, useEffect } from "react";

// 1. إنشاء الكونتكست
const AuthContext = createContext();

// 2. المزود (Provider) اللي بيغلف التطبيق
export function AuthProvider({ children }) {
  const [userType, setUserType] = useState("guest"); // guest = غير مسجل

  useEffect(() => {
    // عند تحميل الصفحة، نقرأ نوع المستخدم من localStorage
    const storedUserType = localStorage.getItem("userType") || "guest";
    setUserType(storedUserType);
  }, []);

  // دالة لتسجيل الدخول (بتحدد نوع المستخدم)
  const login = (type) => {
    setUserType(type);
    localStorage.setItem("userType", type);
  };

  // دالة لتسجيل الخروج
  const logout = () => {
    setUserType("guest");
    localStorage.removeItem("userType");
  };

  return (
    <AuthContext.Provider value={{ userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. فنكشن سهلة للوصول للكونتكست
export function useAuth() {
  return useContext(AuthContext);
}
