import { useDispatch } from "react-redux";
import { updateQuestion } from "../../../Store/Actions/surveyActions";
import styled from "styled-components";

const OptionList = ({ id, options }) => {
  const dispatch = useDispatch();

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    dispatch(updateQuestion(id, { options: newOptions }));
  };

  const addOption = () => {
    dispatch(
      updateQuestion(id, {
        options: [...options, `옵션 ${options.length + 1}`],
      }),
    );
  };

  return (
    <div>
      {options.map((opt, i) => (
        <OptionRow key={i}>
          <span>○</span>
          <input
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
          />
        </OptionRow>
      ))}
      <AddOptionBtn onClick={addOption}>옵션 추가</AddOptionBtn>
    </div>
  );
};
export default OptionList;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;

  span {
    color: #dadce0;
    font-size: 20px;
  }

  input {
    border: none;
    border-bottom: 1px solid transparent;
    padding: 5px;
    font-size: 14px;
    width: 80%;

    &:focus {
      outline: none;
      border-bottom: 1px solid #dadce0;
    }
  }
`;

const AddOptionBtn = styled.button`
  background: none;
  border: none;
  color: #1a73e8;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 0;
  margin-top: 5px;

  &:hover {
    text-decoration: underline;
  }
`;
