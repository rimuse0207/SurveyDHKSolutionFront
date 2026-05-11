// src/styles/theme.js
export const theme = {
  colors: {
    primary: "#00aaff", // 메인 하늘색
    primaryHover: "#0088cc",
    secondary: "#e3f2fd", // 연한 하늘색 (배경용)
    background: "#e3f2fd", // 배경을 보라색(#f0ebf8)에서 하늘색으로 교체!
    surface: "#ffffff",
    textMain: "#202124",
    textSub: "#70757a",
    border: "#dadce0",
    error: "#d93025",
  },
  shadows: {
    default:
      "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
    focused:
      "0 4px 6px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
  },
  layout: {
    maxWidth: "770px", // 설문지 표준 너비
  },
};
