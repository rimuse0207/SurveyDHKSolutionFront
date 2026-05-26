import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { COMPANY_LIST } from "../../../Configs/PublicGlobalData";
import {
  FiMail,
  FiLock,
  FiBriefcase,
  FiUser,
  FiSend,
  FiChevronDown,
  FiClock,
  FiCheck,
} from "react-icons/fi";

const SurveyAuthForm = ({
  survey,
  authInfo,
  setAuthInfo,
  onSendCode,
  onVerifyCode,
  onSubmit,
}) => {
  const isInternal = survey.target_type === "internal";
  const [emailId, setEmailId] = useState("");
  const [fixedDomain, setFixedDomain] = useState(COMPANY_LIST.domain);

  // 인증 프로세스 상태
  const [isCodeSent, setIsCodeSent] = useState(false); // 코드 발송 여부
  const [isVerified, setIsVerified] = useState(false); // 코드 인증 성공 여부
  const [timeLeft, setTimeLeft] = useState(300); // 5분 (300초)
  const timerRef = useRef(null);
  const [emailError, setEmailError] = useState("");

  // 타이머 로직
  useEffect(() => {
    if (isCodeSent && timeLeft > 0 && !isVerified) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isCodeSent, timeLeft, isVerified]);

  // 초를 분:초 형식으로 변환
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleCompanyChange = (e) => {
    const companyName = e.target.value;
    const companyData = COMPANY_LIST.find((c) => c.name === companyName);
    if (companyData) {
      setFixedDomain(companyData.domain);
      setAuthInfo({
        ...authInfo,
        company: companyName,
        email: `${emailId}@${companyData.domain}`,
      });
    }
  };

  const handleEmailIdChange = (e) => {
    const id = e.target.value;

    // 💡 1. 소속 회사를 먼저 선택했는지 체크
    if (!authInfo.company) {
      setEmailError("먼저 소속 회사를 선택한 후 이메일을 입력해 주세요.");
      return; // 회사가 선택되지 않았다면 여기서 즉시 중단 (입력 방지)
    }

    // 💡 2. 기존의 @ 포함 여부 체크
    if (id.includes("@")) {
      setEmailError("@ 이전의 메일 아이디만 입력해주세요.");
      return;
    } else {
      setEmailError(""); // 에러 조건이 모두 없으면 메시지 초기화
    }

    setEmailId(id);
    setAuthInfo({ ...authInfo, email: `${id}@${fixedDomain}` });
  };

  // 코드 발송 버튼 핸들러
  const handleSendClick = async () => {
    if (!authInfo.company) {
      alert("회사를 선택 해주세요.");
      return;
    }
    if (!emailId) {
      alert("이메일 아이디를 작성 해주세요.");
      return;
    }

    const success = await onSendCode(); // 부모에서 API 호출
    if (success) {
      setIsCodeSent(true);
      setTimeLeft(300); // 타이머 리셋 (재발송 시에도 적용)
      alert("인증 코드가 발송되었습니다.");
    }
  };

  // 코드 인증 확인 버튼 핸들러
  const handleVerifyClick = async () => {
    const success = await onVerifyCode(authInfo.code); // 부모에서 인증 API 호출
    if (success) {
      setIsVerified(true);
      alert("인증에 성공하였습니다!");
    } else {
      alert("인증 코드가 일치하지 않거나 만료되었습니다.");
    }
  };

  return (
    <AuthCard>
      <div className="header">
        <IconCircle $isVerified={isVerified}>
          {isVerified ? (
            <FiCheck size={28} />
          ) : isInternal ? (
            <FiLock size={28} />
          ) : (
            <FiUser size={28} />
          )}
        </IconCircle>
        <h3>
          {isVerified
            ? "인증이 완료되었습니다"
            : isInternal
              ? "사내 인증이 필요합니다"
              : "참여자 정보 입력"}
        </h3>
        <p>
          {isVerified
            ? "이제 설문 참여가 가능합니다. 아래 버튼을 눌러주세요."
            : isInternal
              ? "회사 이메일을 통해 전송된 6자리 코드를 입력해주세요."
              : "참여 정보를 입력 후 시작해주세요."}
        </p>
      </div>

      <FormBody>
        {isInternal ? (
          <>
            {/* 1. 회사 선택 */}
            <InputWrapper>
              <FiBriefcase className="input-icon" />
              <StyledSelect
                value={authInfo.company}
                onChange={handleCompanyChange}
                disabled={isCodeSent || isVerified}
              >
                <option value="" disabled>
                  소속 회사를 선택하세요
                </option>
                {COMPANY_LIST.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </StyledSelect>
              <FiChevronDown className="select-arrow" />
            </InputWrapper>

            {/* 2. 이메일 아이디 입력 */}
            <EmailInputGroup>
              <div className="id-part">
                <FiMail className="input-icon" />
                <input
                  type="text"
                  placeholder={
                    authInfo.company
                      ? "이메일 아이디"
                      : "회사를 먼저 선택해 주세요"
                  } // 회사가 없을 때 힌트 텍스트 변경
                  value={emailId}
                  onChange={handleEmailIdChange}
                  // 💡 회사가 선택되지 않았을 때도 입력창을 비활성화(disabled) 시켜서 실수를 방지할 수 있습니다.
                  disabled={!authInfo.company || isCodeSent || isVerified}
                />
              </div>
              <DomainFixedBox>@{fixedDomain}</DomainFixedBox>
            </EmailInputGroup>
            {emailError && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {emailError}
              </span>
            )}

            {/* 3. 인증코드 입력 및 발송/재발송 */}
            <InputWrapper>
              <FiSend className="input-icon" />
              <input
                type="text"
                placeholder={
                  isCodeSent ? "코드 6자리 입력" : "코드를 발송해주세요"
                }
                value={authInfo.code}
                onChange={(e) =>
                  setAuthInfo({ ...authInfo, code: e.target.value })
                }
                disabled={!isCodeSent || isVerified}
              />
              <SendButton
                onClick={handleSendClick}
                type="button"
                disabled={isVerified}
              >
                {isCodeSent ? "재발송" : "코드 발송"}
              </SendButton>
            </InputWrapper>

            {/* 4. 타이머 및 코드 인증 확인 버튼 (발송 후에만 노출) */}
            {isCodeSent && !isVerified && (
              <VerifySection>
                <TimerBox $isUrgent={timeLeft < 60}>
                  <FiClock style={{ marginRight: "4px" }} />
                  {timeLeft > 0 ? formatTime(timeLeft) : "만료됨"}
                </TimerBox>
                <VerifyButton
                  onClick={handleVerifyClick}
                  disabled={timeLeft === 0}
                >
                  코드 인증하기
                </VerifyButton>
              </VerifySection>
            )}
          </>
        ) : (
          /* 외부용 로직 (이름/회사 필수 체크 필요) */
          <>
            <InputWrapper>
              <FiBriefcase className="input-icon" />
              <input
                type="text"
                placeholder="소속 회사명"
                value={authInfo.company}
                onChange={(e) =>
                  setAuthInfo({ ...authInfo, company: e.target.value })
                }
              />
            </InputWrapper>
            <InputWrapper>
              <FiUser className="input-icon" />
              <input
                type="text"
                placeholder="성함"
                value={authInfo.name}
                onChange={(e) =>
                  setAuthInfo({ ...authInfo, name: e.target.value })
                }
              />
            </InputWrapper>
          </>
        )}

        {/* 5. 최종 제출 버튼: 인증이 완벽히 끝나야 활성화 */}
        <MainSubmitButton
          onClick={onSubmit}
          disabled={
            isInternal ? !isVerified : !authInfo.name || !authInfo.company
          }
        >
          설문 시작하기
        </MainSubmitButton>
      </FormBody>
      <FooterNotice>
        작성한 데이터는 설문이외에 다른 곳에 활용되지 않습니다.
      </FooterNotice>
    </AuthCard>
  );
};

