import React from "react";
import styled from "styled-components";
import { usePasswordChange } from "../../Hooks/Login/usePasswordChange";

const PasswordChangePage = () => {
  const { values, handleChange, handleSubmit } = usePasswordChange();

  return (
    <Container>
      <Card>
        <Header>
          <Title>비밀번호 변경</Title>
          <SubTitle>
            안전한 서비스 이용을 위해 비밀번호를 변경해 주세요.
          </SubTitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>새 비밀번호</Label>
            <Input
              type="password"
              name="newPassword"
              placeholder="새 비밀번호 (8자 이상)"
              value={values.newPassword}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>새 비밀번호 확인</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="새 비밀번호를 한번 더 입력하세요"
              value={values.confirmPassword}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <SubmitButton type="submit">비밀번호 변경하기</SubmitButton>
        </Form>

        <FooterText>
          © 2026 DHKSolution IT Team. All rights reserved.
        </FooterText>
      </Card>
    </Container>
  );
};

export default PasswordChangePage;

// --- Styled Components ---
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
`;

const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(14, 165, 233, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #0369a1;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const SubTitle = styled.p`
  color: #7dd3fc;
  font-size: 13px;
  margin-top: 8px;
  line-height: 1.4;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #0ea5e9;
  margin-bottom: 6px;
  margin-left: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0f2fe;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: #7dd3fc;
    box-shadow: 0 0 0 4px rgba(125, 211, 252, 0.2);
  }

  &::placeholder {
    color: #bae6fd;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 10px;

  &:hover {
    background-color: #0284c7;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const FooterText = styled.p`
  margin-top: 30px;
  font-size: 12px;
  color: #94a3b8;
`;
