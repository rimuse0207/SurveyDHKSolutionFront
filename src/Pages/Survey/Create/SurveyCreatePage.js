import React, { useRef } from "react";
import * as S from "./SurveyStyles";
import styled from "styled-components";
import useSurveyEditor from "../../../Hooks/Survey/useSurveyEditor";

import SurveyPreview from "../Preview/SurveyPreview";
import TextToolbar from "../../../Components/TextToolbar";
import OptionEditor from "./OptionEditor";
import {
  FiUsers,
  FiGlobe,
  FiCalendar,
  FiLock,
  FiUnlock,
  FiX,
  FiImage,
  FiSliders,
  FiXCircle,
} from "react-icons/fi";
import SurveySetupModal from "../Select/Modal/SurveySetupModal";

const SurveyCreatePage = () => {
  const {
    questions,
    activeId,
    setActiveId,

    formTitle,
    setFormTitle,
    formDesc,
    setFormDesc,
    handleFormat,
    handleSave,
    addQuestion,
    removeQuestion,
    updateQuestion,
    isModalOpen,
    setIsModalOpen,
    handleUpdateBasicInfo,
    basicInfo,
    handleOpenPreviewWindow,
  } = useSurveyEditor();

  const fileInputRefs = useRef({});

  const handleFileChange = (questionId, e) => {
    const file = e.target.files[0];

    // 파일이 없으면 즉시 중단
    if (!file) {
      console.error("파일이 선택되지 않았습니다.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("이미지 용량은 10MB 이하만 가능합니다.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result;

      if (base64Data) {
        updateQuestion(questionId, { image: base64Data });
      } else {
        console.error("reader.result가 null입니다. 파일 읽기 실패");
      }
    };

    reader.onerror = () => {
      console.error("FileReader 에러 발생:", reader.error);
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  return (
    <S.PageContainer>
      <ActionBar>
        <S.InfoSummaryBar>
          <S.InfoTag
            onClick={() => setIsModalOpen(true)}
            $isClickable
            title="클릭하여 상세 설정 수정"
          >
            {basicInfo.targetType === "internal" ? <FiUsers /> : <FiGlobe />}
            {basicInfo.targetType === "internal" ? "내부용" : "외부용"}
          </S.InfoTag>

          <S.InfoTag
            onClick={() => setIsModalOpen(true)}
            $isClickable
            title="클릭하여 상세 설정 수정"
          >
            {basicInfo.isAnonymous ? <FiUnlock /> : <FiLock />}
            {basicInfo.isAnonymous ? "무기명" : "기명"}
          </S.InfoTag>

          <S.InfoTag
            onClick={() => setIsModalOpen(true)}
            $isClickable
            title="클릭하여 상세 설정 수정"
          >
            <FiCalendar />
            {basicInfo.startDate} ~ {basicInfo.endDate}
          </S.InfoTag>
        </S.InfoSummaryBar>

        <div style={{ display: "flex", gap: "10px" }}>
          <SecondaryButton onClick={handleOpenPreviewWindow}>
            미리보기 (새창)
          </SecondaryButton>
          <PrimaryButton onClick={handleSave}>저장하기</PrimaryButton>
        </div>
      </ActionBar>

      {/* 헤더 섹션 */}
      <S.FormHeaderContainer onClick={() => setActiveId("header")}>
        <S.HeaderContent>
          <S.TitleInput
            contentEditable
            placeholder="제목 없는 설문지"
            onBlur={(e) => setFormTitle(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: formTitle }}
          />
          <S.DescInput
            contentEditable
            placeholder="설문 설명"
            onBlur={(e) => setFormDesc(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: formDesc }}
          />
        </S.HeaderContent>
      </S.FormHeaderContainer>

      {/* 질문 리스트 */}
      {questions.map((q, index) => (
        <S.QuestionCard
          key={q.id}
          isActive={activeId === q.id}
          onClick={() => setActiveId(q.id)}
        >
          <S.QuestionRow>
            <S.QuestionTitle
              contentEditable
              placeholder={`질문 ${index + 1}`}
              onBlur={(e) =>
                updateQuestion(q.id, { title: e.currentTarget.innerHTML })
              }
              dangerouslySetInnerHTML={{ __html: q.title || "" }}
            />
            <S.TypeSelectWrapper>
              <S.TypeSelect
                value={q.type}
                onChange={(e) => updateQuestion(q.id, { type: e.target.value })}
              >
                <option value="short">- 단답형</option>
                <option value="long">▤ 장문형</option>
                <option value="multiple">◉ 객관식 질문</option>
                <option value="checkbox">▣ 체크박스</option>
                <option value="dropdown">⛛ 드롭다운</option>
                <option value="rating">⊶ 범위형(척도)</option>
              </S.TypeSelect>
            </S.TypeSelectWrapper>
          </S.QuestionRow>

          {/* 질문 이미지 영역 */}
          {q.image && (
            <S.ImagePreviewWrapper>
              <img src={q.image} alt="질문 첨부 이미지" />
              <S.RemoveImageButton
                onClick={() => updateQuestion(q.id, { image: null })}
                title="이미지 삭제"
              >
                <FiXCircle size={20} />
              </S.RemoveImageButton>
            </S.ImagePreviewWrapper>
          )}

          <S.AnswerArea>
            {/* 단답/장문 동일 */}
            {["short", "long"].includes(q.type) && (
              <S.DummyInput disabled placeholder="텍스트" />
            )}

            {/* 객관식/체크박스/드롭다운 동일 */}
            {["multiple", "checkbox", "dropdown"].includes(q.type) && (
              <OptionEditor
                questionId={q.id}
                type={q.type}
                options={q.options}
              />
            )}

            {q.type === "rating" && (
              <S.SliderWrapper>
                {/* 1. 범위 및 라벨 설정 영역 (에디터 전용) */}
                <S.RangeSettingRow>
                  <div>
                    범위:
                    <S.RangeInput
                      value={q.min || 1}
                      onChange={(e) =>
                        updateQuestion(q.id, { min: parseInt(e.target.value) })
                      }
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </S.RangeInput>
                    ~
                    <S.RangeInput
                      value={q.max || 5}
                      onChange={(e) =>
                        updateQuestion(q.id, { max: parseInt(e.target.value) })
                      }
                    >
                      {[...new Array(10)].map((v, j) => (
                        <option key={v} value={j + 1}>
                          {j + 1}
                        </option>
                      ))}
                    </S.RangeInput>
                  </div>
                </S.RangeSettingRow>

                {/* 2. 실제 슬라이더 및 라벨 표시 영역 */}
                <S.SliderLabelRow>
                  <S.LabelEditInput
                    placeholder="ex) 매우 낮음"
                    value={q.minLabel || ""}
                    onChange={(e) =>
                      updateQuestion(q.id, { minLabel: e.target.value })
                    }
                  />

                  <span className="current-val">
                    {q.ratingValue || q.min || 1}
                  </span>

                  <S.LabelEditInput
                    placeholder="ex) 매우 높음"
                    style={{ textAlign: "right" }}
                    value={q.maxLabel || ""}
                    onChange={(e) =>
                      updateQuestion(q.id, { maxLabel: e.target.value })
                    }
                  />
                </S.SliderLabelRow>

                <S.StyledSlider
                  type="range"
                  min={q.min || 1}
                  max={q.max || 5}
                  step="1"
                  value={q.ratingValue || q.min || 1}
                  onChange={(e) =>
                    updateQuestion(q.id, {
                      ratingValue: parseInt(e.target.value),
                    })
                  }
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5px",
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    {q.min || 1}
                  </span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    {q.max || 5}
                  </span>
                </div>
              </S.SliderWrapper>
            )}
          </S.AnswerArea>

          {activeId === q.id && (
            <S.QuestionFooter>
              <div style={{ flex: 1, display: "flex", gap: "10px" }}>
                <TextToolbar onAction={handleFormat} />

                {/* 이미지 추가 버튼 */}
                <input
                  type="file"
                  accept="image/*" // 이미지 파일만 허용
                  ref={(el) => (fileInputRefs.current[q.id] = el)}
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(q.id, e)}
                />
                <ActionButton
                  onClick={() => fileInputRefs.current[q.id].click()}
                  title="이미지 추가"
                >
                  <FiImage /> 이미지 추가
                </ActionButton>
              </div>
              <div
                style={{ display: "flex", alignContent: "center", gap: "15px" }}
              >
                <S.RequiredSection>
                  <S.RequiredLabel>필수 항목</S.RequiredLabel>
                  <S.ToggleSwitch>
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={() =>
                        updateQuestion(q.id, { required: !q.required })
                      }
                    />
                    <span className="slider" />
                  </S.ToggleSwitch>
                </S.RequiredSection>
                <S.Divider />
                <S.DeleteIconButton
                  onClick={() => {
                    if (window.confirm("이 질문을 삭제하시겠습니까?")) {
                      removeQuestion(q.id);
                    }
                  }}
                  title="질문 삭제"
                >
                  🗑️ 삭제
                </S.DeleteIconButton>
              </div>
            </S.QuestionFooter>
          )}
        </S.QuestionCard>
      ))}

      <S.AddButton onClick={addQuestion}>질문 추가하기 (+)</S.AddButton>
      <SurveySetupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleUpdateBasicInfo}
        initialData={basicInfo}
        mode="edit"
      />
    </S.PageContainer>
  );
};

export default SurveyCreatePage;

const ActionBar = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  max-width: 770px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 15px 0;
  z-index: 100;
`;

const PrimaryButton = styled.button`
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2);
  &:hover {
    background: #0284c7;
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background: white;
  color: #0ea5e9;
  border: 1px solid #bae6fd;
  &:hover {
    background: #f0f9ff;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0f9ff;
  color: #0ea5e9;
  border: 1px solid #bae6fd;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #e0f2fe;
    border-color: #7dd3fc;
  }
`;