export default SurveyAuthForm;

// --- Styled Components ---

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MainSubmitButton = styled.button`
  margin-top: 10px;
  padding: 16px;
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
  }
`;

const FooterNotice = styled.div`
  margin-top: 30px;
  font-size: 12px;
  color: #cbd5e1;
`;

const EmailInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  .id-part {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;

    .input-icon {
      position: absolute;
      left: 16px;
      color: #94a3b8;
      font-size: 18px;
    }

    input {
      width: 100%;
      padding: 15px 16px 15px 48px;
      background: #f8fafc;
      border: 1.5px solid #f1f5f9;
      border-radius: 12px;
      font-size: 15px;
      &:focus {
        border-color: #38bdf8;
        background: white;
      }
    }
  }
`;

const DomainFixedBox = styled.div`
  padding: 15px 20px;
  background: #f1f5f9; /* 고정된 느낌을 주는 연한 회색 배경 */
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  color: #475569;
  font-weight: 600;
  font-size: 14px;
  min-width: 120px;
  text-align: center;
  user-select: none; /* 텍스트 선택 방지 */
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 15px 16px 15px 48px;
  background: #f8fafc;
  border: 1.5px solid #f1f5f9;
  border-radius: 12px;
  font-size: 15px;
  color: #1e293b;
  appearance: none;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #38bdf8;
  }
