import React from "react";
import styled from "styled-components";
import { useLogin } from "../../Hooks/Login/useLogin";

const AdminLoginPage = () => {
  const { values, handleChange, handleSubmit } = useLogin();

  return (
    <Container>
      <LoginCard>
        <Header>
          <Title>설문조사</Title>
          <SubTitle>-</SubTitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="admin@company.com"
              value={values.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <LoginButton type="submit">로그인</LoginButton>
        </Form>

        <FooterText>
          © 2026 DHKSolution IT Team. All rights reserved.
        </FooterText>
      </LoginCard>
    </Container>
  );
};

export default AdminLoginPage;

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #e0f2fe 0%,
    #f0f9ff 100%
  ); // 매우 연한 파랑 배경
`;

const LoginCard = styled.div`
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

const LogoBox = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  color: #0369a1; // 진한 파랑
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const SubTitle = styled.p`
  color: #7dd3fc; // 연한 스카이블루
  font-size: 14px;
  margin-top: 8px;
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

const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #0ea5e9; // 스카이블루 메인
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
