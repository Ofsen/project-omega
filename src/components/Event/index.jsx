import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {error} from '../../utils/notifications';

export const Event = props => {
  const {id, title, leadText, dateStart, dateEnd, coverUrl, tags} = props;
  const navigation = useNavigation();
  const [favorite, setFavorite] = React.useState(false);

  const fetchFavorited = async () => {
    try {
      const localData = await AsyncStorage.getItem('favorites');
      const parsedData = JSON.parse(localData || '[]');
      const isFavorited = parsedData.find(item => item.eventId === id);
      setFavorite(isFavorited);
    } catch (err) {
      error(err.message);
    }
  };

  const toggleFavorite = async () => {
    try {
      const localData = await AsyncStorage.getItem('favorites');
      const parsedData = JSON.parse(localData || '[]');
      const isFavorited = parsedData.find(item => item.eventId === id);
      if (isFavorited) {
        const filteredData = parsedData.filter(item => item.eventId !== id);
        await AsyncStorage.setItem('favorites', JSON.stringify(filteredData));
        setFavorite(false);
      } else {
        await AsyncStorage.setItem(
          'favorites',
          JSON.stringify([...parsedData, {eventId: id, title: title}]),
        );
        setFavorite(true);
      }
    } catch (err) {
      error(err.message);
    }
  };

  React.useEffect(() => {
    fetchFavorited();
  }, []);

  return (
    <PressableContainer
      onPress={() =>
        navigation.navigate('EventSingle', {eventId: id, title: title})
      }>
      <HeaderContainer>
        <CoverImage source={{uri: coverUrl, height: 200}} />
        <FavoriteButton onPress={() => toggleFavorite()}>
          <Icon
            name={favorite ? 'ios-heart' : 'ios-heart-outline'}
            size={28}
            color={favorite ? 'red' : 'white'}
          />
        </FavoriteButton>
      </HeaderContainer>
      <ContentContainer>
        <Title>{title}</Title>
        <LeadingText>{leadText}</LeadingText>
        <DateContainer>
          <Date>
            {`${t('screen.events.from')} ${moment(dateStart).format(
              'DD-MM-YYYY',
            )} ${t('screen.events.to')} ${moment(dateEnd).format(
              'DD-MM-YYYY',
            )}`}
          </Date>
        </DateContainer>
      </ContentContainer>
    </PressableContainer>
  );
};

const PressableContainer = styled.Pressable`
  background-color: ${({theme}) => theme.secondaryBackground};
  width: 100%;
  margin-bottom: 16px;
`;

const HeaderContainer = styled.View`
  width: 100%;
  height: 200px;
  position: relative;
`;

const CoverImage = styled.Image`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const FavoriteButton = styled.Pressable`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(0, 0, 0, 0.35);
  padding: 9px 8px 7px 8px;
  border-radius: 100px;
`;

const ContentContainer = styled.View`
  gap: 8px;
  width: 100%;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({theme}) => theme.blue};
`;

const LeadingText = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.color};
`;

const DateContainer = styled.View`
  justify-content: flex-end;
  align-items: flex-end;
`;

const Date = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.color};
`;
