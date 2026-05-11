// 설문 목록 관련 (API)
export const FETCH_SURVEYS_REQUEST = "FETCH_SURVEYS_REQUEST";
export const FETCH_SURVEYS_SUCCESS = "FETCH_SURVEYS_SUCCESS";
export const FETCH_SURVEYS_FAILURE = "FETCH_SURVEYS_FAILURE";

// 개별 설문 CRUD (목록에서 삭제 등)
export const CREATE_SURVEY = "CREATE_SURVEY";
export const DELETE_SURVEY = "DELETE_SURVEY"; // 설문지 자체를 삭제

// 설문 작성 중 질문(Question) 핸들링
export const ADD_QUESTION = "ADD_QUESTION";
export const UPDATE_QUESTION = "UPDATE_QUESTION";
export const REMOVE_QUESTION = "REMOVE_QUESTION"; // 질문 항목을 삭제

// 설문 작성 전 기본 데이터
export const SET_BASIC_INFO = "SET_BASIC_INFO";
export const RESET_SURVEY_FORM = "RESET_SURVEY_FORM";

// 참여자 정보 저장

export const SET_RESPONDER = "SET_RESPONDER";
export const RESET_RESPONDER = "RESET_RESPONDER";
