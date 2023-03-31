import React, {useEffect, useState, useCallback} from 'react';
import styled, {useTheme} from 'styled-components';
import {ActivityIndicator, FlatList, Text, TextInput} from 'react-native';
import {UserLayout} from '../../../components/layout/UserLayout';
import {callApi, getCommunes} from '../../../services/events';
import {useFocusEffect} from '@react-navigation/native';
import {error} from '../../../utils/notifications';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';

const Velibs = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [communes, setCommunes] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState(null);

  const size = 5;

  const fetchData = async () => {
    try {
      const res = await callApi(size, page, selectedCommune);
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

  const renderItem = ({item}) => {
    const fields = item.fields;
    const isRenting = fields.is_renting === "OUI";
    const isReturning = fields.is_returning === "OUI";
    return (
      <StationItem>
        <InfoContainer>
        <IconRow>
          <Icon
            name={isRenting ? 'checkmark-circle' : 'close-circle'}
            size={28}
            color={isRenting ? 'green' : 'red'}
          />
          <Text>Rent</Text>
          </IconRow>
          <IconRow>
          <Icon
            name={isReturning ? 'checkmark-circle' : 'close-circle'}
            size={28}
            color={isReturning ? 'green' : 'red'}
          />
          <Text>Dock</Text>
          </IconRow>
        </InfoContainer>
        <TextContainer>
          <Station>{fields.name}</Station>
          <Text>{fields.numbikesavailable} Ebikes</Text>
          <Text>{fields.numdocksavailable} Mechaniques</Text>
          <Text>{fields.capacity} Capacité</Text>
        </TextContainer>
      </StationItem>
    );
  };

  return (
    <UserLayout title="Velib">
      <SearchContainer>
      <Picker
        selectedValue={selectedCommune}
        style={{flex: 1}}
        onValueChange={(itemValue) => {
          setSelectedCommune(itemValue);
          setPage(0);
          setData([]);
        }}>
        <Picker.Item label="Toutes les communes" value={null} />
        {communes.map((commune, index) => (
          <Picker.Item
            key={index}
            label={commune.name}
            value={commune.name}
          />
        ))}
      </Picker>
    </SearchContainer>
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
                <Text>Aucun evenement trouvé</Text>
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
  background-color: ${({theme}) => theme.secondaryBackground };
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

export default Velibs;
