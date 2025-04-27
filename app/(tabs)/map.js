import MapView, { Marker } from 'react-native-maps';
import wineries from '../../data/wineries_with_coordinates_and_id.json';
import { useRouter } from 'expo-router';

export default function MapScreen() {
  const router = useRouter();

  return (
    <MapView style={{ flex: 1 }}>
      {wineries.map((winery) => (
        <Marker
          key={winery.id}
          coordinate={{ latitude: winery.latitude, longitude: winery.longitude }}
          title={winery.name}
          onPress={() => router.push(`/winery/${winery.id}`)}
        />
      ))}
    </MapView>
  );
}
