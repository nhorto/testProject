import { Linking, Platform } from 'react-native';

// Function to open maps with directions
export const openDirections = (address) => {
  // URL encode the address
  const encodedAddress = encodeURIComponent(address);
  
  // Determine the appropriate URL scheme based on the platform
  let url = '';
  
  if (Platform.OS === 'ios') {
    // For iOS, use Apple Maps or Google Maps
    url = `maps://app?daddr=${encodedAddress}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // If Apple Maps is not available, try Google Maps
          url = `https://maps.google.com/maps?daddr=${encodedAddress}`;
          return Linking.openURL(url);
        }
      })
      .catch((error) => console.error('An error occurred:', error));
  } else {
    // For Android, use Google Maps
    url = `https://maps.google.com/maps?daddr=${encodedAddress}`;
    Linking.openURL(url).catch((error) => console.error('An error occurred:', error));
  }
};

// Function to open a website URL
export const openWebsite = (websiteUrl) => {
  // If the URL doesn't start with http or https, add it
  if (!/^https?:\/\//i.test(websiteUrl)) {
    websiteUrl = 'https:' + websiteUrl;
  }
  
  Linking.openURL(websiteUrl).catch((error) => {
    console.error('An error occurred while opening the website:', error);
  });
};