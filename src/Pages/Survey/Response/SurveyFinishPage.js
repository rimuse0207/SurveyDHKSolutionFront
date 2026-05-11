import React from "react";
import styled, { keyframes } from "styled-components";
import { FiCheckCircle, FiX } from "react-icons/fi";

const FinishPage = () => {
  return (
    <FinishContainer>
      <FinishCard>
        {/* 우측 상단 닫기 아이콘 버튼 (선택 사항) */}
        <CloseIconButton onClick={() => window.close()}>
          <FiX size={24} />
        </CloseIconButton>

        <IconWrapper>
          <FiCheckCircle size={80} color="#0ea5e9" />
          {/* 퍼지는 파동 효과를 위한 데코레이션 */}
          <div className="pulse-ring"></div>
        </IconWrapper>

        <TextGroup>
          <h2>설문 응답 완료!</h2>
          <p>
            소중한 의견을 남겨주셔서 감사합니다.
            <br />
          </p>
        </TextGroup>

        <ButtonGroup>
          <CloseButton onClick={() => window.close()}>창 닫기</CloseButton>
        </ButtonGroup>
      </FinishCard>
    </FinishContainer>
  );
};

export default FinishPage;

// --- Styled Components (Sophisticated Style) ---

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(14, 165, 233, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
`;

const FinishContainer = styled.div`
  min-width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f5f9; /* 배경은 대시보드와 통일 */
  padding: 20px;
`;

const FinishCard = styled.div`
  background: white;
  width: 100%;
  max-width: 500px;
  padding: 60px 40px;
  border-radius: 32px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  position: relative;
  animation: ${fadeIn} 0.6s ease-out;
`;

const IconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;

  .pulse-ring {
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    animation: ${pulse} 2s infinite;
  }
`;

const TextGroup = styled.div`
  h2 {
    font-size: 28px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 16px;
    letter-spacing: -0.5px;
  }
  p {
    font-size: 16px;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 40px;
  }
`;

const ButtonGroup = styled.div`
  width: 100%;
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(14, 165, 233, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(14, 165, 233, 0.3);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CloseIconButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #64748b;
  }
`;

const FooterBranding = styled.div`
  margin-top: 40px;
  font-size: 12px;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 1px;
`;
