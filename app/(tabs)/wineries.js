// app/(tabs)/wineries.js (FlatList & Search)
import { useState } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import wineries from '../../data/wineries_with_coordinates_and_id.json';

export default function Wineries() {
  const [search, setSearch] = useState('');

  const filteredWineries = wineries.filter(winery => winery.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput placeholder="Search Wineries..." value={search} onChangeText={setSearch} style={{ padding: 10, borderWidth: 1 }} />
      <FlatList
        data={filteredWineries}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <Text style={{ padding: 10 }}>{item.name}</Text>}
      />
    </View>
  );
}