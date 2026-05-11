import React from "react";
import styled from "styled-components";
import useOptionEditor from "../../../Hooks/Survey/useOptionEditor";

const OptionEditor = ({ questionId, type, options }) => {
  const {
    inputRefs,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption,
    handleKeyDown,
  } = useOptionEditor(questionId, options);

  const renderIcon = (index) => {
    if (type === "dropdown") return <OptionNumber>{index + 1}</OptionNumber>;
    if (type === "multiple") return <OptionIcon>○</OptionIcon>;
    if (type === "checkbox") return <OptionIcon>□</OptionIcon>;
    return <OptionIcon>•</OptionIcon>;
  };

  return (
    <OptionContainer>
      {options.map((opt, i) => (
        <OptionRow key={i}>
          {renderIcon(i)}
          <OptionInput
            ref={(el) => (inputRefs.current[i] = el)}
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            placeholder={`옵션 ${i + 1}`}
          />
          {options.length > 1 && (
            <RemoveOptionBtn
              onClick={() => handleRemoveOption(i)}
              tabIndex={-1}
            >
              ×
            </RemoveOptionBtn>
          )}
        </OptionRow>
      ))}

      <AddOptionRow
        onClick={handleAddOption}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
      >
        <OptionIcon>
          {type === "dropdown" ? options.length + 1 : renderIcon(0)}
        </OptionIcon>
        <span className="add-text">옵션 추가 (또는 Enter)</span>
      </AddOptionRow>
    </OptionContainer>
  );
};

export default OptionEditor;

// Styled Components는 기존과 동일...

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;

  &:hover button {
    opacity: 1; /* 마우스 올렸을 때만 삭제 버튼 노출 */
  }
`;

const OptionInput = styled.input`
  border: none;
  border-bottom: 1px solid transparent;
  padding: 8px 0;
  font-size: 14px;
  color: #202124;
  width: 80%;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
    background-color: rgba(
      0,
      170,
      255,
      0.05
    ); /* 포커스 시 아주 연한 하늘색 배경 */
  }
  /* Placeholder 스타일링 */
  &::placeholder {
    color: #9aa0a6; /* 구글 폼과 유사한 연한 회색 */
    font-weight: 400;
  }
`;

const AddOptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  cursor: pointer;

  .add-text {
    font-size: 14px;
    color: #70757a;
    &:hover {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }
  }

  &:focus {
    outline: none;
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.secondary};
    border-radius: 4px;
  }

  &:hover .add-text {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const RemoveOptionBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #70757a;
  cursor: pointer;
  opacity: 0; /* 기본 상태에서는 숨김 (현업 스타일) */
  transition: opacity 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const OptionIcon = styled.span`
  color: ${({ theme }) => theme.colors.border};
  font-size: 18px;
  width: 20px;
  display: flex;
  justify-content: center;
`;

const OptionNumber = styled.span`
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 14px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  /* 드롭다운일 때 숫자를 강조하고 싶다면 하늘색으로 살짝 포인트를 줍니다 */
  color: ${({ theme }) => theme.colors.primary};
`;
