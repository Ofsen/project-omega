import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {View, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {API_URL} from '@env';
import {errorAlert} from '../../../../utils/notifications';

export default function VelibMap(props) {
  const {route} = props;
  const [velibs, setVelibs] = React.useState([]);

  const SIZE = 50,
    RADIUS = 1000;
  const fetchClosestVelibs = () => {
    fetch(
      `${API_URL}&geofilter.distance=${route.params.fields.coordonnees_geo[0]},${route.params.fields.coordonnees_geo[1]},${RADIUS}&rows=${SIZE}`,
    )
      .then(response => response.json())
      .then(json => {
        setVelibs(json.records);
      })
      .catch(error => {
        errorAlert(error.message);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchClosestVelibs();
    }, []),
  );

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{flex: 1, width: '100%'}}
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
          title={route.params.fields.name}
        />
        {velibs.map((velib, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: velib.fields.coordonnees_geo[0],
                longitude: velib.fields.coordonnees_geo[1],
              }}
              title={velib.fields.name}
            />
          );
        })}
      </MapView>
    </View>
  );
}
