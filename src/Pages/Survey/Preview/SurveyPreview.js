import React, { useState } from "react";
import styled from "styled-components";
import { FiArrowLeft, FiCheckCircle, FiSend, FiX } from "react-icons/fi";
import * as S from "../Create/SurveyStyles";
import FinishPage from "../Response/SurveyFinishPage";

const SurveyPreview = ({
  title,
  description,
  questions,
  isResponseMode = false,
  onSubmit,
}) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const onClose = () => {
    if (window.opener) {
      window.close();
    }
  };

  const handleAnswerChange = (questionId, value, isCheckbox = false) => {
    setAnswers((prev) => {
      if (isCheckbox) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter((a) => a !== value)
          : [...currentAnswers, value];
        return { ...prev, [questionId]: newAnswers };
      }
      return { ...prev, [questionId]: value };
    });
  };

  const handleFinalSubmit = async () => {
    if (!isResponseMode) return; // 미리보기 모드면 작동 안 함

    // 필수 체크
    const missing = questions.filter((q) => q.required && !answers[q.id]);
    if (missing.length > 0) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (window.confirm("설문을 제출하시겠습니까?")) {
      const success = await onSubmit(answers);
      if (success) setSubmitted(true);
    }
  };
  if (submitted) {
    return <FinishPage></FinishPage>;
  }

  return (
    <Overlay>
      <PreviewContainer>
        {/* 상단 닫기 및 가이드 */}
        {!isResponseMode && (
          <PreviewTopBar>
            <span>✨ 미리보기 모드</span>
            <CloseIconButton onClick={onClose}>
              <FiX size={24} />
            </CloseIconButton>
          </PreviewTopBar>
        )}

        <ContentWrapper>
          {/* 설문 헤더 */}
          <PreviewHeaderCard>
            <h1
              dangerouslySetInnerHTML={{ __html: title || "제목 없는 설문지" }}
            />
            <p
              dangerouslySetInnerHTML={{ __html: description || "설명 없음" }}
            />
            <RequiredNotice>* 표시는 필수 질문입니다.</RequiredNotice>
          </PreviewHeaderCard>

          {/* 질문 리스트 */}
          {questions?.map((q, index) => (
            <PreviewCard key={q.id}>
              <QuestionTitle>
                <span className="q-index">{index + 1}.</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: q.title || `질문 ${index + 1}`,
                  }}
                />
                {q.required && <RequiredStar>*</RequiredStar>}
              </QuestionTitle>

              {q.image && (
                <div style={{ margin: "15px 0", textAlign: "center" }}>
                  <img
                    src={q.image}
                    alt="질문 이미지"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                    }}
                  />
                </div>
              )}

              <AnswerSection>
                {/* 단답형 */}
                {q.type === "short" && (
                  <StyledInput
                    type="text"
                    placeholder="내 답변"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                )}

                {/* 장문형 */}
                {q.type === "long" && (
                  <StyledTextarea
                    placeholder="내 답변"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                )}

                {/* 객관식 (Radio) / 체크박스 (Checkbox) */}
                {["multiple", "checkbox"].includes(q.type) && (
                  <OptionList>
                    {q.options?.map((opt, i) => (
                      <OptionLabel key={i}>
                        <input
                          type={q.type === "multiple" ? "radio" : "checkbox"}
                          name={`question-${q.id}`}
                          checked={
                            q.type === "multiple"
                              ? answers[q.id] === opt
                              : (answers[q.id] || []).includes(opt)
                          }
                          onChange={() =>
                            handleAnswerChange(q.id, opt, q.type === "checkbox")
                          }
                        />
                        <span className="opt-text">
                          {opt || `옵션 ${i + 1}`}
                        </span>
                      </OptionLabel>
                    ))}
                  </OptionList>
                )}

                {/* 드롭다운 (Select) */}
                {q.type === "dropdown" && (
                  <StyledSelect
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  >
                    <option value="" disabled>
                      선택하세요
                    </option>
                    {q.options?.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt || `옵션 ${i + 1}`}
                      </option>
                    ))}
                  </StyledSelect>
                )}
                {/* 척도형 */}
                {q.type === "rating" && (
                  <div style={{ padding: "20px 10px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      {/* 작성자가 입력한 커스텀 라벨 표시 */}
                      <span style={{ fontSize: "14px", color: "#64748b" }}>
                        {q.minLabel}
                      </span>
                      <span
                        style={{
                          color: "#0ea5e9",
                          fontSize: "22px",
                          fontWeight: "bold",
                        }}
                      >
                        {answers[q.id] || q.ratingValue || 1}
                      </span>
                      <span style={{ fontSize: "14px", color: "#64748b" }}>
                        {q.maxLabel}
                      </span>
                    </div>

                    <S.StyledSlider
                      type="range"
                      min={q.min || 1}
                      max={q.max || 5}
                      value={answers[q.id] || q.ratingValue || 1}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "8px",
                        color: "#cbd5e1",
                        fontSize: "12px",
                      }}
                    >
                      <span>{q.min || 1}</span>
                      <span>{q.max || 5}</span>
                    </div>
                  </div>
                )}
              </AnswerSection>
            </PreviewCard>
          ))}

          <BottomArea>
            {isResponseMode ? (
              <SubmitButton onClick={handleFinalSubmit}>
                <FiSend /> 설문 답변 제출하기
              </SubmitButton>
            ) : (
              <CancelButton onClick={onClose}>
                <FiArrowLeft /> 미리보기 종료
              </CancelButton>
            )}
          </BottomArea>
        </ContentWrapper>
      </PreviewContainer>
    </Overlay>
  );
};

