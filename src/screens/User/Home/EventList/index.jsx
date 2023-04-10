import React, {useState} from 'react';
import styled, {useTheme} from 'styled-components';
import {ActivityIndicator} from 'react-native';
import {UserLayout} from '../../../../components/layout/UserLayout';
import {Event} from '../../../../components/Event';
import {useFocusEffect} from '@react-navigation/native';
import {errorAlert} from '../../../../utils/notifications';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {getFirstChunkOfEvents, getMoreEvents} from '../../../../actions/events';

const EventList = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {paginatedEvents, loading, loadingMore, error} = useSelector(
    state => state.events,
  );
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const size = 5;

  const fetchData = () => {
    dispatch(getFirstChunkOfEvents(size));
    if (error) {
      errorAlert(error);
    }
  };

  const fetchMoreData = () => {
    dispatch(getMoreEvents(size, page));
    if (error) {
      errorAlert(error);
    }
  };

  const refreshData = async () => {
    setPage(0);
    dispatch(getFirstChunkOfEvents(size));
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  React.useEffect(() => {
    if (page !== 0) fetchMoreData();
  }, [page]);

  return (
    <UserLayout title={t('screen.events.eventsTitle')}>
      {loading ? (
        <Centered>
          <ActivityIndicator size="large" color={theme.red} />
        </Centered>
      ) : (
        <List
          data={paginatedEvents}
          initialNumToRender={size}
          renderItem={({item}) => (
            <Event
              id={item.record.id}
              title={item.record.fields.title}
              leadText={item.record.fields.lead_text}
              dateStart={item.record.fields.date_start}
              dateEnd={item.record.fields.date_end}
              coverUrl={item.record.fields.cover_url}
              tags={item.record.fields.tags}
            />
          )}
          keyExtractor={item => item.record.id}
          onEndReachedThreshold={(size * 2) / 3}
          onEndReached={() => {
            setPage(prev => prev + 1);
          }}
          onRefresh={() => {
            refreshData();
          }}
          refreshing={refreshing}
          ListEmptyComponent={() =>
            !refreshing && (
              <Centered>
                <Text>{t('screen.events.noevents')}</Text>
              </Centered>
            )
          }
          ListFooterComponent={() => {
            if (loadingMore) {
              return (
                <Centered>
                  <ActivityIndicator size="large" color={theme.red} />
                </Centered>
              );
            }
            return null;
          }}
        />
      )}
    </UserLayout>
  );
};

export default EventList;

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
