import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import UserProfile from "./UserProfile";
import StudentProfile from "./StudentProfile";

const Profile = () => {
  const { userType, idStudent } = useAuth();
  const [hasService, setHasService] = useState(null);

  useEffect(() => {
    if (userType !== "STUDENT" || idStudent == null) {
      setHasService(false);
      return;
    }
    axios
      .get(
        `http://eallaenjazapi.runasp.net/api/Serves_Student/GET_Serves_Student_By_Id_Student${idStudent}`
      )
      .then((res) => {
        const data = res.data;
        if (!data || (Array.isArray(data) && data.length === 0)) {
          setHasService(false);
        } else {
          setHasService(true);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setHasService(false);
        } else {
          console.error("Error fetching student services:", err);
          setHasService(true);
        }
      });
  }, [userType, idStudent]);

  if (hasService === null) {
    return <div>Loading...</div>;
  }

  return hasService ? <StudentProfile /> : <UserProfile />;
};

export default Profile;
