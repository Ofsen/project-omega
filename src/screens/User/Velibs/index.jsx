import React, {useEffect, useState, useCallback} from 'react';
import styled, {useTheme} from 'styled-components';
import {ActivityIndicator, FlatList, Text} from 'react-native';
import {UserLayout} from '../../../components/layout/UserLayout';
import {callApi} from '../../../services/events';
import {useFocusEffect} from '@react-navigation/native';
import {error} from '../../../utils/notifications';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';

const Velibs = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const size = 5;

  const fetchData = async () => {
    try {
      const res = await callApi(size, page);
      if (res.status === 200) {
        setData(prev => [...prev, ...res.data.records]);
      }
    } catch (err) {
      error(err.message);
    }
    if (page === 0) setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    setData([]);
    setRefreshing(false);
    setPage(0);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useFocusEffect(
    useCallback(() => {
      setData([]);
      setLoading(true);
      setPage(0);
    }, []),
  );

  const renderItem = ({item}) => {
    const fields = item.fields;
    const isRenting = fields.is_renting === 'OUI';
    const isReturning = fields.is_returning === 'OUI';
    return (
      <StationItem>
        <InfoContainer>
          <IconRow>
            <Icon
              name={isRenting ? 'checkmark-circle' : 'close-circle'}
              size={28}
              color={isRenting ? 'green' : 'red'}
            />
            <Text>{t('screen.velibs.rent')}</Text>
          </IconRow>
          <IconRow>
            <Icon
              name={isReturning ? 'checkmark-circle' : 'close-circle'}
              size={28}
              color={isReturning ? 'green' : 'red'}
            />
            <Text>{t('screen.velibs.dock')}</Text>
          </IconRow>
        </InfoContainer>
        <TextContainer>
          <Station>{fields.name}</Station>
          <Text>
            {fields.numbikesavailable} {t('screen.velibs.ebikes')}
          </Text>
          <Text>
            {fields.numdocksavailable} {t('screen.velibs.mechanical')}
          </Text>
          <Text>
            {fields.capacity} {t('screen.velibs.capacity')}
          </Text>
        </TextContainer>
      </StationItem>
    );
  };

  return (
    <UserLayout title="Velib">
      {loading ? (
        <Centered>
          <ActivityIndicator size="large" color={theme.red} />
        </Centered>
      ) : (
        <ContentContainer>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.recordid + '_' + index}
            onEndReached={() => {
              setPage(prev => page + 1);
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
              if (data.length > 0) {
                return (
                  <Centered>
                    <ActivityIndicator size="large" color={theme.red} />
                  </Centered>
                );
              }
              return null;
            }}
          />
        </ContentContainer>
      )}
    </UserLayout>
  );
};

const ContentContainer = styled.View`
  flex: 1;
  padding: 0 16px;
  gap: 16px;
`;

const StationItem = styled.View`
  background-color: ${({theme}) => theme.secondaryBackground};
  padding: 20px;
  margin-bottom: 20px;
  flex-direction: row;
`;
const InfoContainer = styled.View`
  flex-direction: column;
  flex: 1;
`;
const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
`;
const TextContainer = styled.View`
  flex-direction: column;
  flex: 2;
  padding-left: 10px;
`;
const Station = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({theme}) => theme.color};
`;
const Centered = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default Velibs;
