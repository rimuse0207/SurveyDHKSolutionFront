import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateQuestion,
  addQuestion,
  removeQuestion,
  setBasicInfo,
  resetSurveyForm,
  duplicateQuestion,
  loadSurveyForm, // 여기에 이미 잘 임포트해 두셨네요! 👍
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

  const loadSurveyForCopy = (oldSurveyData, oldSurveyOptions) => {
    if (!oldSurveyData) return;

    // 1. 컴포넌트 로컬 상태(제목, 설명) 업데이트
    setFormTitle(
      oldSurveyData.title ? `${oldSurveyData.title}` : "복사된 설문지",
    );
    setFormDesc(oldSurveyData.description || "");

    // 2. 질문 데이터 복사 + 고유 ID 새로 발급 (React key 깨짐 방지)
    const clonedQuestions = (oldSurveyOptions || []).map((q, index) => ({
      ...q,
      id: `q_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 5)}`,
    }));

    // 4. 리듀서로 액션 디스패치 (Redux Store 업데이트)
    dispatch(
      loadSurveyForm({
        questions: clonedQuestions,
        basicInfo,
      }),
    );
  };

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
      ...basicInfo,
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

    localStorage.setItem("survey_preview_temp", JSON.stringify(previewData));

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
    duplicateQuestion: (id) => dispatch(duplicateQuestion(id)),
    loadSurveyForCopy, // 💡 [추가위치 2] 컴포넌트(UI 페이지)에서 사용할 수 있도록 리턴에 포함!
    handleOpenPreviewWindow,
    handleCloseWindow,
  };
};

export default useSurveyEditor;
