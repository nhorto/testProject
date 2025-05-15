// app/index.js (updated)
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { AuthContext } from './_layout';

// A custom hook that forces navigation based on auth state
function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';
    
    if (!user && inAuthGroup) {
      // If the user is not signed in and the initial segment is in the protected group,
      // redirect to the sign-in page
      router.replace('/login');
    } else if (user && !inAuthGroup) {
      // If the user is signed in and the initial segment is not in the protected group,
      // redirect to the home page
      router.replace('/(tabs)/map');
    }
  }, [user, segments]);
}

export default function Index() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  
  // Use the custom hook to handle protected routes
  useProtectedRoute(user);

  // Show loading indicator while determining the route
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#8E2DE2" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
});