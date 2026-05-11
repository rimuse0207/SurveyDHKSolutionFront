// src/hooks/useAdminLogin.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Store/Reducers/LoginReducer";
import { Request_Post_Axios } from "../../API";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 실제 환경에서는 여기서 axios 등으로 서버 통신을 합니다.

    const response = await Request_Post_Axios(`/Auth/LoginCheck`, {
      email: values.email,
      password: values.password,
    });

    if (response.status) {
      localStorage.setItem("Token", response.data.token);

      dispatch(
        loginSuccess({
          name: response.data.result.name,
          email: response.data.result.email,
          position: response.data.result.position,
          company: response.data.result.company,
          department: response.data.result.department,
        }),
      );
      setValues({ ...values, password: "" });
      navigate("/Survey");
    } else {
      alert("ID 또는 PASSWORD를 확인 해 주세요.");
      setValues({ ...values, password: "" });
      return;
    }
  };

  return { values, handleChange, handleSubmit };
};
