import { useState } from "react";
import { Request_Post_Axios } from "../../API";
import { useLocation, useNavigate } from "react-router-dom";

export const usePasswordChange = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = location.state?.email || "";
  const [values, setValues] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.newPassword !== values.confirmPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setValues({ ...values, confirmPassword: "" });
      return;
    }

    if (values.newPassword.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    const response = await Request_Post_Axios(`/Auth/PasswordChange`, {
      newPassword: values.newPassword,
      userEmail,
    });

    if (response.status) {
      alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인 해주세요.");
      // 기존 토큰 삭제 후 로그인 페이지로 이동
      localStorage.removeItem("Token");
      navigate("/");
    } else {
      alert(
        response.message ||
          "비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인하세요.",
      );
      setValues({
        ...values,
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return { values, handleChange, handleSubmit };
};
