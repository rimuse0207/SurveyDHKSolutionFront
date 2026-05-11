// // src/pages/survey/SurveyHeader.jsx
// import React from "react";
// import * as S from "../SurveyStyles";
// import TextToolbar from "../../../../Components/TextToolbar";

// const SurveyHeader = ({
//   isActive,
//   onActive,
//   onFormat,
//   title,
//   description,
//   onTitleChange,
//   onDescChange,
// }) => {
//   return (
//     <S.FormHeaderContainer isActive={isActive} onClick={onActive}>
//       <S.TitleInput
//         contentEditable
//         suppressContentEditableWarning
//         placeholder="설문 제목"
//         // ⚠️ 핵심 수정: {title} 대신 dangerouslySetInnerHTML 사용
//         dangerouslySetInnerHTML={{ __html: title }}
//         onBlur={(e) => onTitleChange(e.currentTarget.innerHTML)}
//       />

//       <S.DescInput
//         contentEditable
//         suppressContentEditableWarning
//         placeholder="설문에 대한 설명을 입력하세요."
//         // ⚠️ 핵심 수정: {description} 대신 dangerouslySetInnerHTML 사용
//         dangerouslySetInnerHTML={{ __html: description }}
//         onBlur={(e) => onDescChange(e.currentTarget.innerHTML)}
//       />

//       {isActive && (
//         <S.FixedToolbarWrapper>
//           <TextToolbar onAction={onFormat} />
//         </S.FixedToolbarWrapper>
//       )}
//     </S.FormHeaderContainer>
//   );
// };
// export default SurveyHeader;
