import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {View, PermissionsAndroid} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {API_URL} from '@env';
import {errorAlert} from '../../../../utils/notifications';
import {useTranslation} from 'react-i18next';
import Geolocation from '@react-native-community/geolocation';
import styled from 'styled-components';

export default function VelibMap(props) {
  const {route} = props;
  const {t} = useTranslation();
  const [velibs, setVelibs] = React.useState([]);
  const [position, setPosition] = React.useState(null);

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      pos => {
        setPosition(JSON.stringify(pos));
        console.log(JSON.stringify(pos));
      },
      error => errorAlert(JSON.stringify(error)),
      {enableHighAccuracy: true},
    );
  };

  const SIZE = 50,
    RADIUS = 1000;
  const fetchClosestVelibs = (lat, long) => {
    fetch(`${API_URL}&geofilter.distance=${lat},${long},${RADIUS}&rows=${SIZE}`)
      .then(response => response.json())
      .then(json => {
        setVelibs(json.records);
      })
      .catch(error => {
        errorAlert(error.message);
      });
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Born Location Permission',
          message:
            'Born needs access to your location ' +
            'to show your position on the map.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      requestLocationPermission();
      fetchClosestVelibs(
        route.params.fields.coordonnees_geo[0],
        route.params.fields.coordonnees_geo[1],
      );
      getCurrentPosition();
    }, []),
  );

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{flex: 1, width: '100%'}}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChangeComplete={region => {
          fetchClosestVelibs(region.latitude, region.longitude);
        }}
        initialRegion={{
          latitude: route.params.fields.coordonnees_geo[0],
          longitude: route.params.fields.coordonnees_geo[1],
          latitudeDelta: 0.01,
          longitudeDelta: 0.005,
        }}>
        <Marker
          coordinate={{
            latitude: route.params.fields.coordonnees_geo[0],
            longitude: route.params.fields.coordonnees_geo[1],
          }}
          title={route.params.fields.name}>
          <StyledCallout>
            <Text>{route.params.fields.name}</Text>
            <Text>
              {route.params.fields.numbikesavailable}{' '}
              {t('screen.velibs.ebikes')}
            </Text>
            <Text>
              {route.params.fields.numdocksavailable}{' '}
              {t('screen.velibs.mechanical')}
            </Text>
            <Text>
              {route.params.fields.capacity} {t('screen.velibs.capacity')}
            </Text>
          </StyledCallout>
        </Marker>
        {velibs.map((velib, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: velib.fields.coordonnees_geo[0],
                longitude: velib.fields.coordonnees_geo[1],
              }}
              title={velib.fields.name}>
              <StyledCallout>
                <Text>{velib.fields.name}</Text>
                <Text>
                  {velib.fields.numbikesavailable} {t('screen.velibs.ebikes')}
                </Text>
                <Text>
                  {velib.fields.numdocksavailable}{' '}
                  {t('screen.velibs.mechanical')}
                </Text>
                <Text>
                  {velib.fields.capacity} {t('screen.velibs.capacity')}
                </Text>
              </StyledCallout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const Text = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.color};
`;

const StyledCallout = styled(Callout)`
  background-color: ${({theme}) => theme.white};
`;
