// app/winery/[id].js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import wineries from '../../data/wineries_with_coordinates_and_id.json';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

// 🆕 Import your components!
import RatingSlider from '../../components/RatingSlider';
import FlavorTagSelector from '../../components/FlavorTagSelector';

const WINE_TYPES = [
  'Red', 'White', 'Rosé', 'Sparkling', 'Dessert',
  'Red Blend', 'White Blend', 'Orange'
];

export default function WineryDetail() {
  const { id, log } = useLocalSearchParams();
  const router = useRouter();

  const wineriesArray = wineries;
  const winery = wineriesArray.find((w) => w.id.toString() === id.toString());

  const [showLogForm, setShowLogForm] = useState(log === 'true');
  const [winesTried, setWinesTried] = useState([
    {
      wineName: '',
      wineType: 'Red',
      wineYear: '',
      flavorNotes: [],
      wineRatings: {
        sweetness: '',
        tannin: '',
        acidity: '',
        body: '',
        alcohol: '',
      },
      overallRating: 0,
      additionalNotes: '',
    },
  ]);
  const [currentWineIndex, setCurrentWineIndex] = useState(0); // 🆕 New State!
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [photo, setPhoto] = useState(null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permission to upload photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error picking the image.');
    }
  };

  const addNewWine = () => {
    setWinesTried((prevWines) => [
      ...prevWines,
      {
        wineName: '',
        wineType: 'Red',
        wineYear: '',
        flavorNotes: [],
        wineRatings: {
          sweetness: '',
          tannin: '',
          acidity: '',
          body: '',
          alcohol: '',
        },
        overallRating: 0,
        additionalNotes: '',
      },
    ]);
    setCurrentWineIndex(winesTried.length); // Move to new wine form
  };

  const handleSave = () => {
    const visitData = {
      wineryId: winery.id,
      wineryName: winery.name,
      date: visitDate,
      winesTried,
      additionalNotes,
      photoUri: photo,
    };

    console.log('Saving visit:', visitData);

    Alert.alert('Visit Logged', `Your visit to ${winery.name} has been saved!`, [
      { text: 'OK', onPress: () => setShowLogForm(false) },
    ]);
  };

  if (!winery) {
    return (
      <View style={styles.centerContainer}>
        <Text>Winery not found</Text>
      </View>
    );
  }

  const wine = winesTried[currentWineIndex]; // 🎯 Only show one wine at a time

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        {!showLogForm && (
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{winery.name}</Text>
            <Text style={styles.address}>{winery.address}</Text>

            <View style={styles.divider} />

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={() => setShowLogForm(true)}>
                <Ionicons name="wine" size={24} color="#8E2DE2" />
                <Text style={styles.actionButtonText}>Log Your Visit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  Alert.alert('Navigation', 'Opening directions...');
                }}
              >
                <Ionicons name="navigate" size={24} color="#8E2DE2" />
                <Text style={styles.actionButtonText}>Directions</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  Alert.alert('Website', `Opening ${winery.name} website...`);
                }}
              >
                <Ionicons name="globe" size={24} color="#8E2DE2" />
                <Text style={styles.actionButtonText}>Website</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {showLogForm && (
          <View style={styles.formContainer}>
            <Text style={styles.header}>Log your visit to {winery.name}</Text>

            <Text style={styles.label}>Visit Date:</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={visitDate}
              onChangeText={setVisitDate}
            />

            {/* Single Wine Form */}
            <View style={styles.singleWineForm}>
              <Text style={styles.subHeader}>Wine #{currentWineIndex + 1}</Text>

              <Text style={styles.label}>Wine Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter the wine name"
                value={wine.wineName}
                onChangeText={(text) => {
                  const updatedWines = [...winesTried];
                  updatedWines[currentWineIndex].wineName = text;
                  setWinesTried(updatedWines);
                }}
              />

              <Text style={styles.label}>Wine Type:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={wine.wineType}
                  onValueChange={(itemValue) => {
                    const updatedWines = [...winesTried];
                    updatedWines[currentWineIndex].wineType = itemValue;
                    setWinesTried(updatedWines);
                  }}
                >
                  {WINE_TYPES.map((type) => (
                    <Picker.Item label={type} value={type} key={type} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Wine Year:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter wine year"
                keyboardType="numeric"
                value={wine.wineYear}
                onChangeText={(text) => {
                  const updatedWines = [...winesTried];
                  updatedWines[currentWineIndex].wineYear = text;
                  setWinesTried(updatedWines);
                }}
              />

              <FlavorTagSelector
                selectedTags={wine.flavorNotes}
                onTagsChange={(tags) => {
                  const updatedWines = [...winesTried];
                  updatedWines[currentWineIndex].flavorNotes = tags;
                  setWinesTried(updatedWines);
                }}
              />

              {['sweetness', 'tannin', 'acidity', 'body', 'alcohol'].map((attribute) => (
                <View key={attribute} style={{ marginBottom: 15 }}>
                  <RatingSlider
                    label={attribute.charAt(0).toUpperCase() + attribute.slice(1)}
                    value={parseFloat(wine.wineRatings[attribute]) || 0}
                    onValueChange={(value) => {
                      const updatedWines = [...winesTried];
                      updatedWines[currentWineIndex].wineRatings[attribute] = value.toString();
                      setWinesTried(updatedWines);
                    }}
                    showStars={false}
                  />
                  <TextInput
                    style={styles.smallInput}
                    keyboardType="numeric"
                    value={wine.wineRatings[attribute]}
                    onChangeText={(text) => {
                      const updatedWines = [...winesTried];
                      updatedWines[currentWineIndex].wineRatings[attribute] = text;
                      setWinesTried(updatedWines);
                    }}
                    placeholder="Type value"
                  />
                </View>
              ))}

              <RatingSlider
                label="Overall Rating"
                value={wine.overallRating}
                onValueChange={(value) => {
                  const updatedWines = [...winesTried];
                  updatedWines[currentWineIndex].overallRating = value;
                  setWinesTried(updatedWines);
                }}
                showStars={true}
              />
            </View>

            {/* Switch between Wines */}
            <View style={styles.switchWineButtons}>
              <TouchableOpacity
                disabled={currentWineIndex === 0}
                onPress={() => setCurrentWineIndex(currentWineIndex - 1)}
              >
                <Text style={styles.switchWineText}>⬅️ Previous Wine</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={currentWineIndex === winesTried.length - 1}
                onPress={() => setCurrentWineIndex(currentWineIndex + 1)}
              >
                <Text style={styles.switchWineText}>Next Wine ➡️</Text>
              </TouchableOpacity>
            </View>

            {/* Add New Wine */}
            <TouchableOpacity style={styles.addWineButton} onPress={addNewWine}>
              <Ionicons name="add-circle" size={24} color="#8E2DE2" style={{ marginRight: 8 }} />
              <Text style={styles.addWineButtonText}>Add Another Wine</Text>
            </TouchableOpacity>

            {/* Photo Upload */}
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Ionicons name="camera" size={24} color="#8E2DE2" style={{ marginRight: 8 }} />
              <Text>{photo ? 'Change Photo' : 'Add Photo'}</Text>
            </TouchableOpacity>

            {photo && <Image source={{ uri: photo }} style={styles.imagePreview} />}

            {/* Save / Cancel */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowLogForm(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  address: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 12,
    color: '#8E2DE2',
  },
  formContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    fontSize: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  singleWineForm: {
    marginBottom: 30,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  addWineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 6,
    marginTop: 20,
  },
  addWineButtonText: {
    fontSize: 16,
    color: '#8E2DE2',
    fontWeight: 'bold',
  },
  imagePicker: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  button: {
    padding: 15,
    backgroundColor: '#8E2DE2',
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchWineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  switchWineText: {
    fontSize: 14,
    color: '#8E2DE2',
    fontWeight: 'bold',
  },
  smallInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    width: 80,
    marginTop: 5,
    alignSelf: 'center',
    textAlign: 'center',
  },
});

