import React from 'react';
import {UserLayout} from '../../../components/layout/UserLayout';
import {ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled, {useTheme} from 'styled-components';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {error} from '../../../utils/notifications';
import {useTranslation} from 'react-i18next';
import { getSingleEvent } from '../../../actions/events';
import { useDispatch } from 'react-redux';

const Favorites = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const localData = await AsyncStorage.getItem('favorites');
      setData(JSON.parse(localData || '[]'));
    } catch (err) {
      error(err.message);
    }
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const localData = await AsyncStorage.getItem('favorites');
      setData(JSON.parse(localData || '[]'));
    } catch (err) {
      error(err.message);
    }
    setRefreshing(false);
  };

  const removeFavorite = async eventId => {
    try {
      const localData = await AsyncStorage.getItem('favorites');
      const parsedData = JSON.parse(localData || '[]');
      const filteredData = parsedData.filter(item => item.eventId !== eventId);
      await AsyncStorage.setItem('favorites', JSON.stringify(filteredData));
      fetchData();
    } catch (err) {
      error(err.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  const dispatch= useDispatch();
  
  return (
    <UserLayout title="Favories">
      {loading ? (
        <Centered>
          <ActivityIndicator size="large" color={theme.red} />
        </Centered>
      ) : (
        <List
          data={data}
          renderItem={({item}) => (
            <PressableContainer
              onPress={() =>
                {
                  dispatch(getSingleEvent(item.eventId))
                  navigation.navigate('EventSingle', {
                  eventId: item.eventId,
                  title: item.title,
                })}
              }>
              <Title numberOfLines={1}>{item.title}</Title>
              <FavoriteButton onPress={() => removeFavorite(item.eventId)}>
                <Icon name={'ios-heart-dislike'} size={28} color={theme.red} />
              </FavoriteButton>
            </PressableContainer>
          )}
          keyExtractor={item => item.eventId}
          onRefresh={() => refreshData()}
          refreshing={refreshing}
          ListEmptyComponent={() => (
            <Centered>
              <Text>{t('screen.events.noevents')}</Text>
            </Centered>
          )}
        />
      )}
    </UserLayout>
  );
};

export default Favorites;

const List = styled.FlatList`
  padding: 0 16px;
`;

const Centered = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  color: ${({theme}) => theme.color};
`;

const PressableContainer = styled.Pressable`
  background-color: ${({theme}) => theme.secondaryBackground};
  flex: 1;
  flex-direction: row;
  width: 100%;
  margin-bottom: 16px;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  flex-basis: 80%;
  font-size: 24px;
  font-weight: bold;
  color: ${({theme}) => theme.blue};
`;

const FavoriteButton = styled.Pressable`
  background-color: rgba(0, 0, 0, 0.15);
  padding: 9px 8px 7px 8px;
  border-radius: 100px;
`;
