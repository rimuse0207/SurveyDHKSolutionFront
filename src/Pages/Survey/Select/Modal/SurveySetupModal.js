import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { FiUsers, FiGlobe, FiCalendar, FiCheckCircle } from "react-icons/fi";
import moment from "moment";
import { setBasicInfo } from "../../../../Store/Actions/surveyActions";

const SurveySetupModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialData,
  mode = "create",
}) => {
  const dispatch = useDispatch();
  const isEditMode = mode === "edit";
  // 리덕스 초기값 가져오기
  const basicInfo = useSelector((state) => state.survey.basicInfo);
  useEffect(() => {
    if (isOpen && initialData) {
      setSetup(initialData);
    }
  }, [isOpen, initialData]);

  // 로컬 상태로 관리 후 '시작' 누를 때 리덕스 반영
  const [setup, setSetup] = useState({
    targetType: "internal",
    isAnonymous: false,
    startDate: moment().format("YYYY-MM-DD"),
    endDate: moment().add(1, "month").format("YYYY-MM-DD"),
  });

  if (!isOpen) return null;

  const handleConfirm = () => {
    // 1. 유효성 체크: 마감일이 시작일보다 빨라선 안 됨
    if (moment(setup.endDate).isBefore(setup.startDate)) {
      alert("마감일은 시작일보다 빠를 수 없습니다!");
      return;
    }
    // 2. 리덕스 저장
    dispatch(setBasicInfo(setup));
    // 3. 부모 컴포넌트에서 에디터 이동 로직 실행
    onConfirm();
  };

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <Title>
            {isEditMode ? "설문 환경 설정 수정" : "새 설문 기초 설정"}
          </Title>
          <SubTitle>
            {isEditMode
              ? "작성 중인 설문의 설정을 변경합니다."
              : "설문의 배포 대상과 기간을 먼저 설정해 주세요."}
          </SubTitle>
        </Header>

        <Content>
          {/* 1. 대상 선택 섹션 */}
          <FormGroup>
            <Label>배포 대상 및 보안</Label>
            <GridGroup>
              <SelectCard
                $active={setup.targetType === "external"}
                onClick={() =>
                  setSetup({
                    ...setup,
                    targetType: "external",
                    isAnonymous: true,
                  })
                }
              >
                <FiGlobe size={24} />
                <div className="text-group">
                  <strong>외부용</strong>
                  <span>불특정 다수 (링크 공유)</span>
                </div>
                {setup.targetType === "external" && <CheckBadge />}
              </SelectCard>

              <SelectCard
                $active={setup.targetType === "internal"}
                onClick={() =>
                  setSetup({
                    ...setup,
                    targetType: "internal",
                    isAnonymous: false,
                  })
                }
              >
                <FiUsers size={24} />
                <div className="text-group">
                  <strong>내부용</strong>
                  <span>임직원 전용 (로그인 필요)</span>
                </div>
                {setup.targetType === "internal" && <CheckBadge />}
              </SelectCard>
            </GridGroup>
          </FormGroup>

          {/* 2. 익명성 체크 섹션 */}
          <OptionRow>
            <div className="info">
              <strong>무기명 응답 허용</strong>
              <p>응답자의 개인정보를 수집하지 않습니다.</p>
            </div>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={setup.isAnonymous}
                onChange={(e) =>
                  setSetup({ ...setup, isAnonymous: e.target.checked })
                }
              />
              <span className="slider"></span>
            </ToggleSwitch>
          </OptionRow>

          <Divider />

          {/* 3. 기간 설정 섹션 */}
          <FormGroup>
            <Label>
              <FiCalendar style={{ marginRight: "6px" }} /> 설문 진행 기간
            </Label>
            <DateInputWrapper>
              <div className="date-field">
                <small>시작일</small>
                <input
                  type="date"
                  value={setup.startDate}
                  onChange={(e) =>
                    setSetup({ ...setup, startDate: e.target.value })
                  }
                />
              </div>
              <span className="arrow">~</span>
              <div className="date-field">
                <small>마감일</small>
                <input
                  type="date"
                  value={setup.endDate}
                  onChange={(e) =>
                    setSetup({ ...setup, endDate: e.target.value })
                  }
                />
              </div>
            </DateInputWrapper>
          </FormGroup>
        </Content>

        <Footer>
          <CancelBtn onClick={onClose}>취소</CancelBtn>
          <ConfirmBtn onClick={handleConfirm}>
            {isEditMode ? "설정 변경 완료" : "새로운 설문 생성 시작하기"}
          </ConfirmBtn>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default SurveySetupModal;

// --- Styled Components (Sky Blue Theme) ---

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background: white;
  width: 500px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  padding: 30px;
  color: white;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 8px;
`;
const SubTitle = styled.p`
  font-size: 14px;
  opacity: 0.9;
`;

const Content = styled.div`
  padding: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;
const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
`;

const GridGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const SelectCard = styled.div`
  border: 2px solid ${(props) => (props.$active ? "#0ea5e9" : "#f1f5f9")};
  background: ${(props) => (props.$active ? "#f0f9ff" : "white")};
  padding: 20px 15px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;

  svg {
    color: ${(props) => (props.$active ? "#0ea5e9" : "#94a3b8")};
  }
  .text-group {
    strong {
      display: block;
      font-size: 15px;
      color: #1e293b;
      margin-bottom: 4px;
    }
    span {
      font-size: 11px;
      color: #64748b;
    }
  }
`;

const CheckBadge = styled(FiCheckCircle)`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #0ea5e9;
  font-size: 18px;
`;

const OptionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8fafc;
  border-radius: 12px;
  .info {
    strong {
      display: block;
      font-size: 14px;
      color: #1e293b;
    }
    p {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }
  }
`;

const DateInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  .date-field {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    small {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 600;
    }
    input {
      padding: 10px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      color: #1e293b;
      &:focus {
        border-color: #0ea5e9;
        outline: none;
      }
    }
  }
  .arrow {
    color: #cbd5e1;
    font-weight: bold;
    margin-top: 15px;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 25px 0;
`;

const Footer = styled.div`
  padding: 20px 30px;
  background: #f8fafc;
  display: flex;
  gap: 12px;
`;

const ConfirmBtn = styled.button`
  flex: 2;
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #0284c7;
  }
`;

const CancelBtn = styled.button`
  flex: 1;
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #f1f5f9;
  }
`;

// 토글 스위치 스타일 (간략)
const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
    &:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
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
    transform: translateX(18px);
  }
`;
