import React, {useEffect, useState, useCallback} from 'react';
import styled, {useTheme} from 'styled-components';
import {ActivityIndicator, FlatList, Text, TextInput} from 'react-native';
import {UserLayout} from '../../../components/layout/UserLayout';
import {callApi, getCommunes} from '../../../services/events';
import {useFocusEffect} from '@react-navigation/native';
import {error} from '../../../utils/notifications';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from '../../../components/Button';
import {Checkbox, Menu, Provider, Searchbar} from 'react-native-paper';
import {Share} from 'react-native';
import {useTranslation} from 'react-i18next';

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
  const [available, setAvailable] = React.useState(false);
  const [location, setLocation] = useState(null);

  const size = 5;

  const fetchData = async () => {
    try {
      const res = await callApi(size, page, selectedCommune, rentingFilter, returningFilter, searchQuery);
      if (res.status === 200) {
        console.log("logs", res.data.records);
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

  useFocusEffect(
    useCallback(() => {
      setData([]);
      setLoading(true);
      setPage(0);
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

  const onChangeSearch = () => {
    setData([]);
    setPage(0);
  };

  const searchData = async () => {
    try {
      setData([]);
      const res = await callApi(size, 0, selectedCommune, rentingFilter, returningFilter, searchQuery);
      if (res.status === 200) {
        console.log("logs", res.data.records);
        setData(prev => [...prev, ...res.data.records]);
      }
    } catch (err) {
      error(err.message);
    }
    if (page === 0) setLoading(false);

  useEffect(() => {
    const fields = {};
    setLocation(`${fields.latitude},${fields.longitude}`);
  }, []);

  const handleShareLocation = () => {
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
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
        <Button onPress={handleShareLocation}>
        <Icon name="share" size={24} color="black" />
      </Button>
      </StationItem>
    );
  };

  return (
    <UserLayout title="Velib">
      <SearchContainer>
        <Searchbar
          placeholder="Rechercher"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onClearIconPress={() => {setData([]), setPage(0)}}
        />
        
      </SearchContainer>
      <Button
          label="OK"
          pressHandler={() => searchData()}
        />
      <SearchContainer>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
            label="Toutes les communes"
            variant="blue"
            pressHandler={() => setMenuVisible(true)}
          />
          }
        >
          <Menu.Item onPress={() => {
            setSelectedCommune(null);
            setPage(0);
            setData([]);
            setMenuVisible(false);
          }} title="Toutes les communes" />
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
        label="Louer"
        status={rentingFilter ? 'checked' : 'unchecked'}
        onPress={() => updateFilters(!rentingFilter, returningFilter)}
      />
      <Checkbox.Item
        label="Retourner"
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
const SearchContainer = styled.View`
  padding: 8px 16px;
  flex-direction: row;
  align-items: center;
`;
const FilterContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.primary};
  padding: 10px;
  border-radius: 5px;
  margin-top: 70px;
`;

export default () => (
  <Provider>
    <Velibs />
  </Provider>
);
