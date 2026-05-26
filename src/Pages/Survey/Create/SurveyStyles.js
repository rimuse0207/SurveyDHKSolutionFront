import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PageContainer = styled.div`
  background-color: #f1f5f9;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const FormHeaderContainer = styled.div`
  background: white;
  width: 100%;
  max-width: 870px;
  border-radius: 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    display: block;
    height: 10px;
    background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%);
  }
`;

export const HeaderContent = styled.div`
  padding: 40px;
`;

export const QuestionCard = styled.div`
  background: white;
  width: 100%;
  max-width: 870px;
  border-radius: 16px;
  padding: 30px;
  margin-top: 20px;
  border: 1px solid ${(props) => (props.isActive ? "#0ea5e9" : "#e2e8f0")};
  position: relative;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  box-shadow: ${(props) =>
    props.isActive
      ? "0 10px 20px -5px rgba(14, 165, 233, 0.15)"
      : "0 1px 3px rgba(0,0,0,0.05)"};

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    background: #0ea5e9;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    opacity: ${(props) => (props.isActive ? 1 : 0)};
  }

  &:hover {
    border-color: #bae6fd;
    transform: translateY(-2px);
  }
`;

export const TitleInput = styled.div`
  width: 100%;
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  padding: 10px 0;
  outline: none;
  border-bottom: 2px solid transparent;
  &:empty:before {
    content: attr(placeholder);
    color: #cbd5e1;
  }
  &:focus {
    border-bottom: 2px solid #0ea5e9;
  }
`;

export const DescInput = styled(TitleInput)`
  font-size: 16px;
  font-weight: 400;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
  &:focus {
    border-bottom: 1px solid #0ea5e9;
  }
`;

export const QuestionRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

export const QuestionTitle = styled.div`
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 18px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  color: #334155;
  outline: none;
  min-height: 50px;
  &:empty:before {
    content: attr(placeholder);
    color: #94a3b8;
  }
  &:focus {
    border-color: #0ea5e9;
    background: white;
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
  }
`;

export const TypeSelectWrapper = styled.div`
  position: relative;
  width: 200px;
`;

export const TypeSelect = styled.select`
  width: 100%;
  padding: 14px;
  font-size: 14px;
  font-weight: 700;
  color: #475569;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  appearance: none;
  cursor: pointer;
  outline: none;
  &:focus {
    border-color: #0ea5e9;
  }
`;

export const AnswerArea = styled.div`
  margin-top: 10px;
  width: 100%;
`;

export const DummyInput = styled.input`
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 1px dashed #e2e8f0;
  background: transparent;
  color: #94a3b8;
  font-size: 14px;
  cursor: not-allowed;
`;

export const QuestionFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
`;

export const RequiredSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 20px;
`;

export const RequiredLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
`;

export const DeleteIconButton = styled.button`
  background: #fff1f2;
  border: none;
  color: #e11d48;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover {
    background: #ffe4e6;
  }
`;

export const AddButton = styled.button`
  margin-top: 40px;
  padding: 16px 40px;
  background: white;
  border: 2px solid #0ea5e9;
  color: #0ea5e9;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 800;
  font-size: 16px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
  &:hover {
    background: #0ea5e9;
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
  }
`;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: #cbd5e1;
    transition: 0.4s;
    border-radius: 24px;
    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
  input:checked + .slider {
    background-color: #0ea5e9;
  }
  input:checked + .slider:before {
    transform: translateX(20px);
  }
`;

// SurveyStyles.js 에 추가

export const InfoSummaryBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: auto; /* 버튼들을 오른쪽으로 밀어냄 */
`;
export const InfoTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #e0f2fe;
  color: #0369a1;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #bae6fd;
  transition: all 0.2s ease;

  /* 클릭 가능한 경우에만 적용되는 스타일 */
  ${(props) =>
    props.$isClickable &&
    `
    cursor: pointer;
    &:hover {
      background: #0ea5e9;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2);
    }
    &:active {
      transform: translateY(0);
    }
  `}

  svg {
    font-size: 14px;
  }
`;

// 기존 ActionBar 수정 (양 끝 정렬을 위해)
export const ActionBar = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  max-width: 820px; /* 태그 공간 확보를 위해 약간 넓힘 */
  display: flex;
  justify-content: space-between; /* 양 끝 정렬 */
  align-items: center;
  padding: 15px 25px;
  z-index: 100;
  background: rgba(241, 245, 249, 0.9); /* 배경과 섞이도록 투명도 */
  backdrop-filter: blur(8px); /* 뒤가 비치는 효과 */
  margin-bottom: 20px;
`;

// SurveyStyles.js 에 추가

export const ImageUploadWrapper = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ImagePreview = styled.div`
  position: relative;
  width: fit-content;
  img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
`;

export const RemoveImageBtn = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  &:hover {
    background: #ef4444;
  }
`;

export const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
  justify-content: center;
`;

export const RatingCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${(props) => (props.active ? "#0ea5e9" : "#e2e8f0")};
  background: ${(props) => (props.active ? "#f0f9ff" : "white")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: ${(props) => (props.active ? "#0ea5e9" : "#64748b")};
  cursor: pointer;
`;

// SurveyStyles.js 에 추가

export const SliderWrapper = styled.div`
  width: 100%;
  padding: 30px 40px;
  background: #f8fafc;
  border-radius: 12px;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const StyledSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: #e2e8f0;
  outline: none;
  transition: background 0.2s;

  /* 슬라이더 손잡이 (Chrome, Safari, Edge) */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #0ea5e9;
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.2s;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 0 0 8px rgba(14, 165, 233, 0.1);
    }
  }

  /* 슬라이더 손잡이 (Firefox) */
  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border: 3px solid white;
    border-radius: 50%;
    background: #0ea5e9;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
`;

export const SliderLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  span {
    font-size: 13px;
    font-weight: 700;
    color: #64748b;
  }
  .current-val {
    color: #0ea5e9;
    font-size: 18px;
  }
`;

// 설정 입력을 위한 행
export const RangeSettingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 14px;
`;

export const RangeInput = styled.select`
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  outline: none;
  &:focus {
    border-color: #0ea5e9;
  }
`;

export const LabelEditInput = styled.input`
  border: none;
  border-bottom: 1px dashed #94a3b8;
  background: transparent;
  padding: 2px 5px;
  font-size: 13px;
  color: #1e293b;
  width: 120px;
  &:focus {
    outline: none;
    border-bottom: 1px solid #0ea5e9;
    color: #0ea5e9;
  }
`;

// SurveyStyles.js

// 이미지 미리보기 영역
export const ImagePreviewWrapper = styled.div`
  position: relative;
  margin: 15px 0;
  max-width: 100%;
  width: fit-content;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;

  img {
    display: block;
    max-width: 100%;
    max-height: 400px; // 너무 크지 않게 제한
    height: auto;
  }
`;

// 이미지 삭제 버튼
export const RemoveImageButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.8);
  color: #ef4444;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    transform: scale(1.1);
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #e2e8f0; /* 연한 회색 */
  margin: 0 10px;
  align-self: center;
`;
