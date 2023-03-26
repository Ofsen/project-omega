import React from 'react';
import styled, {useTheme} from 'styled-components';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import {getSingleEvent} from '../../../../services/events';
import moment from 'moment';
import {Button} from '../../../../components/Button';

const EventSingle = props => {
  const {route} = props;
  const theme = useTheme();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    try {
      const res = await getSingleEvent(route.params.eventId);
      if (res.status === 200) {
        setData(res.data.record);
      }
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return loading ? (
    <Centered>
      <ActivityIndicator size="large" color={theme.primary} />
    </Centered>
  ) : data === null ? (
    <Centered>
      <Text>No data found</Text>
    </Centered>
  ) : (
    <ScrollView>
      <ImageContainer source={{uri: data.fields.cover_url}} />
      <ContentContainer>
        <Title>{data.fields.title}</Title>
        <Paragraph>{data.fields.lead_text}</Paragraph>
        <Subtitle>Description</Subtitle>
        <Paragraph>
          {data.fields.description.replace(/<(.|\n)*?>/g, '')}
        </Paragraph>
        <Subtitle>Pour Qui?</Subtitle>
        <Paragraph>{data.fields.audience}</Paragraph>
        <Subtitle>Quand?</Subtitle>
        <Date>
          Du {moment(data.fields.date_start).format('DD-MM-YYYY')} au{' '}
          {moment(data.fields.date_end).format('DD-MM-YYYY')}
        </Date>
        <Subtitle>Où?</Subtitle>
        <Paragraph>{data.fields.address_name}</Paragraph>
        <Paragraph>{`${data.fields.address_street}, ${data.fields.address_zipcode} ${data.fields.address_city}`}</Paragraph>
        <Subtitle>Liens</Subtitle>
        <Button
          label={data.fields.access_link_text || 'Voir plus'}
          icon="link-external"
          pressHandler={() =>
            Linking.openURL(
              data.fields.access_link
                ? data.fields.access_link
                : data.fields.contact_url
                ? data.fields.contact_url
                : data.fields.url,
            )
          }
        />
      </ContentContainer>
    </ScrollView>
  );
};

export default EventSingle;

const Centered = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ImageContainer = styled.Image`
  width: 100%;
  aspect-ratio: 1;
`;

const ContentContainer = styled.View`
  gap: 8px;
  width: 100%;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({theme}) => theme.primary};
`;

const Subtitle = styled.Text`
  font-size: 19px;
  font-weight: bold;
  margin-top: 16px;
  color: ${({theme}) => theme.statusBar};
`;

const Paragraph = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.color};
`;

const Date = styled.Text`
  color: ${({theme}) => theme.color};
  font-weight: bold;
`;

const Touchable = styled.Pressable`
  width: 100%;
  padding: 14px 20px;
  background-color: ${props =>
    props.outline ? 'transparent' : props.theme[props.variant]};

  ${props => props.outline && 'border: 2px solid ' + props.theme[props.variant]}
`;
