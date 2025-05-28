import { createContext, useContext, useState, useEffect } from "react";

// 1. إنشاء الكونتكست
const AuthContext = createContext();

// 2. المزود (Provider) اللي بيغلف التطبيق
export function AuthProvider({ children }) {
  // read initial auth state from localStorage to avoid flashing as guest
  const [userType, setUserType] = useState(() => localStorage.getItem("userType") || "guest");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail") || "");
  const [idStudent, setIdStudent] = useState(() => {
    const val = localStorage.getItem("idStudent");
    return val ? parseInt(val, 10) : null;
  });
  const [idPerson, setIdPerson] = useState(() => {
    const val = localStorage.getItem("idPerson");
    return val ? parseInt(val, 10) : null;
  });

  useEffect(() => {
    // عند تحميل الصفحة، نقرأ نوع المستخدم والبريد من localStorage
    const storedUserType = localStorage.getItem("userType") || "guest";
    const storedUserEmail = localStorage.getItem("userEmail") || "";
    const storedIdStudent = localStorage.getItem("idStudent");
    const storedIdPerson = localStorage.getItem("idPerson");
    setIdStudent(storedIdStudent ? parseInt(storedIdStudent, 10) : null);
    setIdPerson(storedIdPerson ? parseInt(storedIdPerson, 10) : null);
    setUserType(storedUserType);
    setUserEmail(storedUserEmail);
  }, []);

  // دالة لتسجيل الدخول (بتحدد نوع المستخدم)
  const login = (type, email, studentId = null, personId = null) => {
    setUserType(type);
    setUserEmail(email);
    setIdStudent(studentId);
    setIdPerson(personId);
    localStorage.setItem("userType", type);
    localStorage.setItem("userEmail", email);
    if (studentId !== null) localStorage.setItem("idStudent", studentId);
    if (personId !== null) localStorage.setItem("idPerson", personId);
  };

  // دالة لتسجيل الخروج
  const logout = () => {
    setUserType("guest");
    setUserEmail("");
    setIdStudent(null);
    setIdPerson(null);
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("idStudent");
    localStorage.removeItem("idPerson");
  };

  return (
    <AuthContext.Provider value={{ userType, userEmail, idStudent, idPerson, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. فنكشن سهلة للوصول للكونتكست
export function useAuth() {
  return useContext(AuthContext);
}
