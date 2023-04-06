import React, {useEffect, useState, useCallback} from 'react';
import styled, {useTheme} from 'styled-components';
import {ActivityIndicator, FlatList} from 'react-native';
import {UserLayout} from '../../../components/layout/UserLayout';
import {callApi, getCommunes} from '../../../services/events';
import {useFocusEffect} from '@react-navigation/native';
import {error} from '../../../utils/notifications';
import {Button} from '../../../components/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import {Checkbox, Menu, Provider, Searchbar} from 'react-native-paper';
import {Share} from 'react-native';
import {useTranslation} from 'react-i18next';
import { Dimensions } from 'react-native';

const Velibs = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [communes, setCommunes] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [rentingFilter, setRentingFilter] = useState(false);
  const [returningFilter, setReturningFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [showLoadingFooter, setShowLoadingFooter] = useState(true);

  const size = 5;

  const fetchData = async () => {
    try {
      const res = await callApi(
        size,
        page,
        selectedCommune,
        rentingFilter,
        returningFilter,
        searchQuery,
      );
      if (res.data.records.length < 5) setShowLoadingFooter(false);
      if (res.status === 200) setData(prev => [...prev, ...res.data.records]);
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

  useFocusEffect(
    useCallback(() => {
      setData([]);
      setPage(0);
      setSelectedCommune('');
      setLoading(true);
      setShowLoadingFooter(true);
      if (page === 0) fetchData();
    }, []),
  );

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchCommunes = async () => {
    try {
      const response = await getCommunes();
      if (response) {
        setCommunes(response.facets[0].facets);
      }
    } catch (err) {
      error(err.message);
    }
  };

  useEffect(() => {
    fetchCommunes();
  }, []);

  const updateFilters = (renting, returning) => {
    setRentingFilter(renting);
    setReturningFilter(returning);
    refreshData();
  };

  const searchData = async () => {
    try {
      setData([]);
      const res = await callApi(
        size,
        0,
        selectedCommune,
        rentingFilter,
        returningFilter,
        searchQuery,
      );
      if (res.data.records.length < 5) setShowLoadingFooter(false);
      if (res.status === 200) setData(prev => [...prev, ...res.data.records]);
    } catch (err) {
      error(err.message);
    }
    if (page === 0) setLoading(false);
  };

  useEffect(() => {
    const fields = {};
    setLocation(`${fields.latitude},${fields.longitude}`);
  }, []);

  const handleShareLocation = () => {
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
      Share.share({
        message: url,
        title: 'Location',
        url: url,
      });
    }
  };

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
        <ShareButton onPress={handleShareLocation}>
          <Icon name="share" size={24} color={theme.color} />
        </ShareButton>
      </StationItem>
    );
  };

  return (
    <UserLayout title="Velib">
      <SearchContainer>
        <StyledSearchbar
          placeholder={t('screen.velibs.search')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          onClearIconPress={() => {
            setData([]), setPage(0);
          }}
        />
        <SearchButton><Button pressHandler={() => searchData()} icon="search"/></SearchButton>
      </SearchContainer>
      
      <SearchContainer>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              label={selectedCommune || t('screen.velibs.town')}
              variant="blue"
              pressHandler={() => setMenuVisible(true)}
            />
          }>
          <Menu.Item
            onPress={() => {
              setSelectedCommune(null);
              setPage(0);
              setData([]);
              setMenuVisible(false);
              setShowLoadingFooter(true);
            }}
            title={t('screen.velibs.town')}
          />
          {communes.map((commune, index) => (
            <Menu.Item
              key={index}
              onPress={() => {
                setSelectedCommune(commune.name);
                setPage(0);
                setData([]);
                setMenuVisible(false);
              }}
              title={commune.name}
            />
          ))}
        </Menu>
      </SearchContainer>
      <FilterContainer>
        <Checkbox.Item
          label={t('screen.velibs.rent')}
          color={theme.color}
          labelStyle={{color: theme.color}}
          status={rentingFilter ? 'checked' : 'unchecked'}
          onPress={() => updateFilters(!rentingFilter, returningFilter)}
        />
        <Checkbox.Item
          label={t('screen.velibs.return')}
          color={theme.color}
          labelStyle={{color: theme.color}}
          status={returningFilter ? 'checked' : 'unchecked'}
          onPress={() => updateFilters(rentingFilter, !returningFilter)}
        />
      </FilterContainer>
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
              if (showLoadingFooter) {
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
const SearchContainer = styled.View`
  padding: 8px 16px;
  flex-direction: row;
  align-items: center;
`;
const StyledSearchbar = styled(Searchbar)`
  flex-basis: 80%;
`;
const SearchButton = styled.View`
  width: 20%;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  overflow: hidden;
  margin: 10px;
`;
const FilterContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
`;
const ShareButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.primary};
  padding: 10px;
  border-radius: 5px;
  margin-top: 70px;
`;
const Text = styled.Text`
  color: ${({theme}) =>theme.color};
`;


export default () => (
  <Provider>
    <Velibs />
  </Provider>
);
