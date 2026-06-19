import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Request_Get_Axios, Request_Post_Axios } from "../../../API";
import SurveyPreview from "../Preview/SurveyPreview";
import styled, { keyframes } from "styled-components";
import SurveyAuthForm from "../Auth/SruveyAuthForm";
import { useDispatch, useSelector } from "react-redux";
import { SET_RESPONDER } from "../../../Store/Actions/surveyTypes";

const SurveyResponsePage = () => {
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const [survey, setSurvey] = useState(null);
  const [step, setStep] = useState("auth"); // auth(인증) | survey(작성) | completed(종료)
  const [authInfo, setAuthInfo] = useState({
    email: "",
    name: "",
    company: "",
    code: "",
  });
  const [isVerified, setIsVerified] = useState(false);
  const responder = useSelector((state) => state.responder);
  const [initialAnswers, setInitialAnswers] = useState({});

  useEffect(() => {
    fetchSurveyData();
  }, [uuid]);

  const fetchSurveyData = async () => {
    try {
      // URL의 UUID로 서버에 요청
      const res = await Request_Get_Axios(`/Select/PublicSurvey/${uuid}`);

      if (res.status) {
        const data = res.data;

        setSurvey(data);

        // 🌟 [추가된 로직] 척도형(rating) 질문의 초기값 세팅
        if (data.questions && data.questions.length > 0) {
          const initialAnswers = {};

          data.questions.forEach((q) => {
            if (q.type === "rating") {
              initialAnswers[q.id] = String(q.ratingValue || 3);
            }
          });

          // 만들어진 객체 { 26: '3', 27: '3' } 를 상태에 저장
          setInitialAnswers(initialAnswers);
        }

        // 1. 내부용(internal) -> 인증 단계로
        if (data.target_type === "internal") {
          setStep("auth");
        }
        // 2. 외부용(external) & 무기명(anonymous) -> 바로 시작
        else if (data.is_anonymous === 1) {
          setStep("survey");
        }
        // 3. 외부용(external) & 기명 -> 정보 입력 단계로
        else {
          setStep("auth");
        }
      } else {
        // 종료되었거나 존재하지 않는 UUID인 경우
        setStep("completed");
      }
    } catch (err) {
      setStep("completed");
    }
  };

  // 이메일 인증 코드 발송
  const handleSendCode = async () => {
    const result = await Request_Post_Axios(`/Auth/sendAuthMail`, {
      authInfo,
      uuid,
    });
    if (result.status) {
      return true;
    } else {
      alert("발송에 실패하였습니다. Email을 다시 확인 해 주세요.");
      return false;
    }
  };

  const onVerifyCode = async () => {
    const result = await Request_Post_Axios("/Auth/checkAuthCode", {
      authInfo,
      uuid,
    });
    if (result.status) {
      dispatch({
        type: SET_RESPONDER,
        payload: {
          email: authInfo.email,
          company: authInfo.company || "",
          name: result.data.fullName || "",
          department: result.data.departmentName || "",
          titleName: result.data.titleName || "",
          isVerified: true,
          surveyUuid: uuid, // 현재 설문 ID 고정
        },
      });
      // 사용자 정보 저장하기
      return true;
    } else {
      return false;
    }
  };

  // 인증 및 정보 입력 완료 처리
  const handleAuthSubmit = () => {
    if (survey.target_type === "internal") {
      // 인증 코드 검증 로직 추가 필요
      setStep("survey");
    } else {
      // 외부 기명 설문 (이름, 회사명 체크)
      if (!authInfo.name || !authInfo.company)
        return alert("정보를 입력해주세요.");
      setStep("survey");
    }
  };

  if (step === "completed")
    return (
      <AuthFormContainer>
        <div className="auth-box" style={{ borderTop: "10px solid #38bdf8" }}>
          <CompletedIcon />
          <h3>설문 종료 안내</h3>
          <p>
            본 설문은 설정된 응답 기간이 만료되었거나,
            <br />
            작성자에 의해 조기 종료되었습니다.
          </p>

          <Divider />

          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", marginBottom: "0" }}>
              참여해주셔서 감사합니다.
              <br />
              관련 문의사항은 관리자에게 확인 부탁드립니다.
            </p>
          </div>
        </div>
      </AuthFormContainer>
    );
  if (!survey) return <div>로딩 중...</div>;

  const handleResponseSubmit = async (answers) => {
    try {
      const res = await Request_Post_Axios("/Submit/SubmitSurvey", {
        survey_id: survey.survey_id,
        survey_uuid: uuid,
        responder_info: authInfo,
        answers: answers,
        responder,
      });
      return res.status;
    } catch (err) {
      alert("서버 통신 오류");
      return false;
    }
  };

  return (
    <ResponsePageWrapper>
      {step === "auth" && (
        <SurveyAuthForm
          survey={survey}
          authInfo={authInfo}
          setAuthInfo={setAuthInfo}
          onSendCode={handleSendCode}
          onSubmit={handleAuthSubmit}
          onVerifyCode={onVerifyCode}
        />
      )}

      {step === "survey" && (
        <SurveyPreview
          title={survey.title}
          description={survey.description}
          questions={survey.questions}
          isResponseMode={true}
          onSubmit={handleResponseSubmit}
          initialAnswers={initialAnswers}
        />
      )}

      {step === "completed" && (
        <AuthFormContainer>
          <div className="auth-box" style={{ borderTop: "10px solid #38bdf8" }}>
            <CompletedIcon />
            <h3>설문 종료 안내</h3>
            <p>
              본 설문은 설정된 응답 기간이 만료되었거나,
              <br />
              작성자에 의해 조기 종료되었습니다.
            </p>

            <Divider />

            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", marginBottom: "0" }}>
                참여해주셔서 감사합니다.
                <br />
                관련 문의사항은 관리자에게 확인 부탁드립니다.
              </p>
            </div>
          </div>
        </AuthFormContainer>
      )}
    </ResponsePageWrapper>
  );
};

