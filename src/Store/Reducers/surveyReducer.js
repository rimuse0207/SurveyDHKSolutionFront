import * as types from "../Actions/surveyTypes";
import moment from "moment";

const initialState = {
  basicInfo: {
    targetType: "external",
    isAnonymous: true,
    startDate: moment().format("YYYY-MM-DD"),
    endDate: moment().add(1, "month").format("YYYY-MM-DD"),
  },
  items: [],
  loading: false,
  error: null,
};

const surveyReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_SURVEY_FORM:
      return {
        ...state,
        items: action.payload.questions,
        basicInfo: action.payload.basicInfo,
      };

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

      const clonedQuestion = {
        ...JSON.parse(JSON.stringify(source)),
        id: `q_${Date.now()}`,
      };

      const newItems = [...state.items];
      newItems.splice(index + 1, 0, clonedQuestion);

      return { ...state, items: newItems };
    }

    default:
      return state;
  }
};

export default surveyReducer;
