import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiEye,
  FiBarChart2,
  FiTrash2,
  FiPlus,
  FiMessageSquare,
  FiCopy,
  FiSlash,
} from "react-icons/fi";
import useSurveys from "../../../Hooks/Survey/useSurveys";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SurveySetupModal from "./Modal/SurveySetupModal";
import { Request_Get_Axios } from "../../../API";
import moment from "moment";

const SurveyDashboard = () => {
  const Navigate = useNavigate();
  const { surveys, loading, error, deleteSurvey, closeSurvey, copySurveyUrl } =
    useSurveys();
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const userInfo = useSelector((state) => state.login.user);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading)
    return <FullScreenState>데이터를 불러오는 중...</FullScreenState>;
  if (error) return <FullScreenState $isError>{error}</FullScreenState>;

  const handleOpenSetup = () => {
    setIsSetupModalOpen(true);
  };

  const handleConfirmSetup = () => {
    setIsSetupModalOpen(false);
    Navigate("/survey/create/editor");
  };

  const handlePreviewClick = async (surveyId) => {
    try {
      setIsFetching(true);

      const response = await Request_Get_Axios(
        `/Select/SelectSurvey/${surveyId}/detail`,
      );

      if (response.status) {
        const previewData = {
          title: response.data[0]?.title || "제목 없음",
          description: response.data[0]?.description || "",
          questions: response.data.questions,
        };
        localStorage.setItem(
          "survey_preview_temp",
          JSON.stringify(previewData),
        );

        const width = 850;
        const height = 900;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        window.open(
          "/survey/preview", // 미리보기 전용 라우트 경로
          "_blank",
          `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
        );
      }
    } catch (error) {
      alert("상세 정보를 불러오지 못했습니다.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleResultClick = (surveyUuid) => {
    const width = 1200;
    const height = 900;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // 🚀 새 창 팝업으로 열기
    window.open(
      `/survey/result/${surveyUuid}`,
      `Result_${surveyUuid}`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );
  };

  function isPastEndDate(endDate) {
    const now = moment();

    const end = moment(endDate);

    return now.isAfter(end);
  }

  return (
    <MainContainer>
      {/* 배경색을 하늘색 그라데이션으로 변경 */}
      <WelcomeBanner>
        <BannerLeft>
          <UserProfileCard>
            <Avatar>{userInfo?.name[0]}</Avatar>
            <UserDetail>
              <CompanyBadge>{userInfo?.company}</CompanyBadge>
              <UserInfoText>
                <UserName>
                  {userInfo?.name} {userInfo?.position}
                </UserName>
                <UserDept>{userInfo?.department}</UserDept>
              </UserInfoText>
            </UserDetail>
          </UserProfileCard>
          <div>
            <WelcomeTitle>설문 관리 대시보드</WelcomeTitle>
            <WelcomeSubTitle>
              생성된 설문을 관리하고 결과를 실시간으로 확인하세요.
            </WelcomeSubTitle>
          </div>
        </BannerLeft>

        <CreateButton onClick={handleOpenSetup}>
          <FiPlus style={{ marginRight: "8px" }} /> 새 설문 만들기
        </CreateButton>
      </WelcomeBanner>

      <Section>
        <SectionHeader>
          <SectionTitle>전체 설문 ({surveys.length})</SectionTitle>
        </SectionHeader>

        <SurveyGrid>
          {surveys.map((survey) => (
            <SurveyCard
              key={survey.survey_id}
              $isClosed={survey.status === "closed"}
            >
              <StatusRibbon
                $status={
                  isPastEndDate(survey.end_date) ? "closed" : survey.status
                }
              >
                {survey.status === "active" && !isPastEndDate(survey.end_date)
                  ? "진행 중"
                  : "종료"}
              </StatusRibbon>
              <CardContent>
                <SurveyInfo>
                  <SurveyTitle
                    dangerouslySetInnerHTML={{ __html: survey.title || "" }}
                  ></SurveyTitle>
                  <SurveyDesc
                    dangerouslySetInnerHTML={{
                      __html: survey.description || "설명 없음",
                    }}
                  ></SurveyDesc>
                </SurveyInfo>

                <CardMeta>
                  <MetaItem>
                    {/* 아이콘 색상을 하늘색으로 변경 */}
                    <FiMessageSquare
                      size={16}
                      color="#0ea5e9"
                      style={{ marginRight: "6px" }}
                    />
                    <span>
                      응답 <BoldText>{survey.r_count || 0}</BoldText> 건
                    </span>
                  </MetaItem>

                  <div>
                    <MetaDate>생성일: {formatDate(survey.created_at)}</MetaDate>
                    <MetaDate>마감일: {formatDate(survey.end_date)}</MetaDate>
                  </div>
                </CardMeta>
              </CardContent>

              <CardActions>
                <ActionButton
                  onClick={() => handlePreviewClick(survey.survey_id)}
                  disabled={isFetching}
                  title="미리 보기"
                >
                  <FiEye />{" "}
                  <span>{isFetching ? "로딩 중..." : "미리보기"}</span>
                </ActionButton>

                {/* 2. 결과 분석 (FiBarChart2) */}
                <ActionButton
                  onClick={() => handleResultClick(survey.survey_uuid)}
                  title="결과 분석"
                >
                  <FiBarChart2 />
                  <span>결과분석</span>
                </ActionButton>

                {/* 3. 링크 복사 (FiCopy) */}
                <ActionButton
                  onClick={() => copySurveyUrl(survey.survey_uuid)}
                  title="링크 복사"
                >
                  <FiCopy />
                  <span>링크복사</span>
                </ActionButton>

                <ActionButton
                  onClick={() => closeSurvey(survey.survey_id)}
                  disabled={
                    survey.status === "closed" || isPastEndDate(survey.end_date)
                  }
                  $isWarning={survey.status === "active"}
                  title="조기 마감"
                >
                  <FiSlash />
                  <span>
                    {survey.status === "active" ? "조기마감" : "마감됨"}
                  </span>
                </ActionButton>

                {/* 5. 삭제 (FiTrash2) */}
                <ActionButton
                  $isDelete
                  onClick={() => deleteSurvey(survey.survey_id)}
                  title="설문 삭제"
                >
                  <FiTrash2 />
                  <span>삭제</span>
                </ActionButton>
              </CardActions>
            </SurveyCard>
          ))}
        </SurveyGrid>

        {surveys.length === 0 && (
          <EmptyStateWrapper>
            <EmptyStateIcon />
            <EmptyStateText>아직 생성된 설문이 없습니다.</EmptyStateText>
          </EmptyStateWrapper>
        )}
      </Section>
      {/* 4. 모달 컴포넌트 배치 */}
      <SurveySetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onConfirm={handleConfirmSetup}
      />
    </MainContainer>
  );
};

export default SurveyDashboard;

// --- Styled Components (Sky Blue Theme) ---

const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e0f2fe;
  margin-bottom: 20px;
  &::before {
    content: "📋";
    font-size: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MainContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding-bottom: 50px;
`;
// 기존 WelcomeBanner 수정
const WelcomeBanner = styled.div`
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  padding: 60px 7%; // 패딩을 조금 더 확보
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-end; // 바닥 정렬로 더 안정감 있게
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.15);
  position: relative;
  overflow: hidden;

  /* 배경에 은은한 원형 패턴 추가 (세련미) */
  &::after {
    content: "";
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
`;

const BannerLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const UserProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.15); // 유리창 효과
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  align-self: flex-start;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background: white;
  color: #0ea5e9;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  font-size: 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const UserDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CompanyBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const UserInfoText = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: 700;
`;

const UserDept = styled.span`
  font-size: 13px;
  opacity: 0.85;
  font-weight: 400;
`;

// WelcomeTitle 및 SubTitle 간격 미세 조정
const WelcomeTitle = styled.h1`
  font-size: 34px; // 조금 더 키움
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const WelcomeSubTitle = styled.p`
  font-size: 17px;
  opacity: 0.95;
  font-weight: 400;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.$secndary ? "white" : "rgba(255, 255, 255, 0.2)"};
  color: ${(props) => (props.$secndary ? "#0ea5e9" : "white")};
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 600;
  border: ${(props) =>
    props.$secndary
      ? "1px solid #bae6fd"
      : "1px solid rgba(255, 255, 255, 0.3)"};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;

  &:hover {
    background-color: ${(props) => (props.$secndary ? "#f0f9ff" : "white")};
    color: #0ea5e9;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(14, 165, 233, 0.2);
  }
`;

const Section = styled.section`
  padding: 40px 7%;
  animation: ${fadeIn} 0.5s ease;
`;

const SectionHeader = styled.div`
  margin-bottom: 25px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 15px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
`;

const SurveyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
`;

const SurveyCard = styled.div`
  background: white;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;

  ${(props) =>
    props.$isClosed &&
    `
    filter: grayscale(0.8);
    opacity: 0.8;
  `}

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(14, 165, 233, 0.1);
    border-color: #bae6fd;
  }
`;

const StatusRibbon = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.$status === "active" ? "#e0f2fe" : "#f1f5f9"};
  color: ${(props) => (props.$status === "active" ? "#0284c7" : "#64748b")};
`;

const CardContent = styled.div`
  padding: 30px;
  padding-top: 45px;
  flex-grow: 1;
`;

const SurveyInfo = styled.div`
  margin-bottom: 25px;
  min-height: 90px;
`;

const SurveyTitle = styled.h3`
  font-size: 19px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SurveyDesc = styled.p`
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  border-top: 1px solid #f1f5f9;
  padding-top: 15px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #64748b;
`;

const BoldText = styled.span`
  font-weight: 700;
  color: #0ea5e9; /* 강조 텍스트도 하늘색으로 */
  font-size: 15px;
  margin: 0 2px;
`;

const MetaDate = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;
const CardActions = styled.div`
  display: grid;
  /* 5개 버튼이 동일한 비율로 배치됨 */
  grid-template-columns: repeat(5, 1fr);
  background-color: #f8fafc;
  border-top: 1px solid #f1f5f9;
`;

const ActionButton = styled.button`
  display: flex;
  flex-direction: column; /* 아이콘 아래에 텍스트 배치 */
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  padding: 12px 0;
  cursor: pointer;
  transition: all 0.2s;
  color: #475569;

  /* 구분선 */
  &:not(:last-child) {
    border-right: 1px solid #f1f5f9;
  }

  /* 텍스트 스타일 */
  span {
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap; /* 글자 줄바꿈 방지 */
  }

  /* 아이콘 스타일 */
  svg {
    font-size: 18px;
  }

  /* 호버 및 특수 상태 스타일 */
  &:hover {
    background-color: #e0f2fe;
    color: #0ea5e9;

    ${(props) =>
      props.$isDelete &&
      `
      background-color: #fef2f2;
      color: #ef4444;
    `}

    ${(props) =>
      props.$isWarning &&
      `
      background-color: #fff7ed;
      color: #f59e0b;
    `}
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    filter: grayscale(1);
  }

  /* 삭제 버튼 전용 색상 */
  ${(props) =>
    props.$isDelete &&
    `
    color: #94a3b8; /* 평소엔 무채색이었다가 호버 시 빨간색으로 */
  `}
`;

const FullScreenState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 16px;
  color: ${(props) => (props.$isError ? "#ef4444" : "#0ea5e9")};
`;

const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  background: white;
  border-radius: 16px;
  border: 2px dashed #bae6fd;
  margin-top: 30px;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  color: #64748b;
  margin-bottom: 20px;
`;
