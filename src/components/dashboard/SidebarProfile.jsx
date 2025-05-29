import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import axios from "axios";

const SidebarProfile = ({ userRole = "طالب" }) => {
  const { idPerson } = useAuth();
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("/avatar/avatar.png");

  useEffect(() => {
    if (idPerson) {
      axios
        .get(`http://eallaenjazapi.runasp.net/api/Person/GET_PERSON_PY_ID${idPerson}`)
        .then((res) => {
          setUserName(res.data.f_name );
          setAvatar(res.data.main_Imege_Url  || "/avatar/avatar.png");
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [idPerson]);

  return (
    <div className="sidebar-header">
      <div className="user-avatar">
        <img src={avatar} alt="صورة المستخدم" />
      </div>
      <h3>مرحبا، {userName}</h3>
      <span className="user-role">{userRole}</span>
    </div>
  );
};

export default SidebarProfile;
