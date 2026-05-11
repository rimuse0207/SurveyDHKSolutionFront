// src/components/TextToolbar.jsx (또는 SurveyCreatePage.jsx 내부)

import styled from "styled-components";

import { CiLink } from "react-icons/ci";
import { Divider } from "../Pages/Survey/Create/SurveyStyles";

const TextToolbar = ({ onAction }) => {
  // 공통 핸들러: 포커스 탈취 방지 및 액션 실행
  const handleAction = (e, command) => {
    e.preventDefault();
    onAction(command);
  };

  return (
    <ToolbarContainer onClick={(e) => e.stopPropagation()}>
      <ToolbarButton
        className="bold"
        title="굵게"
        onMouseDown={(e) => handleAction(e, "bold")} // onClick 대신 onMouseDown
      >
        B
      </ToolbarButton>
      <ToolbarButton
        className="italic"
        title="기울임"
        onMouseDown={(e) => handleAction(e, "italic")}
      >
        I
      </ToolbarButton>
      <ToolbarButton
        className="underline"
        title="밑줄"
        onMouseDown={(e) => handleAction(e, "underline")}
      >
        U
      </ToolbarButton>
      <ToolbarButton
        style={{ fontSize: "1.3em" }}
        title="링크 삽입"
        onMouseDown={(e) => handleAction(e, "createLink")}
      >
        <CiLink />
      </ToolbarButton>
      {/* <Divider style={{ height: "20px", margin: "0 4px", width: "1px" }} /> */}
      <ToolbarButton
        title="서식 삭제"
        onMouseDown={(e) => handleAction(e, "removeFormat")}
      >
        Tx
      </ToolbarButton>
    </ToolbarContainer>
  );
};

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  position: static; /* 둥둥 떠다니는 것 해제 */
  box-shadow: none; /* 팝업 그림자 제거 */
  border: none; /* 팝업 테두리 제거 */
`;

const ToolbarButton = styled.button`
  background: none;
  padding: 6px 10px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 16px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
  }
  &.bold {
    font-weight: bold;
  }
  &.italic {
    font-style: italic;
  }
  &.underline {
    text-decoration: underline;
  }
`;

// ⚠️ 수정: input에서 div로 변경됨에 따라 스타일 조정
const TitleInput = styled.div`
  width: 100%;
  font-size: 32px;
  font-weight: 500;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 10px 0;
  margin-bottom: 10px;
  color: #202124;
  outline: none;

  &:empty:before {
    content: attr(placeholder);
    color: #bdc1c6;
  }

  &:focus {
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DescInput = styled(TitleInput)`
  font-size: 14px;
  font-weight: 400;
  color: #70757a;
  border-bottom: 1px solid transparent;

  &:focus {
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

export default TextToolbar;