`;

const AuthCard = styled.div`
  background: white;
  width: 100%;
  max-width: 480px;
  border-radius: 24px;
  padding: 50px 40px;
  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.1);
  text-align: center;
`;

// 입력창 하나를 감싸는 기본 래퍼
const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  /* 좌측 아이콘 스타일 */
  .input-icon {
    position: absolute;
    left: 16px;
    color: #94a3b8; /* 차분한 그레이 */
    font-size: 18px;
    z-index: 10;
    pointer-events: none; /* 아이콘이 클릭을 방해하지 않도록 설정 */
  }

  /* Select 박스 우측 화살표 아이콘 */
  .select-arrow {
    position: absolute;
    right: 16px;
    color: #94a3b8;
    font-size: 16px;
    z-index: 10;
    pointer-events: none;
  }

  /* 내부 input 태그 공통 스타일 */
  input {
    width: 100%;
    padding: 15px 16px 15px 48px; /* 왼쪽 아이콘 공간 확보 */
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    border-radius: 12px;
    font-size: 15px;
    color: #1e293b;
    transition: all 0.2s ease;

    &::placeholder {
      color: #cbd5e1;
    }

    &:focus {
      outline: none;
      border-color: #38bdf8; /* 하늘색 포커스 */
      background: white;
      box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
    }
  }

  /* 내부 select 태그 공통 스타일 */
  select {
    width: 100%;
    padding: 15px 40px 15px 48px; /* 왼쪽 아이콘 + 오른쪽 화살표 공간 확보 */
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    border-radius: 12px;
    font-size: 15px;
    color: #1e293b;
    appearance: none; /* 기본 브라우저 화살표 제거 */
    cursor: pointer;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #38bdf8;
      background: white;
    }

    /* 선택되지 않았을 때(placeholder 느낌) 색상 처리 */
    &:invalid {
      color: #cbd5e1;
    }
  }
`;

// 인증코드 발송 버튼 (InputWrapper 우측에 위치)
const SendButton = styled.button`
  position: absolute;
  right: 8px;
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 20;

  &:hover {
    background: #0284c7;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

const VerifySection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  animation: fadeIn 0.4s ease;
`;

const TimerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.$isUrgent ? "#fef2f2" : "#f0f9ff")};
  color: ${(props) => (props.$isUrgent ? "#ef4444" : "#0ea5e9")};
  border: 1px solid ${(props) => (props.$isUrgent ? "#fee2e2" : "#bae6fd")};
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  min-width: 80px;
`;

const VerifyButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #0f172a;
  }
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

const IconCircle = styled.div`
  width: 64px;
  height: 64px;
  background: ${(props) =>
    props.$isVerified
      ? "#dcfce7"
      : "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)"};
  color: ${(props) => (props.$isVerified ? "#22c55e" : "#0ea5e9")};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.5s ease;
`;
