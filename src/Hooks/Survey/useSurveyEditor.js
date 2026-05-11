import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateQuestion,
  addQuestion,
  removeQuestion,
  setBasicInfo,
  resetSurveyForm,
} from "../../Store/Actions/surveyActions";
import { Request_Post_Axios } from "../../API/index";

const useSurveyEditor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux 상태 구독
  const questions = useSelector((state) => state.survey.items);
  const basicInfo = useSelector((state) => state.survey.basicInfo);

  // 로컬 UI 상태
  const [activeId, setActiveId] = useState(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // 통합 모달 상태

  // 텍스트 포맷팅 (Bold, Italic 등)
  const handleFormat = (command) => {
    if (command === "createLink") {
      const url = prompt("URL을 입력하세요:");
      if (url) document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, null);
    }
  };

  // 서버 저장 로직
  const handleSave = async () => {
    if (!formTitle.trim() || formTitle === "제목 없는 설문지") {
      alert("설문 제목을 입력해주세요!");
      return;
    }

    const payload = {
      ...basicInfo, // 대상, 익명여부, 날짜 등
      title: formTitle,
      description: formDesc,
      questions: questions,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await Request_Post_Axios("/Create/AddSurvey", payload);
      if (response.status) {
        alert("설문지가 성공적으로 저장되었습니다!");
        dispatch(resetSurveyForm());

        // 2. 대시보드(목록) 페이지로 이동
        navigate("/Survey");
      }
    } catch (error) {
      console.error("저장 에러:", error);
      alert("저장에 실패했습니다.");
    }
  };

  // 모달을 통한 기초 정보 일괄 업데이트
  const handleUpdateBasicInfo = (data) => {
    dispatch(setBasicInfo(data));
    setIsModalOpen(false);
  };

  const handleOpenPreviewWindow = () => {
    const previewData = {
      title: formTitle,
      description: formDesc,
      questions: questions,
    };

    // 1. 현재 작성 중인 데이터를 로컬 스토리지에 임시 저장
    localStorage.setItem("survey_preview_temp", JSON.stringify(previewData));

    // 2. 새 창 열기 (가로 800, 세로 900 정도의 팝업)
    const width = 800;
    const height = 900;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      "/survey/preview",
      "_blank",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );
  };

  const handleCloseWindow = () => {
    if (window.opener) {
      // window.open으로 열린 창인 경우
      window.close();
    }
  };

  return {
    // 데이터
    questions,
    basicInfo,
    // UI 상태
    activeId,
    setActiveId,
    isModalOpen,
    setIsModalOpen,
    formTitle,
    setFormTitle,
    formDesc,
    setFormDesc,
    // 핸들러
    handleFormat,
    handleSave,
    handleUpdateBasicInfo,
    // 질문 CRUD (Dispatch)
    addQuestion: () => dispatch(addQuestion()),
    removeQuestion: (id) => dispatch(removeQuestion(id)),
    updateQuestion: (id, updates) => dispatch(updateQuestion(id, updates)),
    handleOpenPreviewWindow,
    handleCloseWindow,
  };
};

export default useSurveyEditor;
