// src/routes/index.jsx
import { Routes, Route } from "react-router-dom";

import SurveyList from "../Pages/Survey/Select/SurveyList";
import SurveyCreatePage from "../Pages/Survey/Create/SurveyCreatePage";
import SurveyPreviewPage from "../Pages/Survey/Preview/SurveyPreviewPage";
import SurveyResponsePage from "../Pages/Survey/Response/SurveyResponsePage";
import SurveyResultPage from "../Pages/Survey/Result/SurveyResultPage";
import AdminLoginPage from "../Pages/Login/LoginPage";
import PasswordChangePage from "../Pages/Login/PasswordChangePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 설문 목록 조회 */}
      {/* <Route path="/" element={<SurveyListPage />} /> */}

      <Route path="/" element={<AdminLoginPage />} />
      <Route
        path="/ChangePassword"
        element={<PasswordChangePage></PasswordChangePage>}
      ></Route>
      <Route path="/survey" element={<SurveyList />} />
      {/* 설문 작성 */}
      <Route path="/survey/create/editor" element={<SurveyCreatePage />} />
      <Route path="/survey/preview" element={<SurveyPreviewPage />} />
      <Route path="/survey/response/:uuid" element={<SurveyResponsePage />} />
      <Route path="/survey/result/:uuid" element={<SurveyResultPage />} />

      {/* 설문 수정 */}
      {/* <Route path="/edit/:id" element={<SurveyEditPage />} /> */}

      {/* 설문 상세 및 결과 조회 */}
      {/* <Route path="/view/:id" element={<SurveyDetailPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;
