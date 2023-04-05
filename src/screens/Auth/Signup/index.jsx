import React from 'react';
import styled from 'styled-components';
import SignUpForm from '../../../components/Forms/SignUpForm';
import {useTranslation} from 'react-i18next';

const Signup = () => {
  const {t} = useTranslation();

  return (
    <Container>
      <TextHeader>{t('misc.register')}</TextHeader>
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
