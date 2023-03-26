import React from 'react';
import styled from 'styled-components';
import SignUpForm from '../../../components/Forms/SignUpForm';

const Signup = () => {
  return (
    <Container>
      <TextHeader>S'inscrire</TextHeader>
      <SignUpForm />
    </Container>
  );
};

export default Signup;

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