export default SurveyPreview;

// --- Styled Components (실제 앱 느낌 극대화) ---

// const Overlay = styled.div`
//   position: fixed;
//   inset: 0;
//   background: #f0f2f5;
//   z-index: 2000;
//   overflow-y: auto;
//   padding-bottom: 50px;
// `;

const PreviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PreviewTopBar = styled.div`
  width: 100%;
  background: #1e293b;
  color: #38bdf8;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  font-weight: 600;
  font-size: 14px;
`;

const CloseIconButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  &:hover {
    color: #ef4444;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 770px;
  margin-top: 30px;
  padding: 0 15px;
`;

const PreviewHeaderCard = styled.div`
  background: white;
  border-top: 10px solid #0ea5e9;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  h1 {
    font-size: 32px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 15px;
  }
  p {
    font-size: 15px;
    color: #475569;
    line-height: 1.6;
  }
`;

const RequiredNotice = styled.div`
  color: #ef4444;
  font-size: 13px;
  margin-top: 15px;
`;

const PreviewCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const QuestionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
  .q-index {
    margin-right: 8px;
    color: #0ea5e9;
  }
`;

const RequiredStar = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

const AnswerSection = styled.div`
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px 0;
  border: none;
  border-bottom: 1.5px solid #e2e8f0;
  font-size: 15px;
  &:focus {
    outline: none;
    border-bottom-color: #0ea5e9;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #0ea5e9;
  }
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 15px;
  color: #334155;
  input {
    width: 18px;
    height: 18px;
    accent-color: #0ea5e9;
    cursor: pointer;
  }
  &:hover .opt-text {
    color: #0ea5e9;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  max-width: 300px;
  padding: 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 15px;
  outline: none;
  &:focus {
    border-color: #0ea5e9;
  }
`;
const BottomArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 60px 0 100px;

  .helper-text {
    font-size: 13px;
    color: #94a3b8;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  color: #475569;
  border: 1.5px solid #e2e8f0;
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #1e293b;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Overlay = styled.div`
  position: ${(props) => (props.$isResponse ? "relative" : "fixed")};
  inset: 0;
  background: #f8fafc;
  z-index: ${(props) => (props.$isResponse ? "1" : "2000")};
  overflow-y: auto;
  min-height: 100vh;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  color: white;
  border: none;
  padding: 18px 48px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(14, 165, 233, 0.4);
  }
`;

const FinishContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background: white;
  h2 {
    margin: 25px 0 10px;
    font-weight: 800;
    color: #1e293b;
  }
  p {
    color: #64748b;
    margin-bottom: 40px;
  }
  button {
    padding: 14px 30px;
    background: #f1f5f9;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
  }
`;
