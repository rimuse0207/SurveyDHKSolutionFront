import React, { useEffect, useState } from "react";
import SurveyPreview from "./SurveyPreview"; // 기존 컴포넌트 재활용

const SurveyPreviewPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("survey_preview_temp");
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  if (!data) return <div>데이터를 불러오는 중...</div>;

  return (
    <SurveyPreview
      title={data.title}
      description={data.description}
      questions={data.questions}
      isFullPage={true}
    />
  );
};

export default SurveyPreviewPage;
