import {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import styled, {useTheme} from 'styled-components';
import {Share} from 'react-native';
import {useTranslation} from 'react-i18next';
import {errorAlert} from '../../../utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

export const VelibItem = ({item}) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation();

  const [favorite, setFavorite] = useState(false);

  const fields = item.fields;
  const isRenting = fields.is_renting === 'OUI';
  const isReturning = fields.is_returning === 'OUI';

  const handleShareLocation = async () => {
    const url = `https://www.google.com/maps/@${item.fields.coordonnees_geo[1]},${item.fields.coordonnees_geo[0]}`;
    Share.share(
      {
        message: item.fields.name,
        title: t('screen.velibs.location'),
        url: url,
      },
      {
        dialogTitle: t('screen.velibs.shareLocation'),
      },
    );
  };

  const fetchFavorited = async () => {
    try {
      const localData = await AsyncStorage.getItem('velib_favorites');
      const parsedData = JSON.parse(localData || '[]');
      const isFavorited = parsedData.find(
        item => item.velibId === fields.stationcode,
      );
      setFavorite(isFavorited);
    } catch (err) {
      errorAlert(err.message);
    }
  };

  const toggleFavorite = async () => {
    try {
      const localData = await AsyncStorage.getItem('velib_favorites');
      const parsedData = JSON.parse(localData || '[]');
      const isFavorited = parsedData.find(
        item => item.velibId === fields.stationcode,
      );
      if (isFavorited) {
        const filteredData = parsedData.filter(
          item => item.velibId !== fields.stationcode,
        );
        await AsyncStorage.setItem(
          'velib_favorites',
          JSON.stringify(filteredData),
        );
        setFavorite(false);
      } else {
        await AsyncStorage.setItem(
          'velib_favorites',
          JSON.stringify([
            ...parsedData,
            {velibId: fields.stationcode, name: fields.name},
          ]),
        );
        setFavorite(true);
      }
    } catch (err) {
      errorAlert(err.message);
    }
  };

  useEffect(() => {
    fetchFavorited();
  }, []);

  return (
    <StationItem onPress={() => navigation.navigate('VelibMap', {fields})}>
      <InfoContainer>
        <IconRow bgColor={isRenting ? 'green' : theme.red}>
          <IconRowText>{t('screen.velibs.rent')}</IconRowText>
          <Icon name={isRenting ? 'check' : 'x'} size={20} />
        </IconRow>
        <IconRow bgColor={isReturning ? 'green' : theme.red}>
          <IconRowText>{t('screen.velibs.dock')}</IconRowText>
          <Icon name={isReturning ? 'check' : 'x'} size={20} />
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
      <ButtonsContainer>
        <IconButton onPress={toggleFavorite}>
          <Icon
            name={favorite ? 'heart-fill' : 'heart'}
            size={20}
            color={favorite ? theme.red : theme.color}
          />
        </IconButton>
        <IconButton onPress={handleShareLocation}>
          <Icon name="share-android" size={20} color={theme.color} />
        </IconButton>
      </ButtonsContainer>
    </StationItem>
  );
};

const StationItem = styled.Pressable`
  background-color: ${({theme}) => theme.secondaryBackground};
  padding: 16px;
  margin-bottom: 16px;
  flex-direction: row;
  gap: 8px;
`;
const InfoContainer = styled.View`
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;
const IconRow = styled.View`
  background-color: ${props => props.bgColor};
  color: white;
  flex-direction: row;
  justify-content: space-between;
  padding: 4px 10px;
  gap: 4px;
  border-radius: 50px;
  align-items: center;
`;
const IconRowText = styled.Text`
  color: white;
`;
const TextContainer = styled.View`
  flex-direction: column;
  flex: 3;
  padding-left: 10px;
`;
const Station = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({theme}) => theme.color};
`;
const ButtonsContainer = styled.View`
  flex-direction: column;
  justify-content: space-between;
  margin-right: -8px;
  margin-top: -8px;
`;
const IconButton = styled.TouchableOpacity`
  padding: 8px;
`;
const Text = styled.Text`
  color: ${({theme}) => theme.color};
`;
