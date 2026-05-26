// Components/Modal/SurveySelectModal.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FiX, FiCalendar, FiFileText } from "react-icons/fi";
import { Request_Get_Axios } from "../../../../API";
import moment from "moment";
// import { Request_Get_Axios } from "../../API/index"; // 필요시 API 임포트

const SurveySelectModal = ({ isOpen, onClose, onSelect }) => {
  const [surveyList, setSurveyList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchPastSurveys = async () => {
      setLoading(true);
      try {
        const response = await Request_Get_Axios("/Select/SelectSurvey");
        if (response.status) setSurveyList(response.data);
      } catch (error) {
        console.error("설문 목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPastSurveys();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>복제할 설문지 선택</h3>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <Message>설문 목록을 불러오는 중입니다...</Message>
          ) : surveyList.length === 0 ? (
            <Message>과거에 생성한 설문지가 없습니다.</Message>
          ) : (
            <SurveyList>
              {surveyList.map((survey) => (
                <SurveyItem
                  key={survey.survey_id}
                  onClick={() => onSelect(survey)}
                >
                  <div className="icon-zone">
                    <FiFileText size={24} color="#0ea5e9" />
                  </div>
                  <div className="info-zone">
                    <h4 className="title">
                      {survey.title || "제목 없는 설문지"}
                    </h4>
                    <p className="desc">{survey.description || "설명 없음"}</p>
                    <span className="date">
                      <FiCalendar size={12} style={{ marginRight: "4px" }} />
                      생성일: {moment(survey.created_at).format("YYYY-MM-DD")} |
                      질문 {survey.q_count || 0}개
                    </span>
                  </div>
                </SurveyItem>
              ))}
            </SurveyList>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SurveySelectModal;

// --- Styled Components ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;
const ModalContainer = styled.div`
  background: white;
  width: 100%;
  max-width: 550px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
`;
const ModalHeader = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    margin: 0;
    font-size: 18px;
    color: #1e293b;
    font-weight: 700;
  }
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  &:hover {
    color: #1e293b;
  }
`;
const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  background: #f8fafc;
`;
const Message = styled.div`
  text-align: center;
  color: #64748b;
  padding: 40px 0;
  font-size: 14px;
`;
const SurveyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const SurveyItem = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  gap: 14px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #0ea5e9;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.08);
    transform: translateY(-2px);
  }
  .icon-zone {
    display: flex;
    align-items: center;
  }
  .info-zone {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    .title {
      margin: 0;
      font-size: 15px;
      color: #334155;
      font-weight: 600;
    }
    .desc {
      margin: 0;
      font-size: 13px;
      color: #64748b;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .date {
      font-size: 11px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      margin-top: 2px;
    }
  }
`;
