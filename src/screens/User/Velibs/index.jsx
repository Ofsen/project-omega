import React, {useEffect, useState, useCallback} from 'react';
import styled, {useTheme} from 'styled-components';
import {ActivityIndicator, Pressable} from 'react-native';
import {UserLayout} from '../../../components/layout/UserLayout';
import {useFocusEffect} from '@react-navigation/native';
import {errorAlert} from '../../../utils/notifications';
import {Button} from '../../../components/Button';
import {Checkbox, Menu, Provider, Searchbar} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {VelibItem} from '../../../components/Velib';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Octicons';
import {
  getCommunsVelib,
  getFirstChunkOfVelibs,
  getMoreVelibs,
} from '../../../actions/velibs';

const Velibs = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedCommune, setSelectedCommune] = useState(null);
  const [rentingFilter, setRentingFilter] = useState(false);
  const [returningFilter, setReturningFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const {velibs, communs, loading, loadingMore, errorVelib} = useSelector(
    state => state.velibs,
  );

  const size = 5;

  const fetchData = () => {
    dispatch(
      getFirstChunkOfVelibs(
        size,
        selectedCommune,
        rentingFilter,
        returningFilter,
        searchQuery,
      ),
    );
    dispatch(getCommunsVelib());
    if (errorVelib) errorAlert(errorVelib);
  };

  const fetchMoreData = () => {
    dispatch(
      getMoreVelibs(
        size,
        page,
        selectedCommune,
        rentingFilter,
        returningFilter,
        searchQuery,
      ),
    );
    if (errorVelib) errorAlert(errorVelib);
  };

  const refreshData = async () => {
    setPage(0);
    dispatch(
      getFirstChunkOfVelibs(
        size,
        selectedCommune,
        rentingFilter,
        returningFilter,
        searchQuery,
      ),
    );
  };

  useFocusEffect(
    useCallback(() => {
      setPage(0);
      setSelectedCommune('');
      fetchData();
    }, []),
  );

  useEffect(() => {
    if (page !== 0) fetchMoreData();
  }, [page]);

  useEffect(() => {
    dispatch(
      getFirstChunkOfVelibs(
        size,
        selectedCommune,
        rentingFilter,
        returningFilter,
        searchQuery,
      ),
    );
  }, [selectedCommune, rentingFilter, returningFilter]);

  const updateFilters = (renting, returning) => {
    setRentingFilter(renting);
    setReturningFilter(returning);
  };

  const searchData = async () => {
    dispatch(
      getFirstChunkOfVelibs(
        size,
        selectedCommune,
        rentingFilter,
        returningFilter,
        searchQuery,
      ),
    );
    if (errorVelib) errorAlert(errorVelib);
  };

  return (
    <UserLayout title="Velib">
      <FiltersContainer>
        <Searchbar
          placeholder={t('screen.velibs.search')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          icon={() => <Icon name="search" size={0} />}
          right={({color, style, testID}) => (
            <SearchButton onPress={() => searchData()}>
              <Icon name="search" size={18} color={theme.white} />
            </SearchButton>
          )}
        />
        <OtherFiltersContainer>
          <Checkbox.Item
            label={t('screen.velibs.rent')}
            color={theme.color}
            style={{paddingStart: 4, paddingEnd: 0}}
            labelStyle={{color: theme.color}}
            status={rentingFilter ? 'checked' : 'unchecked'}
            onPress={() => updateFilters(!rentingFilter, returningFilter)}
          />
          <Checkbox.Item
            label={t('screen.velibs.return')}
            color={theme.color}
            style={{paddingStart: 0, paddingEnd: 4}}
            labelStyle={{color: theme.color}}
            status={returningFilter ? 'checked' : 'unchecked'}
            onPress={() => updateFilters(rentingFilter, !returningFilter)}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                label={selectedCommune || t('screen.velibs.town')}
                variant="blue"
                pressHandler={() => setMenuVisible(true)}
                icon="filter"
              />
            }>
            <Menu.Item
              onPress={() => {
                setSelectedCommune(null);
                setPage(0);
                setMenuVisible(false);
              }}
              title={t('screen.velibs.town')}
            />
            {communs.map((commune, index) => (
              <Menu.Item
                key={index}
                onPress={() => {
                  setSelectedCommune(commune.name);
                  setPage(0);
                  setMenuVisible(false);
                }}
                title={commune.name}
              />
            ))}
          </Menu>
        </OtherFiltersContainer>
      </FiltersContainer>
      {loading ? (
        <Centered>
          <ActivityIndicator size="large" color={theme.red} />
        </Centered>
      ) : (
        <List
          data={velibs}
          renderItem={({item}) => <VelibItem item={item} />}
          keyExtractor={(item, index) => item.recordid + '_' + index}
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

const List = styled.FlatList`
  padding: 0 16px;
`;
const Centered = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const FiltersContainer = styled.View`
  padding: 0 16px;
  gap: 8px;
`;
const OtherFiltersContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const SearchButton = styled.Pressable`
  background-color: ${({theme}) => theme.blue};
  padding: 14px 16px;
  border-radius: 100px;
  margin-right: 4px;
`;
const Text = styled.Text`
  color: ${({theme}) => theme.color};
`;

export default () => (
  <Provider>
    <Velibs />
  </Provider>
);
