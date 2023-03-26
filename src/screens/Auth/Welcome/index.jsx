import React from 'react';
import styled from 'styled-components';
import {Button} from '../../../components/Button';

const Welcome = ({navigation}) => {
  return (
    <Container>
      <TextHeader>Bienvenue!</TextHeader>
      <CenteredText>
        Connectez-vous ou inscrivez-vous et accédez aux meilleurs plans sur ce
        qu'il faut faire dans Paris!
      </CenteredText>
      <ButtonContainer>
        <Button
          label="Se connecter"
          pressHandler={() => navigation.navigate('Login')}
        />
        <Button
          outline
          label="S'inscrire"
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
