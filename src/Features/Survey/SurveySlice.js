// src/features/survey/surveySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/surveyApi";

// 비동기 처리 (조회)
export const fetchSurveys = createAsyncThunk("survey/fetchAll", async () => {
  const response = await api.getSurveys();
  return response.data;
});

const surveySlice = createSlice({
  name: "survey",
  initialState: {
    items: [],
    currentSurvey: null,
    loading: false,
    error: null,
  },
  reducers: {
    // 설문 작성 중 임시 저장이나 폼 데이터 변경 시 사용
    setSurveyDetail: (state, action) => {
      state.currentSurvey = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSurveys.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
  },
});

export const { setSurveyDetail } = surveySlice.actions;
export default surveySlice.reducer;
