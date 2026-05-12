import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as XLSX from "xlsx";
import {
  FiArrowLeft,
  FiUsers,
  FiPieChart,
  FiBarChart2,
  FiCalendar,
  FiDownload,
} from "react-icons/fi";
import { Request_Get_Axios } from "../../../API";

const SurveyResultPage = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResultData();
  }, [uuid]);

  const fetchResultData = async () => {
    try {
      const res = await Request_Get_Axios(`/Select/SurveyResult/${uuid}`);
      console.log(res);
      if (res.status) setData(res.data);
    } catch (err) {
      alert("데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    if (!data || !data.responderDetails) return;

    // 1. 데이터 가공: 기명/무기명 공통 로직
    const excelData = data.responderDetails.map((resp) => {
      // 기본 정보 (이름, 이메일, 소속, 참여시간)
      const row = {
        성함: resp.info.name,
        이메일: resp.info.email,
        소속: resp.info.company,
        참여시간: new Date(resp.info.date).toLocaleString(),
      };

      // 각 질문별 답변 매칭
      data.questions.forEach((q) => {
        const qTitle = q.title.replace(/<[^>]*>?/gm, "");
        let answer = resp.answers[q.id] || "-";

        // 💡 범위형일 경우 답변 뒤에 라벨 정보가 있다면 붙여줌
        if (q.type === "rating" && answer !== "-") {
          const opt = q.options.find((o) => o.text === answer);
          if (opt && opt.label) {
            answer = `${answer}점 (${opt.label})`;
          } else {
            answer = `${answer}점`;
          }
        }

        row[qTitle] = answer;
      });

      return row;
    });

    // 2. 워크시트 및 워크북 생성
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "설문결과데이터");

    // 💡 Sophisticated Tip: 컬럼 넓이 자동 조절
    if (excelData.length > 0) {
      const wscols = Object.keys(excelData).map((key) => ({
        wch: Math.max(key.length * 2, 15), // 헤더 길이에 맞춰 조절
      }));
      worksheet["!cols"] = wscols;
    }

    // 3. 파일 저장
    XLSX.writeFile(workbook, `${data.survey.title}_결과분석.xlsx`);
  };

  if (loading) return <LoadingScreen>데이터 분석 중...</LoadingScreen>;
  if (!data) return <LoadingScreen>결과를 찾을 수 없습니다.</LoadingScreen>;

  return (
    <PageContainer>
      {/* 상단 헤더 영역 */}
      <HeaderSection>
        <BackButton onClick={() => window.close()}>결과분석 닫기</BackButton>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <TitleGroup>
            <h1>{data.survey.title} 결과 분석</h1>
            <p>{data.survey.description}</p>
          </TitleGroup>

          {/* 엑셀 다운로드 버튼 추가 */}
          <ExcelButton onClick={handleDownloadExcel}>
            <FiDownload /> 엑셀 다운로드
          </ExcelButton>
        </div>

        {/* 요약 카드 */}
        <SummaryGrid>
          <SummaryCard>
            <div className="icon-box blue">
              <FiUsers />
            </div>
            <div className="text-box">
              <span className="label">총 응답자</span>
              <span className="value">{data.totalResponses || 0}명</span>
            </div>
          </SummaryCard>
          <SummaryCard>
            <div className="icon-box green">
              <FiCalendar />
            </div>
            <div className="text-box">
              <span className="label">설문 상태</span>
              <span className="value">
                {data.survey.status === "active" ? "진행 중" : "종료"}
              </span>
            </div>
          </SummaryCard>
        </SummaryGrid>
      </HeaderSection>

      <ContentSection>
        {data.questions.map((q, idx) => (
          <ResultCard key={q.id}>
            <QHeader>
              <span className="q-idx">질문 {idx + 1}</span>
              <h2 dangerouslySetInnerHTML={{ __html: q.title }} />
              <span className="q-type">
                {q.type === "short" || q.type === "long"
                  ? "주관식"
                  : q.type === "rating"
                    ? "범위형"
                    : "객관식"}
              </span>
            </QHeader>
            {q.type === "rating" && (
              <AverageBadge>
                평균 점수:{" "}
                {(
                  q.options.reduce(
                    (acc, cur) => acc + Number(cur.text) * cur.count,
                    0,
                  ) / (data.totalResponses || 1)
                ).toFixed(1)}
                점
              </AverageBadge>
            )}

            {q.image_data && (
              <QuestionImageWrapper>
                <img
                  src={q.image_data}
                  alt={`질문 ${idx + 1} 이미지`}
                  // 혹시 프리뷰처럼 클릭 시 크게 보기 기능이 필요하다면 여기에 추가
                />
              </QuestionImageWrapper>
            )}

            <QBody>
              {["multiple", "checkbox", "dropdown", "rating"].includes(
                q.type,
              ) ? (
                <ChartArea>
                  {q.options.map((opt) => {
                    const totalPeople = data.totalResponses || 0;
                    const percentage =
                      totalPeople > 0
                        ? Math.round((opt.count / totalPeople) * 100)
                        : 0;

                    return (
                      <BarRow key={opt.text}>
                        <div className="label-row">
                          <span>
                            {/* 점수 뒤에 라벨이 있다면 함께 표시 (예: 1점 (매우 나쁨)) */}
                            {q.type === "rating" ? (
                              <>
                                <b style={{ color: "#1e293b" }}>{opt.text}점</b>
                                {opt.label && (
                                  <span
                                    style={{
                                      marginLeft: "8px",
                                      color: "#94a3b8",
                                      fontSize: "12px",
                                    }}
                                  >
                                    ({opt.label})
                                  </span>
                                )}
                              </>
                            ) : (
                              opt.text
                            )}
                          </span>
                          <span className="percent">
                            {percentage}% ({opt.count}명)
                          </span>
                        </div>
                        <div className="bar-bg">
                          <BarFill $width={Math.min(percentage, 100)} />
                        </div>
                      </BarRow>
                    );
                  })}
                </ChartArea>
              ) : (
                <TextAnswerArea>
                  <p className="sub-label">최근 응답 데이터</p>
                  {q?.answers?.length > 0 ? (
                    q?.answers?.map((ans, i) => (
                      <div className="text-item" key={i}>
                        "{ans}"
                      </div>
                    ))
                  ) : (
                    <div className="empty">응답이 없습니다.</div>
                  )}
                </TextAnswerArea>
              )}
            </QBody>
          </ResultCard>
        ))}
      </ContentSection>
      {data.survey.is_anonymous === 0 && (
        <ResultCard style={{ marginTop: "40px", overflowX: "auto" }}>
          <QHeader>
            <span className="q-idx">Detail Report</span>
            <h2>응답자별 상세 답변 내역</h2>
            <p style={{ color: "#94a3b8", fontSize: "13px" }}>
              기명 설문으로 참여자 정보와 답변이 매칭됩니다.
            </p>
          </QHeader>

          <StyledTable>
            <thead>
              <tr>
                <th>참여자 정보</th>
                {data.questions.map((q) => (
                  <th key={q.id}>
                    {q.title.replace(/<[^>]*>?/gm, "").substring(0, 10)}...
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.responderDetails.map((resp, idx) => (
                <tr key={idx}>
                  <td className="user-info">
                    <div className="name">{resp.info.name}</div>
                    <div className="sub">
                      {resp.info.email} | {resp.info.company}
                    </div>
                  </td>
                  {data.questions.map((q) => (
                    <td key={q.id} className="answer-cell">
                      {resp.answers[q.id] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </ResultCard>
      )}
    </PageContainer>
  );
};

export default SurveyResultPage;

// --- Styled Components (Sophisticated Sky Blue Style) ---

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f1f5f9;
  padding-bottom: 100px;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  padding: 40px 10% 120px 10%;
  color: white;
`;

const TitleGroup = styled.div`
  margin-top: 30px;
  h1 {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 10px;
  }
  p {
    opacity: 0.8;
    font-size: 15px;
  }
`;

const SummaryGrid = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 40px;
  position: absolute;
  width: 80%;
  max-width: 1200px;
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);

  .icon-box {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    &.blue {
      background: #f0f9ff;
      color: #0ea5e9;
    }
    &.green {
      background: #f0fdf4;
      color: #22c55e;
    }
  }

  .text-box {
    .label {
      display: block;
      font-size: 13px;
      color: #94a3b8;
      font-weight: 600;
    }
    .value {
      font-size: 20px;
      font-weight: 800;
      color: #1e293b;
    }
  }
`;

const ContentSection = styled.div`
  margin-top: 100px;
  padding: 0 10%;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
`;

const QHeader = styled.div`
  margin-bottom: 30px;
  .q-idx {
    color: #0ea5e9;
    font-weight: 700;
    font-size: 14px;
  }
  h2 {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 8px 0;
  }
  .q-type {
    font-size: 12px;
    color: #94a3b8;
    background: #f8fafc;
    padding: 4px 8px;
    border-radius: 6px;
  }
`;

const BarRow = styled.div`
  .label-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #475569;
  }
  .percent {
    color: #0ea5e9;
  }
  .bar-bg {
    background: #f1f5f9;
    height: 12px;
    border-radius: 10px;
    overflow: hidden;
  }
`;

const BarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%);
  width: ${(props) => props.$width}%;
  transition: width 1s ease-in-out;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  &:hover {
    background: white;
    color: #0ea5e9;
  }
`;

// 질문 카드의 본문 영역
const QBody = styled.div`
  width: 100%;
  padding-top: 10px;

  /* 애니메이션 효과: 차트가 부드럽게 나타나도록 함 */
  animation: fadeIn 0.8s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 객관식 결과 - 막대 그래프 전체 래퍼
const ChartArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px; /* 항목 간 간격 */
`;

// 주관식 결과 - 답변 리스트 래퍼
const TextAnswerArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .sub-label {
    font-size: 13px;
    color: #94a3b8;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 6px;
    &::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 14px;
      background: #38bdf8;
      border-radius: 2px;
    }
  }

  .text-item {
    background: #f8fafc;
    padding: 18px 24px;
    border-radius: 16px;
    font-size: 14px;
    color: #334155;
    line-height: 1.6;
    border: 1px solid #f1f5f9;
    transition: all 0.2s ease;

    &:hover {
      background: #f0f9ff;
      border-color: #bae6fd;
      transform: translateX(5px);
    }
  }

  .empty {
    text-align: center;
    padding: 40px;
    color: #cbd5e1;
    font-size: 14px;
    background: #f8fafc;
    border-radius: 16px;
    border: 1px dashed #e2e8f0;
  }
`;

// 로딩 화면 스타일
const LoadingScreen = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  color: #0ea5e9;
  font-weight: 700;
  gap: 15px;

  /* 로딩 스피너 애니메이션 (필요시 추가) */
  &::after {
    content: "";
    width: 30px;
    height: 30px;
    border: 3px solid #e0f2fe;
    border-top-color: #0ea5e9;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ExcelButton = styled.button`
  background: #10b981; // 세련된 그린 컬러
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);

  &:hover {
    background: #059669;
    transform: translateY(-2px);
  }
`;
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 14px;

  th {
    background: #f8fafc;
    color: #64748b;
    padding: 15px;
    text-align: left;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
  }

  td {
    padding: 15px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  .user-info {
    min-width: 200px;
    .name {
      font-weight: 700;
      color: #1e293b;
    }
    .sub {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 4px;
    }
  }

  .answer-cell {
    color: #475569;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  tr:hover {
    background-color: #f0f9ff;
  }
`;

const QuestionImageWrapper = styled.div`
  width: 100%;
  margin: 0 auto 30px auto; /* 중앙 정렬 및 하단 여백 */
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08); /* 세련된 그림자 */
  border: 2px solid #e0f2fe; /* 은은한 하늘색 테두리 */

  img {
    width: 100%;
    max-height: 400px;
    height: auto;
    display: block;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02); /* 마우스 호버 시 살짝 확대 효과 */
    }
  }
`;

const AverageBadge = styled.div`
  display: inline-block;
  background: #f0f9ff;
  color: #0ea5e9;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 15px;
  border: 1px solid #bae6fd;
`;