export default SurveyResponsePage;

const ResponsePageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const AuthFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8fafc; /* 대시보드 배경색과 통일 */
  padding: 20px;
  animation: ${fadeIn} 0.6s ease-out;

  /* 중앙 화이트 카드 박스 */
  .auth-box {
    background: white;
    width: 100%;
    max-width: 460px;
    padding: 50px 40px;
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba(14, 165, 233, 0.1);
    border: 1px solid #f1f5f9;
    border-top: 10px solid #0ea5e9; /* 상단 포인트 컬러 */
    text-align: center;
  }

  h3 {
    font-size: 24px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }

  p {
    font-size: 15px;
    color: #64748b;
    margin-bottom: 35px;
    line-height: 1.6;
  }

  /* 입력 필드 레이아웃 */
  input {
    width: 100%;
    padding: 15px 16px;
    margin-bottom: 16px;
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
      border-color: #38bdf8;
      background: white;
      box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
    }
  }

  /* 이메일 인증 버튼이 포함된 입력 그룹 */
  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;

    input {
      margin-bottom: 0;
      flex: 1;
    }

    button {
      white-space: nowrap;
      padding: 0 20px;
      background: #e0f2fe;
      color: #0284c7;
      border: 1px solid #bae6fd;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #bae6fd;
        color: #0369a1;
      }
    }
  }

  /* 메인 시작 버튼 (그라데이션 적용) */
  .submit-btn {
    width: 100%;
    padding: 18px;
    background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 17px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 15px;
    box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 25px -5px rgba(14, 165, 233, 0.4);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: #cbd5e1;
      box-shadow: none;
      cursor: not-allowed;
      transform: none;
    }
  }

  /* 하단 보안 안내 문구 */
  .security-notice {
    margin-top: 30px;
    font-size: 12px;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
`;

// 스타일 컴포넌트 하단에 추가 또는 수정
const CompletedIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  position: relative;

  &::before {
    content: "✕";
    font-size: 32px;
    color: #94a3b8;
    font-weight: 300;
  }

  /* 장식용 원형 라인 */
  &::after {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 2px dashed #e2e8f0;
    border-radius: 50%;
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Divider = styled.div`
  width: 40px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin: 24px auto;
`;
