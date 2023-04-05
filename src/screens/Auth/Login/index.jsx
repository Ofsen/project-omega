import React from 'react';
import styled from 'styled-components';
import LoginForm from '../../../components/Forms/LoginForm';

const Login = () => {
  return (
    <Container>
      <TextHeader>{t('misc.login')}</TextHeader>
      <LoginForm />
    </Container>
  );
};

export default Login;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const TextHeader = styled.Text`
  font-size: 32px;
  font-weight: 900;
  color: ${({theme}) => theme.color};
`;
