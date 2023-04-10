import Icon from 'react-native-vector-icons/Ionicons';
import styled, {useTheme} from 'styled-components';
import {Share} from 'react-native';
import {useTranslation} from 'react-i18next';

export const Velib = ({item}) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const fields = item.fields;
  const isRenting = fields.is_renting === 'OUI';
  const isReturning = fields.is_returning === 'OUI';

  const handleShareLocation = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${'location.latitude'},${'location.longitude'}`;
    Share.share({
      message: url,
      title: 'Location',
      url: url,
    });
  };

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
const ShareButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.primary};
  padding: 10px;
  border-radius: 5px;
  margin-top: 70px;
`;
const Text = styled.Text`
  color: ${({theme}) => theme.color};
`;
