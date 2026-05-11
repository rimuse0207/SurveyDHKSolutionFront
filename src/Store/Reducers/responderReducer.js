import { RESET_RESPONDER, SET_RESPONDER } from "../Actions/surveyTypes";

// 초기 상태: 세션 스토리지에 데이터가 있으면 가져오고 없으면 초기화
const getInitialState = () => {
  const saved = sessionStorage.getItem("survey_responder");
  return saved
    ? JSON.parse(saved)
    : {
        email: "",
        name: "",
        company: "",
        isVerified: false,
        surveyUuid: null,
      };
};

export const responderReducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case SET_RESPONDER:
      const newState = { ...state, ...action.payload };
      sessionStorage.setItem("survey_responder", JSON.stringify(newState));
      return newState;

    case RESET_RESPONDER:
      sessionStorage.removeItem("survey_responder");
      return {
        email: "",
        name: "",
        company: "",
        isVerified: false,
        surveyUuid: null,
      };

    default:
      return state;
  }
};
