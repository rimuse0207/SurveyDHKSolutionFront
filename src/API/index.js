import axios from "axios";
import { toast } from "../Components/ToastMessage/ToastManager";

export const request = axios.create({
  baseURL: process.env.REACT_APP_DB_HOST + "/API/SurveySystem",
  validateStatus: function (status) {
    return true;
  },
});
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const Request_Post_Axios = async (path, data) => {
  try {
    const Post_Axios = await request.post(path, data);

    switch (Post_Axios.status) {
      // 데이터 성공
      case 200: {
        return {
          message: Post_Axios.data.message,
          data: Post_Axios.data.data,
          status: true,
        };
      }
      case 500: {
        return {
          message: Post_Axios.data.message,
          data: [],
          status: false,
        };
      }

      //요청의 구문이 잘못 됨
      case 400:
      case 403:
      case 404: {
        toast.show({
          title: `${Post_Axios.data.message}`,
          successCheck: false,
          duration: 6000,
        });
        return {
          data: [],
          status: false,
          message: Post_Axios.data.message,
        };
      }
      // 토큰이 없음
      case 600: {
        alert("로그인 세션이 없습니다. 로그인 후 이용 가능합니다.");
        localStorage.clear();
        if (window.location.pathname !== "/") {
          return (window.location.href = "/");
        } else {
          return "";
        }
      }

      default:
        throw new Error("AXIOS 에러");
    }
  } catch (error) {
    console.log(error);

    return error;
  }
};

export const Request_Get_Axios = async (path, params) => {
  try {
    const Get_Axios = await request.get(path, {
      params: params,
    });

    switch (Get_Axios.status) {
      // 데이터 성공
      case 200: {
        return {
          message: Get_Axios.data.message,
          data: Get_Axios.data.data,
          status: true,
        };
      }
      case 500: {
        return {
          message: Get_Axios.data.message,
          data: [],
          status: false,
        };
      }

      //요청의 구문이 잘못 됨
      case 400:
      case 403:
      case 404: {
        return {
          data: [],
          status: false,
          message: Get_Axios.data.message,
        };
      }
      // 토큰이 없음
      case 600: {
        localStorage.clear();
        if (window.location.pathname !== "/") {
          return (window.location.href = "/");
        } else {
          return "";
        }
      }

      default:
        throw new Error("AXIOS 에러");
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
