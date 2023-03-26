import React from 'react';
import styled from 'styled-components';

export const UserLayout = props => {
  const {children, title} = props;
  return (
    <Container>
      <TextHeader>{title}</TextHeader>
      <ContentContainer>{children}</ContentContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const TextHeader = styled.Text`
  padding: 16px;
  font-size: 32px;
  font-weight: 900;
  color: ${({theme}) => theme.color};
`;

const ContentContainer = styled.View`
  flex: 1;
  margin-top: 8px;
  gap: 16px;
`;
