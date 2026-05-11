import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateQuestion } from "../../Store/Actions/surveyActions";

const useOptionEditor = (questionId, options) => {
  const dispatch = useDispatch();
  const inputRefs = useRef([]);

  // 1. 옵션 업데이트 공통 함수
  const updateOptionsInRedux = (newOptions) => {
    dispatch(updateQuestion(questionId, { options: newOptions }));
  };

  // 2. 옵션 추가
  const handleAddOption = () => {
    const newOptions = [...options, ""];
    updateOptionsInRedux(newOptions);
  };

  // 3. 옵션 수정
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    updateOptionsInRedux(newOptions);
  };

  // 4. 옵션 삭제
  const handleRemoveOption = (index) => {
    if (options.length <= 1) return;
    const newOptions = options.filter((_, i) => i !== index);
    updateOptionsInRedux(newOptions);
  };

  // 5. 키보드 네비게이션 및 단축키
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
    }
    if (e.key === "Tab" && !e.shiftKey && index === options.length - 1) {
      e.preventDefault();
      handleAddOption();
    }
    if (e.key === "ArrowDown" && index < options.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === "ArrowUp" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // 백스페이스로 옵션 삭제 (빈 칸일 때) - 현업 디테일 추가
    if (e.key === "Backspace" && options[index] === "" && options.length > 1) {
      e.preventDefault();
      handleRemoveOption(index);
      // 이전 칸으로 포커스 이동
      const nextFocusIndex = index > 0 ? index - 1 : 0;
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  // 새 옵션 추가 시 자동 포커스
  useEffect(() => {
    const lastIndex = options.length - 1;
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus();
    }
  }, [options.length]);

  return {
    inputRefs,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption,
    handleKeyDown,
  };
};

export default useOptionEditor;
