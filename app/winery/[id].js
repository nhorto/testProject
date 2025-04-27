// app/winery/[id].js (Enhanced Winery Detail Page with Visit Logging)
import React, { useState, useEffect } from 'react';
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
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import wineries from '../../data/wineries_with_coordinates_and_id.json';
import * as ImagePicker from 'expo-image-picker';

export default function WineryDetail() {
  const { id, log } = useLocalSearchParams();
  const router = useRouter();
  
  // Convert the wineries data to more accessible format
  const wineriesArray = wineries;
  
  // Find the selected winery
  const winery = wineriesArray.find(w => w.id.toString() === id.toString());
  
  // Form state for logging a visit
  const [showLogForm, setShowLogForm] = useState(log === 'true');
  const [ratings, setRatings] = useState({
    sweetness: '',
    tannins: '',
    alcohol: '',
  });
  const [winesTried, setWinesTried] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [photo, setPhoto] = useState(null);

  // Function to pick an image
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permission to upload photos.');
        return;
      }
      
      // Launch image library
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

  const handleSave = () => {
    // Here you would save the data to your backend or local storage
    // For now, we'll just show an alert
    Alert.alert(
      'Visit Logged',
      `Your visit to ${winery.name} has been saved!`,
      [{ text: 'OK', onPress: () => setShowLogForm(false) }]
    );
    
    // In a real app, you would save the data:
    // const visitData = {
    //   wineryId: winery.id,
    //   wineryName: winery.name,
    //   date: visitDate,
    //   winesTried,
    //   ratings,
    //   additionalNotes,
    //   photoUri: photo,
    // };
    // saveVisitToStorage(visitData);
  };

  if (!winery) {
    return (
      <View style={styles.centerContainer}>
        <Text>Winery not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Winery Details Section */}
        {!showLogForm && (
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{winery.name}</Text>
            <Text style={styles.address}>{winery.address}</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => setShowLogForm(true)}
              >
                <Ionicons name="wine" size={24} color="#8E2DE2" />
                <Text style={styles.actionButtonText}>Log Your Visit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  // In a real app, you might open directions in maps
                  Alert.alert('Navigation', 'Opening directions...');
                }}
              >
                <Ionicons name="navigate" size={24} color="#8E2DE2" />
                <Text style={styles.actionButtonText}>Directions</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  // In a real app, you might open the winery's website
                  Alert.alert('Website', `Opening ${winery.name} website...`);
                }}
              >
                <Ionicons name="globe" size={24} color="#8E2DE2" />
                <Text style={styles.actionButtonText}>Website</Text>
              </TouchableOpacity>
            </View>
            
            {/* Here you could add additional sections like reviews, photos, etc. */}
          </View>
        )}
        
        {/* Log Visit Form */}
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
            
            <Text style={styles.label}>Wines Tried:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the wines you tried"
              value={winesTried}
              onChangeText={setWinesTried}
            />

            <Text style={styles.label}>Rate Sweetness (0-5):</Text>
            <TextInput
              style={styles.input}
              placeholder="0-5"
              keyboardType="numeric"
              value={ratings.sweetness}
              onChangeText={(value) =>
                setRatings((prev) => ({ ...prev, sweetness: value }))
              }
            />

            <Text style={styles.label}>Rate Tannins (0-5):</Text>
            <TextInput
              style={styles.input}
              placeholder="0-5"
              keyboardType="numeric"
              value={ratings.tannins}
              onChangeText={(value) =>
                setRatings((prev) => ({ ...prev, tannins: value }))
              }
            />

            <Text style={styles.label}>Rate Alcohol (0-5):</Text>
            <TextInput
              style={styles.input}
              placeholder="0-5"
              keyboardType="numeric"
              value={ratings.alcohol}
              onChangeText={(value) =>
                setRatings((prev) => ({ ...prev, alcohol: value }))
              }
            />

            <Text style={styles.label}>Additional Notes:</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Write any additional comments..."
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Ionicons name="camera" size={24} color="#8E2DE2" style={{ marginRight: 8 }} />
              <Text>{photo ? 'Change Photo' : 'Add Photo'}</Text>
            </TouchableOpacity>
            
            {photo && (
              <Image source={{ uri: photo }} style={styles.imagePreview} />
            )}

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
  },
  address: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
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
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
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
});