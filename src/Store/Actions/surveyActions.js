import * as types from "./surveyTypes";
import axios from "axios";

// [조회] 설문 목록 가져오기
export const fetchSurveys = () => async (dispatch) => {
  dispatch({ type: types.FETCH_SURVEYS_REQUEST });
  try {
    const response = await axios.get("/api/surveys");
    dispatch({ type: types.FETCH_SURVEYS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: types.FETCH_SURVEYS_FAILURE, payload: error.message });
  }
};

// [삭제] 설문지 자체를 삭제 (목록 페이지용)
export const deleteSurvey = (id) => ({
  type: types.DELETE_SURVEY,
  payload: id,
});

// [질문 추가] 작성 페이지에서 새 질문 카드 생성
export const addQuestion = () => ({
  type: types.ADD_QUESTION,
  payload: {
    id: Date.now(),
    type: "short",
    title: "",
    options: [""], // "옵션 1" 대신 빈 문자열
    required: false,
    image: null, // 이미지 공간을 미리 확보
  },
});

// [질문 수정] 제목, 유형, 옵션 등 변경
export const updateQuestion = (id, updates) => ({
  type: types.UPDATE_QUESTION,
  payload: { id, updates },
});

// [질문 삭제] 작성 페이지에서 특정 질문 카드 제거
export const removeQuestion = (id) => ({
  type: types.REMOVE_QUESTION,
  payload: id,
});

// 1. 기초 설정 정보를 저장하는 액션
export const setBasicInfo = (data) => ({
  type: types.SET_BASIC_INFO, // types 파일에 정의한 변수와 매칭
  payload: data,
});

// 2. 작성 중인 모든 양식(기초 정보 + 질문 리스트)을 초기화하는 액션
export const resetSurveyForm = () => ({
  type: types.RESET_SURVEY_FORM,
});
