import React from 'react';
import styled from 'styled-components';
import {Button} from '../../../components/Button';
import {useTranslation} from 'react-i18next';

const Welcome = ({navigation}) => {
  const {t} = useTranslation();

  return (
    <Container>
      <TextHeader>{t('screen.welcome.header')}</TextHeader>
      <CenteredText>{t('screen.welcome.text')}</CenteredText>
      <ButtonContainer>
        <Button
          label={t('misc.login')}
          pressHandler={() => navigation.navigate('Login')}
        />
        <Button
          outline
          label={t('misc.register')}
          pressHandler={() => navigation.navigate('Signup')}
        />
      </ButtonContainer>
    </Container>
  );
};

export default Welcome;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const TextHeader = styled.Text`
  font-size: 40px;
  font-weight: 900;
  color: ${({theme}) => theme.color};
`;

const CenteredText = styled.Text`
  text-align: center;
  padding: 0 32px;
  color: ${({theme}) => theme.color};
`;

const ButtonContainer = styled.View`
  padding: 32px;
  width: 100%;
  gap: 16px;
`;
