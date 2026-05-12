import * as types from "../Actions/surveyTypes";
import moment from "moment";

const initialState = {
  // 1. 설문 기초 설정 (추가됨)
  basicInfo: {
    targetType: "external",
    isAnonymous: true,
    startDate: moment().format("YYYY-MM-DD"),
    endDate: moment().add(1, "month").format("YYYY-MM-DD"),
  },
  // 2. 설문 질문 리스트 (기존 items)
  items: [],
  loading: false,
  error: null,
};

const surveyReducer = (state = initialState, action) => {
  switch (action.type) {
    // --- 기초 정보 관리 ---
    case types.SET_BASIC_INFO:
      return {
        ...state,
        basicInfo: { ...state.basicInfo, ...action.payload },
      };

    case types.RESET_SURVEY_FORM:
      return {
        ...initialState,
        basicInfo: {
          ...initialState.basicInfo,
          startDate: moment().format("YYYY-MM-DD"),
          endDate: moment().add(1, "month").format("YYYY-MM-DD"),
        },
      };

    // --- 기존 설문 목록 및 질문 관리 로직 ---
    case types.FETCH_SURVEYS_REQUEST:
      return { ...state, loading: true };

    case types.FETCH_SURVEYS_SUCCESS:
      return { ...state, loading: false, items: action.payload };

    case types.DELETE_SURVEY:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case types.ADD_QUESTION:
      return { ...state, items: [...state.items, action.payload] };

    case types.UPDATE_QUESTION:
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            const newUpdates = action.payload.updates;
            const updatedItem = { ...item, ...newUpdates };

            if (newUpdates.type) {
              const isOptionType = [
                "multiple",
                "checkbox",
                "dropdown",
              ].includes(newUpdates.type);
              if (
                isOptionType &&
                (!item.options || item.options.length === 0)
              ) {
                updatedItem.options = [""];
              } else if (!isOptionType) {
                updatedItem.options = [];
              }
            }
            updatedItem.options =
              newUpdates.options || updatedItem.options || [];
            return updatedItem;
          }
          return item;
        }),
      };

    case types.REMOVE_QUESTION:
      return {
        ...state,
        items: state.items.filter((q) => q.id !== action.payload),
      };

    case types.DUPLICATE_QUESTION: {
      const index = state.items.findIndex((q) => q.id === action.payload);
      if (index === -1) return state;

      const source = state.items[index];

      // 깊은 복사: 옵션 배열 등 객체 내부의 참조값을 완전히 분리
      const clonedQuestion = {
        ...JSON.parse(JSON.stringify(source)),
        id: `q_${Date.now()}`, // 새 고유 ID 생성
      };

      const newItems = [...state.items];
      newItems.splice(index + 1, 0, clonedQuestion); // 기존 질문 바로 아래 삽입

      return { ...state, items: newItems };
    }

    default:
      return state;
  }
};

export default surveyReducer;
