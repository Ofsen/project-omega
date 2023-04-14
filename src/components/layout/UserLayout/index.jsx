import React from 'react';
import styled, {useTheme} from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {toggleTheme} from '../../../actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Badge} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';

export const UserLayout = props => {
  const {children, title} = props;
  const storedTheme = useSelector(state => state.settings.theme);
  const theme = useTheme();
  const dispatch = useDispatch();
  const {i18n} = useTranslation();

  const setTheme = async () => {
    const theme = storedTheme === 'light' ? 'dark' : 'light';
    await AsyncStorage.setItem('theme', theme);
    dispatch(toggleTheme());
  };

  const changeLanguage = async () => {
    const lng = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(lng);
    await AsyncStorage.setItem('lng', lng);
  };

  return (
    <Container>
      <HeaderContainer>
        <TextHeader>{title}</TextHeader>
        <ButtonsContainer>
          <ButtonHeader onPress={setTheme}>
            {storedTheme === 'light' ? (
              <Icon name="ios-moon" size={24} color={theme.color} />
            ) : (
              <Icon name="ios-sunny" size={24} color={theme.color} />
            )}
          </ButtonHeader>
          <ButtonHeader onPress={changeLanguage}>
            <Badge style={styles.badge}>
              {i18n.language === 'fr' ? 'EN' : 'FR'}
            </Badge>
            <MaterialIcons name="translate" size={24} color={theme.color} />
          </ButtonHeader>
        </ButtonsContainer>
      </HeaderContainer>
      <ContentContainer>{children}</ContentContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ButtonHeader = styled.Pressable`
  padding: 8px;
  border-radius: 50px;
`;

const TextHeader = styled.Text`
  font-size: 32px;
  font-weight: 900;
  color: ${({theme}) => theme.color};
`;

const ContentContainer = styled.View`
  flex: 1;
  margin-top: 8px;
  gap: 16px;
`;

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'black',
    fontWeight: 'bold',
    position: 'absolute',
    color: 'white',
    top: 4,
    zIndex: 1,
  },
});
