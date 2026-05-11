import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";

const useSurveys = () => {
  const [surveys, setSurveys] = useState([]); // 리스트용 배열
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. 설문 리스트 불러오기
  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    try {
      const response = await Request_Get_Axios("/Select/SelectSurvey");
      // 백엔드 응답이 배열인지 확인 (안전장치)
      setSurveys(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. 특정 설문 삭제 액션
  const deleteSurvey = async (id) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      const result = await Request_Post_Axios(
        `/Select/deleteSurvey/${id}/delete`,
      );

      if (result.status) {
        setSurveys((prev) => prev.filter((s) => s.survey_id !== id));

        return;
      }
      alert("삭제 중 오류가 발생했습니다.");
    } catch (err) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  // 조기마감
  const closeSurvey = async (id) => {
    if (
      !window.confirm("아직 기간이 남았습니다. 정말로 조기 마감하시겠습니까?")
    )
      return;

    try {
      const res = await Request_Post_Axios(`/Select/closeSurvey/${id}/close`);
      if (res.status) {
        // 로컬 상태 업데이트 (다시 불러오지 않고 상태값만 변경)
        setSurveys((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "closed" } : s)),
        );
        alert("설문이 마감되었습니다.");
      } else {
        alert("설문 마감에 실패하였습니다.");
      }
    } catch (err) {
      alert("마감 처리 실패");
    }
  };

  // 설문 URL 복사
  const copySurveyUrl = (id) => {
    // 실제 배포될 도메인 주소로 설정하세요.
    const url = `${window.location.origin}/survey/response/${id}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("설문 주소가 클립보드에 복사되었습니다! 🔗");
      })
      .catch((err) => {
        console.error("복사 실패:", err);
      });
  };

  return {
    surveys,
    loading,
    error,
    fetchSurveys,
    deleteSurvey,
    closeSurvey,
    copySurveyUrl,
  };
};

export default useSurveys;
